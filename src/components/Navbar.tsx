'use client';

import React, { useState, useEffect, useRef } from 'react';

import { cn } from '@/lib/utils';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';

import { Button } from '@/components/ui/button';

import Link from 'next/link';

export default function Navbar() {
  const [show, setShow] = useState(false);
  const menuRef = useRef<HTMLElement | null>(null); // Reference to the menu

  useEffect(() => {
    // Function to handle the outside click
    function handleOutsideClick(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShow(false);
      }
    }

    // Add the outside click listener
    document.addEventListener('mousedown', handleOutsideClick);

    // Cleanup the listener on component unmount
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  return (
    <NavigationMenu ref={menuRef}>
      <NavigationMenuList className='w-screen justify-center fixed gap-4 pt-8 text-sm'>
        {show ? (
          <>
            <NavigationMenuItem>
              <Link href='/'>Home</Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href='/experience'>Experience</Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href='/projects'>Projects</Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href='/misc'>Misc</Link>
            </NavigationMenuItem>
          </>
        ) : (
          <Button
            variant='ghost'
            className='rounded-full h-4 w-4 p-4'
            onClick={() => setShow(true)}
          >
            <p className='text-xl text-slate-400 hover:text-slate-300'>☉</p>
          </Button>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
