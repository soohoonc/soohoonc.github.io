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
      <NavigationMenuList className="w-screen flex flex-row justify-center gap-4">
        <NavigationMenuItem>
          <Link href="/">
            <div>
              Soohoon Choi
            </div>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/experience">
            <div>
              Experience
            </div>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/blogs">
            <div>
              Blogs
            </div>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/projects">
            <div>
              Projects
            </div>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/about">
            <div>
              About
            </div>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}