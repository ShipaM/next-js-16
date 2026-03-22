"use client";

import { getTabValue } from "@/lib/utils";
import { Session } from "next-auth";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { LayoutList, Menu, Plus, Users, X } from "lucide-react";
import { signOut } from "next-auth/react";
import type { FC } from "react";
import { useState, useRef, useEffect } from "react";

type HeaderNavProps = {
  session: Session | null;
};

export const HeaderNav: FC<HeaderNavProps> = ({ session }) => {
  const pathname = usePathname();
  const tabValue = getTabValue(pathname);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener("keydown", handleEscape);
      // Trap focus within mobile menu
      mobileMenuRef.current?.focus();
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [mobileMenuOpen]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        mobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target as Node) &&
        !menuButtonRef.current?.contains(e.target as Node)
      ) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileMenuOpen]);

  if (!session?.user) {
    return (
      <div className="flex justify-end">
        <Button variant="secondary" size="sm">
          <Link href="/login">Login</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* Desktop navigation */}
      <div className="hidden md:grid grid-cols-3 items-center gap-4">
        <div />
        <div className="flex justify-center">
          <Tabs value={tabValue} className="w-fit">
            <TabsList aria-label="Main navigation">
              <TabsTrigger value="dashboard" asChild>
                <Link href="/dashboard">
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  Create collection
                </Link>
              </TabsTrigger>
              <TabsTrigger value="builds" asChild>
                <Link href="/builds">
                  <LayoutList className="h-4 w-4" aria-hidden="true" />
                  My collections
                </Link>
              </TabsTrigger>
              <TabsTrigger value="explore" asChild>
                <Link href="/builds/explore">
                  <Users className="h-4 w-4" aria-hidden="true" />
                  Public collections
                </Link>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            type="button"
            onClick={() => signOut({ redirectTo: "/" })}
          >
            Logout
          </Button>
        </div>
      </div>

      {/* Mobile navigation */}
      <div className="md:hidden flex items-center justify-end gap-2">
        <Button
          variant="ghost"
          size="sm"
          type="button"
          onClick={() => signOut({ redirectTo: "/" })}
          className="h-9 px-3"
        >
          Logout
        </Button>
        <Button
          ref={menuButtonRef}
          variant="outline"
          size="sm"
          className="h-9 w-9 p-0"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? (
            <X className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Menu className="h-4 w-4" aria-hidden="true" />
          )}
        </Button>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          id="mobile-menu"
          role="menu"
          aria-label="Mobile navigation"
          className="md:hidden absolute top-16 right-4 z-50 bg-background border rounded-lg shadow-lg p-2 flex flex-col gap-1"
        >
          <Button
            variant={tabValue === "dashboard" ? "secondary" : "ghost"}
            size="sm"
            className="justify-start"
            asChild
            role="menuitem"
          >
            <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
              <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
              Create collection
            </Link>
          </Button>
          <Button
            variant={tabValue === "builds" ? "secondary" : "ghost"}
            size="sm"
            className="justify-start"
            asChild
            role="menuitem"
          >
            <Link href="/builds" onClick={() => setMobileMenuOpen(false)}>
              <LayoutList className="h-4 w-4 mr-2" aria-hidden="true" />
              My collections
            </Link>
          </Button>
          <Button
            variant={tabValue === "explore" ? "secondary" : "ghost"}
            size="sm"
            className="justify-start"
            asChild
            role="menuitem"
          >
            <Link
              href="/builds/explore"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Users className="h-4 w-4 mr-2" aria-hidden="true" />
              Public collections
            </Link>
          </Button>
        </div>
      )}
    </>
  );
};
