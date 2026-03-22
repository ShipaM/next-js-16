import { CurrentBuild } from "./component/current-build";
import { PopularBuildCard } from "./component/popular-build-card";

const dashboard = () => {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-6">
      <div className="min-w-0 flex-1">
        <CurrentBuild />
      </div>
      <aside className="shrink-0 w-full lg:sticky lg:top-6 lg:w-80">
        <PopularBuildCard />
      </aside>
    </div>
  );
};

export default dashboard;
