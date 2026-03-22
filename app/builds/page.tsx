import { auth } from "@/auth";
import { TypographyH3 } from "@/components/ui/typography-h3";
import { redirect } from "next/navigation";
import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getMyBuilds } from "@/lib/builds";
import { BuildCard } from "./components/build-cad";
import { DeleteBuildButton } from "./components/delete-build-button";
import { deleteBuildAction, setBuildPublicAction } from "./actions";

export default async function MyBuilds() {
  const session = await auth();

  if (!session?.user.id) {
    redirect("/login");
  }

  const builds = await getMyBuilds(session.user.id);

  return (
    <div className="py-4 sm:py-6 px-4">
      <TypographyH3>My builds</TypographyH3>
      <br />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {builds.length > 0 ? (
          builds.map((b) => (
            <BuildCard key={b.id} build={b}>
              <DeleteBuildButton
                buildId={b.id}
                deleteAction={deleteBuildAction}
              />
              <form action={setBuildPublicAction} className="contents">
                <input type="hidden" name="buildId" value={b.id} />
                <input
                  type="hidden"
                  name="isPublic"
                  value={b.isPublic ? "false" : "true"}
                />
                <Button
                  type="submit"
                  variant={`${b.isPublic ? "default" : "ghost"}`}
                  size="sm"
                >
                  <Share2
                    className={`h-4 w-4 mr-1 ${b.isPublic ? "fill-background" : ""}  `}
                  />
                </Button>
              </form>
            </BuildCard>
          ))
        ) : (
          <p className="text-muted-foreground">No builds</p>
        )}
      </div>
    </div>
  );
}
