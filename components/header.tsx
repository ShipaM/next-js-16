import { auth } from "@/auth";
import Link from "next/link";
import { TypographyH3 } from "./ui/typography-h3";
import { HeaderNav } from "./header-nav";

export async function Header() {
  const session = await auth();

  return (
    <header
      className="container mx-auto flex items-center p-4 md:px-6"
      role="banner"
    >
      <div className="shrink-0">
        <TypographyH3>
          <Link href={session?.user ? "/dashboard" : "/"}>PC Builder</Link>
        </TypographyH3>
      </div>
      <nav className="min-w-0 flex-1" aria-label="Main navigation">
        <HeaderNav session={session} />
      </nav>
    </header>
  );
}
