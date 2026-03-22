import { auth } from "@/auth";
import { TypographyH1 } from "@/components/ui/typography-h1";
import { getPublicBuild } from "@/lib/builds";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ThumbsUp } from "lucide-react";
import { BuildCard } from "../components/build-cad";
import { toggleLikeAction } from "../actions";

export default async function ExplorePage() {
  const session = await auth();

  if (!session?.user.id) {
    notFound();
  }

  const builds = await getPublicBuild(session.user.id);

  return (
    <div className="py-4 sm:py-6 px-4">
      <TypographyH1>Public builds</TypographyH1>
      <br />
      {builds.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {builds.map((b) => {
            const isLiked = Array.isArray(b.likes) && b.likes.length > 0;

            return (
              <BuildCard key={b.id} build={b}>
                <div className="flex flex-wrap gap-2">
                  <form action={toggleLikeAction} className="contents">
                    <input type="hidden" name="buildId" value={b.id} />
                    <Button
                      type="submit"
                      variant={isLiked ? "outline" : "secondary"}
                      size="sm"
                    >
                      <ThumbsUp
                        className={`h-4 w-4 mr-1 ${isLiked ? "fill-current" : ""}`}
                      />
                      {b._count.likes}
                    </Button>
                  </form>
                </div>
              </BuildCard>
            );
          })}
        </div>
      ) : (
        <p className="text-muted-foreground">No public builds</p>
      )}
    </div>
  );
}
