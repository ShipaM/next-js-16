"use client";

import { getTabValue } from "@/lib/utils";
import { Session } from "next-auth";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { LayoutList, Plus, Users } from "lucide-react";
import { signOut } from "next-auth/react";
import type { FC } from "react";

type HeaderNavProps = {
  session: Session | null;
};

export const HeaderNav: FC<HeaderNavProps> = ({ session }) => {
  const pathname = usePathname();
  const tabValue = getTabValue(pathname);

  if (!session?.user) {
    return (
      <div className="flex justify-end">
        <Button variant="secondary">
          <Link href="/login">Login</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 items-center gap-4">
      <div />
      <div className="flex jusify-center">
        <Tabs value={tabValue} className="w-fit">
          <TabsList>
            <TabsTrigger value="dashboard" asChild>
              <Link href="/dashboard">
                <Plus className="h-4 w-4" />
                Create collection
              </Link>
            </TabsTrigger>
            <TabsTrigger value="builds" asChild>
              <Link href="/builds">
                <LayoutList className="h-4 w-4" />
                My collections
              </Link>
            </TabsTrigger>
            <TabsTrigger value="explore" asChild>
              <Link href="/builds/explore">
                <Users className="h-4 w-4" />
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
  );
};
