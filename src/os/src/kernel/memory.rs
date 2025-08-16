use std::collections::{HashMap, BTreeMap, VecDeque};
use wasm_bindgen::prelude::*;
use crate::kernel::process::PID;

// Virtual Memory Management - Based on OS:TEP Chapters 13-24
// Implements paging, page tables, TLB, and swapping

pub type VAddr = u32;      // Virtual address
pub type PAddr = u32;      // Physical address  
pub type PageNum = u32;    // Page number
pub type FrameNum = u32;   // Physical frame number
pub type Offset = u32;     // Offset within page

pub const PAGE_SIZE: u32 = 4096;    // 4KB pages
pub const PAGE_SHIFT: u32 = 12;     // log2(PAGE_SIZE)
pub const PAGE_MASK: u32 = 0xFFF;   // Mask for page offset

// Page table entry
#[derive(Debug, Clone, Copy)]
pub struct PageTableEntry {
    pub frame_num: FrameNum,
    pub present: bool,      // Is page in memory?
    pub dirty: bool,        // Has page been modified?
    pub accessed: bool,     // Has page been accessed recently?
    pub readable: bool,     // Can read from page?
    pub writable: bool,     // Can write to page?
    pub executable: bool,   // Can execute from page?
    pub user: bool,         // Is page accessible to user mode?
}

impl PageTableEntry {
    pub fn new() -> Self {
        Self {
            frame_num: 0,
            present: false,
            dirty: false,
            accessed: false,
            readable: true,
            writable: false,
            executable: false,
            user: true,
        }
    }

    pub fn new_with_frame(frame_num: FrameNum) -> Self {
        Self {
            frame_num,
            present: true,
            dirty: false,
            accessed: false,
            readable: true,
            writable: true,
            executable: false,
            user: true,
        }
    }
}

// Page table for a process
#[derive(Debug, Clone)]
pub struct PageTable {
    pub entries: HashMap<PageNum, PageTableEntry>,
    pub process_id: PID,
}

impl PageTable {
    pub fn new(process_id: PID) -> Self {
        Self {
            entries: HashMap::new(),
            process_id,
        }
    }

    pub fn map_page(&mut self, vpage: PageNum, frame: FrameNum, writable: bool) {
        let mut pte = PageTableEntry::new_with_frame(frame);
        pte.writable = writable;
        self.entries.insert(vpage, pte);
    }

    pub fn unmap_page(&mut self, vpage: PageNum) -> Option<PageTableEntry> {
        self.entries.remove(&vpage)
    }

    pub fn lookup(&mut self, vpage: PageNum) -> Option<&mut PageTableEntry> {
        if let Some(pte) = self.entries.get_mut(&vpage) {
            pte.accessed = true;
            Some(pte)
        } else {
            None
        }
    }

    pub fn get_dirty_pages(&self) -> Vec<PageNum> {
        self.entries
            .iter()
            .filter(|(_, pte)| pte.dirty && pte.present)
            .map(|(&page, _)| page)
            .collect()
    }
}

// TLB (Translation Lookaside Buffer) entry
#[derive(Debug, Clone, Copy)]
pub struct TLBEntry {
    pub valid: bool,
    pub vpage: PageNum,
    pub frame: FrameNum,
    pub last_access: u64,
    pub process_id: PID,
}

impl TLBEntry {
    pub fn new() -> Self {
        Self {
            valid: false,
            vpage: 0,
            frame: 0,
            last_access: 0,
            process_id: 0,
        }
    }
}

// Translation Lookaside Buffer
#[derive(Debug)]
pub struct TLB {
    entries: Vec<TLBEntry>,
    size: usize,
    current_time: u64,
    hits: u64,
    misses: u64,
}

impl TLB {
    pub fn new(size: usize) -> Self {
        Self {
            entries: vec![TLBEntry::new(); size],
            size,
            current_time: 0,
            hits: 0,
            misses: 0,
        }
    }

    pub fn lookup(&mut self, vpage: PageNum, process_id: PID) -> Option<FrameNum> {
        self.current_time += 1;
        
        for entry in &mut self.entries {
            if entry.valid && entry.vpage == vpage && entry.process_id == process_id {
                entry.last_access = self.current_time;
                self.hits += 1;
                return Some(entry.frame);
            }
        }
        
        self.misses += 1;
        None
    }

    pub fn insert(&mut self, vpage: PageNum, frame: FrameNum, process_id: PID) {
        self.current_time += 1;
        
        // Find an invalid entry first
        for entry in &mut self.entries {
            if !entry.valid {
                *entry = TLBEntry {
                    valid: true,
                    vpage,
                    frame,
                    last_access: self.current_time,
                    process_id,
                };
                return;
            }
        }
        
        // If no invalid entry, use LRU replacement
        let mut lru_idx = 0;
        let mut oldest_time = self.entries[0].last_access;
        
        for (i, entry) in self.entries.iter().enumerate() {
            if entry.last_access < oldest_time {
                oldest_time = entry.last_access;
                lru_idx = i;
            }
        }
        
        self.entries[lru_idx] = TLBEntry {
            valid: true,
            vpage,
            frame,
            last_access: self.current_time,
            process_id,
        };
    }

    pub fn invalidate_process(&mut self, process_id: PID) {
        for entry in &mut self.entries {
            if entry.process_id == process_id {
                entry.valid = false;
            }
        }
    }

    pub fn flush(&mut self) {
        for entry in &mut self.entries {
            entry.valid = false;
        }
    }

    pub fn get_hit_rate(&self) -> f64 {
        if self.hits + self.misses == 0 {
            0.0
        } else {
            self.hits as f64 / (self.hits + self.misses) as f64
        }
    }
}

// Physical memory frame
#[derive(Debug, Clone)]
pub struct Frame {
    pub data: Vec<u8>,
    pub allocated: bool,
    pub process_id: Option<PID>,
    pub vpage: Option<PageNum>,
    pub last_access: u64,
}

impl Frame {
    pub fn new() -> Self {
        Self {
            data: vec![0; PAGE_SIZE as usize],
            allocated: false,
            process_id: None,
            vpage: None,
            last_access: 0,
        }
    }
}

// Page replacement policies
#[derive(Debug, Clone, Copy)]
pub enum ReplacementPolicy {
    FIFO,    // First In First Out
    LRU,     // Least Recently Used
    Clock,   // Clock algorithm
    Random,  // Random replacement
}

// Physical memory manager
#[derive(Debug)]
pub struct PhysicalMemory {
    frames: Vec<Frame>,
    free_frames: VecDeque<FrameNum>,
    total_frames: usize,
    replacement_policy: ReplacementPolicy,
    clock_hand: usize,  // For clock algorithm
    current_time: u64,
}

impl PhysicalMemory {
    pub fn new(total_frames: usize) -> Self {
        let mut frames = Vec::with_capacity(total_frames);
        let mut free_frames = VecDeque::new();
        
        for i in 0..total_frames {
            frames.push(Frame::new());
            free_frames.push_back(i as FrameNum);
        }
        
        Self {
            frames,
            free_frames,
            total_frames,
            replacement_policy: ReplacementPolicy::LRU,
            clock_hand: 0,
            current_time: 0,
        }
    }

    pub fn allocate_frame(&mut self) -> Option<FrameNum> {
        if let Some(frame_num) = self.free_frames.pop_front() {
            self.frames[frame_num as usize].allocated = true;
            Some(frame_num)
        } else {
            None
        }
    }

    pub fn deallocate_frame(&mut self, frame_num: FrameNum) {
        if frame_num < self.total_frames as u32 {
            let frame = &mut self.frames[frame_num as usize];
            frame.allocated = false;
            frame.process_id = None;
            frame.vpage = None;
            frame.data.fill(0);
            self.free_frames.push_back(frame_num);
        }
    }

    pub fn get_free_frame_count(&self) -> usize {
        self.free_frames.len()
    }

    pub fn access_frame(&mut self, frame_num: FrameNum) {
        self.current_time += 1;
        if frame_num < self.total_frames as u32 {
            self.frames[frame_num as usize].last_access = self.current_time;
        }
    }

    pub fn set_replacement_policy(&mut self, policy: ReplacementPolicy) {
        self.replacement_policy = policy;
    }
}

// Virtual memory system that ties everything together
#[derive(Debug)]
pub struct VirtualMemorySystem {
    page_tables: HashMap<PID, PageTable>,
    physical_memory: PhysicalMemory,
    tlb: TLB,
    
    // Swapping support
    swap_space: HashMap<(PID, PageNum), Vec<u8>>, // Simulated disk
    page_faults: u64,
    
    // Statistics
    page_allocations: u64,
    page_deallocations: u64,
    swap_ins: u64,
    swap_outs: u64,
}

impl VirtualMemorySystem {
    pub fn new(physical_frames: usize, tlb_size: usize) -> Self {
        Self {
            page_tables: HashMap::new(),
            physical_memory: PhysicalMemory::new(physical_frames),
            tlb: TLB::new(tlb_size),
            swap_space: HashMap::new(),
            page_faults: 0,
            page_allocations: 0,
            page_deallocations: 0,
            swap_ins: 0,
            swap_outs: 0,
        }
    }

    pub fn create_address_space(&mut self, process_id: PID) {
        self.page_tables.insert(process_id, PageTable::new(process_id));
    }

    pub fn destroy_address_space(&mut self, process_id: PID) {
        if let Some(page_table) = self.page_tables.remove(&process_id) {
            // Free all physical frames
            for (_, pte) in page_table.entries {
                if pte.present {
                    self.physical_memory.deallocate_frame(pte.frame_num);
                }
            }
        }
        
        // Invalidate TLB entries for this process
        self.tlb.invalidate_process(process_id);
        
        // Remove from swap space
        self.swap_space.retain(|&(pid, _), _| pid != process_id);
    }

    // Translate virtual address to physical address
    pub fn translate(&mut self, process_id: PID, vaddr: VAddr) -> Result<PAddr, String> {
        let vpage = vaddr >> PAGE_SHIFT;
        let offset = vaddr & PAGE_MASK;

        // Try TLB first
        if let Some(frame) = self.tlb.lookup(vpage, process_id) {
            let paddr = (frame << PAGE_SHIFT) | offset;
            self.physical_memory.access_frame(frame);
            return Ok(paddr);
        }

        // TLB miss - consult page table
        let page_table = self.page_tables.get_mut(&process_id)
            .ok_or("Process not found")?;

        if let Some(pte) = page_table.lookup(vpage) {
            if pte.present {
                // Page is in memory
                self.tlb.insert(vpage, pte.frame_num, process_id);
                let paddr = (pte.frame_num << PAGE_SHIFT) | offset;
                self.physical_memory.access_frame(pte.frame_num);
                Ok(paddr)
            } else {
                // Page fault - need to load from swap
                self.handle_page_fault(process_id, vpage)
                    .and_then(|frame| {
                        let paddr = (frame << PAGE_SHIFT) | offset;
                        Ok(paddr)
                    })
            }
        } else {
            // Page not allocated - allocate new page
            self.allocate_page(process_id, vpage)
                .and_then(|frame| {
                    let paddr = (frame << PAGE_SHIFT) | offset;
                    Ok(paddr)
                })
        }
    }

    fn handle_page_fault(&mut self, process_id: PID, vpage: PageNum) -> Result<FrameNum, String> {
        self.page_faults += 1;

        // Try to allocate a physical frame
        let frame = if let Some(frame) = self.physical_memory.allocate_frame() {
            frame
        } else {
            // No free frames - need to evict a page
            self.evict_page()?
        };

        // Load page from swap space if it exists
        if let Some(data) = self.swap_space.remove(&(process_id, vpage)) {
            self.physical_memory.frames[frame as usize].data = data;
            self.swap_ins += 1;
        }

        // Update page table
        let page_table = self.page_tables.get_mut(&process_id)
            .ok_or("Process not found")?;
        
        let mut pte = PageTableEntry::new_with_frame(frame);
        pte.present = true;
        page_table.entries.insert(vpage, pte);

        // Update TLB
        self.tlb.insert(vpage, frame, process_id);

        // Update frame info
        self.physical_memory.frames[frame as usize].process_id = Some(process_id);
        self.physical_memory.frames[frame as usize].vpage = Some(vpage);

        Ok(frame)
    }

    fn evict_page(&mut self) -> Result<FrameNum, String> {
        // Find a page to evict using the configured replacement policy
        let frame_to_evict = match self.physical_memory.replacement_policy {
            ReplacementPolicy::LRU => self.find_lru_frame(),
            ReplacementPolicy::FIFO => self.find_fifo_frame(),
            ReplacementPolicy::Clock => self.find_clock_frame(),
            ReplacementPolicy::Random => self.find_random_frame(),
        };

        let frame_num = frame_to_evict.ok_or("No frame to evict")?;
        
        // Get the page info before evicting
        let frame = &self.physical_memory.frames[frame_num as usize];
        let evicted_process = frame.process_id.ok_or("Invalid frame")?;
        let evicted_vpage = frame.vpage.ok_or("Invalid frame")?;

        // Check if page is dirty and needs to be written to swap
        if let Some(page_table) = self.page_tables.get(&evicted_process) {
            if let Some(pte) = page_table.entries.get(&evicted_vpage) {
                if pte.dirty {
                    // Write page to swap space
                    let data = frame.data.clone();
                    self.swap_space.insert((evicted_process, evicted_vpage), data);
                    self.swap_outs += 1;
                }
            }
        }

        // Update page table to mark page as not present
        if let Some(page_table) = self.page_tables.get_mut(&evicted_process) {
            if let Some(pte) = page_table.entries.get_mut(&evicted_vpage) {
                pte.present = false;
            }
        }

        // Invalidate TLB entry
        self.tlb.invalidate_process(evicted_process);

        // Clear the frame
        self.physical_memory.deallocate_frame(frame_num);

        Ok(frame_num)
    }

    fn find_lru_frame(&self) -> Option<FrameNum> {
        let mut oldest_time = u64::MAX;
        let mut oldest_frame = None;

        for (i, frame) in self.physical_memory.frames.iter().enumerate() {
            if frame.allocated && frame.last_access < oldest_time {
                oldest_time = frame.last_access;
                oldest_frame = Some(i as FrameNum);
            }
        }

        oldest_frame
    }

    fn find_fifo_frame(&self) -> Option<FrameNum> {
        // Simple FIFO - just return the first allocated frame
        for (i, frame) in self.physical_memory.frames.iter().enumerate() {
            if frame.allocated {
                return Some(i as FrameNum);
            }
        }
        None
    }

    fn find_clock_frame(&mut self) -> Option<FrameNum> {
        // Clock algorithm implementation
        let start = self.physical_memory.clock_hand;
        loop {
            let frame = &mut self.physical_memory.frames[self.physical_memory.clock_hand];
            
            if frame.allocated {
                // Check accessed bit (simulated with recent access)
                let recently_accessed = self.physical_memory.current_time - frame.last_access < 10;
                
                if !recently_accessed {
                    let result = self.physical_memory.clock_hand as FrameNum;
                    self.physical_memory.clock_hand = (self.physical_memory.clock_hand + 1) % self.physical_memory.total_frames;
                    return Some(result);
                } else {
                    // Give it a second chance
                    frame.last_access = 0;
                }
            }
            
            self.physical_memory.clock_hand = (self.physical_memory.clock_hand + 1) % self.physical_memory.total_frames;
            
            if self.physical_memory.clock_hand == start {
                break; // Avoid infinite loop
            }
        }
        
        // Fallback to first allocated frame
        self.find_fifo_frame()
    }

    fn find_random_frame(&self) -> Option<FrameNum> {
        // Simple random replacement (using a pseudo-random approach)
        let allocated_frames: Vec<_> = self.physical_memory.frames
            .iter()
            .enumerate()
            .filter(|(_, frame)| frame.allocated)
            .map(|(i, _)| i as FrameNum)
            .collect();

        if allocated_frames.is_empty() {
            None
        } else {
            // Use current time as simple random seed
            let index = (self.physical_memory.current_time as usize) % allocated_frames.len();
            Some(allocated_frames[index])
        }
    }

    fn allocate_page(&mut self, process_id: PID, vpage: PageNum) -> Result<FrameNum, String> {
        self.page_allocations += 1;

        let frame = if let Some(frame) = self.physical_memory.allocate_frame() {
            frame
        } else {
            // No free frames - need to evict
            self.evict_page()?
        };

        // Update page table
        let page_table = self.page_tables.get_mut(&process_id)
            .ok_or("Process not found")?;
        
        page_table.map_page(vpage, frame, true);

        // Update TLB
        self.tlb.insert(vpage, frame, process_id);

        // Update frame info
        self.physical_memory.frames[frame as usize].process_id = Some(process_id);
        self.physical_memory.frames[frame as usize].vpage = Some(vpage);

        Ok(frame)
    }

    pub fn read_memory(&mut self, process_id: PID, vaddr: VAddr, size: usize) -> Result<Vec<u8>, String> {
        let mut result = Vec::new();
        let mut current_addr = vaddr;
        let mut remaining = size;

        while remaining > 0 {
            let paddr = self.translate(process_id, current_addr)?;
            let frame_num = paddr >> PAGE_SHIFT;
            let offset = (paddr & PAGE_MASK) as usize;
            
            let frame = &self.physical_memory.frames[frame_num as usize];
            let bytes_in_page = std::cmp::min(remaining, PAGE_SIZE as usize - offset);
            
            result.extend_from_slice(&frame.data[offset..offset + bytes_in_page]);
            
            current_addr += bytes_in_page as u32;
            remaining -= bytes_in_page;
        }

        Ok(result)
    }

    pub fn write_memory(&mut self, process_id: PID, vaddr: VAddr, data: &[u8]) -> Result<(), String> {
        let mut current_addr = vaddr;
        let mut data_offset = 0;

        while data_offset < data.len() {
            let paddr = self.translate(process_id, current_addr)?;
            let frame_num = paddr >> PAGE_SHIFT;
            let offset = (paddr & PAGE_MASK) as usize;
            
            let frame = &mut self.physical_memory.frames[frame_num as usize];
            let bytes_in_page = std::cmp::min(data.len() - data_offset, PAGE_SIZE as usize - offset);
            
            frame.data[offset..offset + bytes_in_page].copy_from_slice(&data[data_offset..data_offset + bytes_in_page]);
            
            // Mark page as dirty
            if let Some(page_table) = self.page_tables.get_mut(&process_id) {
                let vpage = current_addr >> PAGE_SHIFT;
                if let Some(pte) = page_table.entries.get_mut(&vpage) {
                    pte.dirty = true;
                }
            }
            
            current_addr += bytes_in_page as u32;
            data_offset += bytes_in_page;
        }

        Ok(())
    }

    pub fn get_memory_stats(&self) -> MemoryStats {
        MemoryStats {
            total_frames: self.physical_memory.total_frames,
            free_frames: self.physical_memory.get_free_frame_count(),
            page_faults: self.page_faults,
            tlb_hit_rate: self.tlb.get_hit_rate(),
            swap_ins: self.swap_ins,
            swap_outs: self.swap_outs,
            page_allocations: self.page_allocations,
            page_deallocations: self.page_deallocations,
            swap_space_used: self.swap_space.len(),
        }
    }

    pub fn set_replacement_policy(&mut self, policy: u32) {
        let replacement_policy = match policy {
            0 => ReplacementPolicy::FIFO,
            1 => ReplacementPolicy::LRU,
            2 => ReplacementPolicy::Clock,
            3 => ReplacementPolicy::Random,
            _ => ReplacementPolicy::LRU,
        };
        self.physical_memory.set_replacement_policy(replacement_policy);
    }
}

#[derive(Debug, Clone)]
pub struct MemoryStats {
    pub total_frames: usize,
    pub free_frames: usize,
    pub page_faults: u64,
    pub tlb_hit_rate: f64,
    pub swap_ins: u64,
    pub swap_outs: u64,
    pub page_allocations: u64,
    pub page_deallocations: u64,
    pub swap_space_used: usize,
}

// WASM bindings for virtual memory system
#[wasm_bindgen]
pub struct VirtualMemoryInterface {
    vm_system: VirtualMemorySystem,
}

#[wasm_bindgen]
impl VirtualMemoryInterface {
    #[wasm_bindgen(constructor)]
    pub fn new(physical_frames: usize, tlb_size: usize) -> Self {
        Self {
            vm_system: VirtualMemorySystem::new(physical_frames, tlb_size),
        }
    }

    #[wasm_bindgen]
    pub fn create_address_space(&mut self, process_id: u32) {
        self.vm_system.create_address_space(process_id);
    }

    #[wasm_bindgen]
    pub fn destroy_address_space(&mut self, process_id: u32) {
        self.vm_system.destroy_address_space(process_id);
    }

    #[wasm_bindgen]
    pub fn translate(&mut self, process_id: u32, vaddr: u32) -> Option<u32> {
        self.vm_system.translate(process_id, vaddr).ok()
    }

    #[wasm_bindgen]
    pub fn read_memory(&mut self, process_id: u32, vaddr: u32, size: usize) -> Vec<u8> {
        self.vm_system.read_memory(process_id, vaddr, size).unwrap_or_default()
    }

    #[wasm_bindgen]
    pub fn write_memory(&mut self, process_id: u32, vaddr: u32, data: &[u8]) -> bool {
        self.vm_system.write_memory(process_id, vaddr, data).is_ok()
    }

    #[wasm_bindgen]
    pub fn get_memory_stats(&self) -> String {
        let stats = self.vm_system.get_memory_stats();
        format!(
            "Memory Stats:\n\
             Total Frames: {}\n\
             Free Frames: {}\n\
             Page Faults: {}\n\
             TLB Hit Rate: {:.2}%\n\
             Swap Ins: {}\n\
             Swap Outs: {}\n\
             Swap Space Used: {} pages",
            stats.total_frames,
            stats.free_frames,
            stats.page_faults,
            stats.tlb_hit_rate * 100.0,
            stats.swap_ins,
            stats.swap_outs,
            stats.swap_space_used
        )
    }

    #[wasm_bindgen]
    pub fn set_replacement_policy(&mut self, policy: u32) {
        self.vm_system.set_replacement_policy(policy);
    }

    #[wasm_bindgen]
    pub fn get_page_fault_count(&self) -> u64 {
        self.vm_system.page_faults
    }

    #[wasm_bindgen]
    pub fn get_tlb_hit_rate(&self) -> f64 {
        self.vm_system.tlb.get_hit_rate()
    }
}