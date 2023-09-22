'use client'

import * as React from "react"

import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import Link from "next/link"

export default function Navbar() {
  return (
    <NavigationMenu>
      <NavigationMenuList className="w-screen flex flex-row justify-center gap-4 my-2">
        <NavigationMenuItem>
          <Link href="/">
              Home
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/experience">
              Experience
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/blogs">
              Blogs
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/projects">
              Projects
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/about">
              About
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}