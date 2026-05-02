"use client";

import Image from "next/image";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { LogOut, Shield, User, LayoutDashboard } from "lucide-react";


const Navbar = () => {

    const { signOut, useSession } = authClient;
    const { data: session } = useSession();

    const isAdmin = session?.user?.role === "admin";

  return (
    <header className="w-full bg-[#fffefb] py-3 px-6 shadow-sm">
      <div className="max-w-[1140px] mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.webp"
            alt="Cardone Capital Logo"
            width={200}
            height={80}
            className="object-contain"
          />
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex gap-6 text-sm font-medium text-black">
          {session && (
              <Link href="/dashboard" className="text-[#c7202e] font-bold">
                Dashboard
              </Link>
          )}
          <Link href="/investments">Investments</Link>
          <Link href="/ira-info">401k/IRA</Link>
          <Link href="/overview">Company</Link>
          <Link href="/team">Team</Link>
          <Link href="/contact">Contact</Link>
        </nav>

        {/* Buttons */}
        <div className="flex items-center gap-4">
          {!session ? (
            <>
              <a
                href="/auth/login"
                rel="noopener noreferrer"
                className="hidden md:flex border border-black text-black font-semibold px-4 py-2 text-sm rounded-sm hover:bg-gray-100 transition"
              >
                Log In
              </a>
              <a href="/auth/register">
              <button className="bg-[#c7202e] text-white px-4 py-2 text-sm font-semibold rounded-sm hover:bg-red-600 transition">
                Get Started
              </button>
              </a>
            </>
          ) : (
            <div className="flex items-center gap-3">
              {/* Admin Badge */}
              {isAdmin && (
                <Badge variant="secondary" className="flex items-center gap-1 bg-gray-100 text-black border-none">
                  <Shield className="h-3 w-3" />
                  Admin
                </Badge>
              )}

              {/* User Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="focus:outline-none">
                    <Avatar className="h-9 w-9 border border-gray-200">
                      <AvatarImage src={session.user.image || ""} alt={session.user.name || ""} />
                      <AvatarFallback className="bg-[#c7202e] text-white text-xs">
                        {session.user.name?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{session.user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{session.user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">
                      <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <User className="mr-2 h-4 w-4" /> Profile
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">
                        <Shield className="mr-2 h-4 w-4" /> Admin Panel
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => signOut()} 
                    className="text-red-600 focus:text-red-600 cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        {/* <div className="md:hidden">
          <button>
            <span className="sr-only">Open menu</span>
            <div className="space-y-1">
              <span className="block w-6 h-0.5 bg-black"></span>
              <span className="block w-6 h-0.5 bg-black"></span>
              <span className="block w-6 h-0.5 bg-black"></span>
            </div>
          </button>
        </div> */}
      </div>
    </header>
  );
};

export default Navbar;

