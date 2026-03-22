import { Button } from "@/components/ui/button";
import { TypographyH1 } from "@/components/ui/typography-h1";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center py-16 px-4 sm:py-20 sm:px-8 md:py-32 md:px-16">
        <TypographyH1 className="text-center">
          Create your first build
        </TypographyH1>
        <br />
        <Button>
          <Link href="/dashboard">Build</Link>
        </Button>
      </main>
    </div>
  );
}
