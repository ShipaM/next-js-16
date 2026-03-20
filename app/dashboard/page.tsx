import { CurrentBuild } from "./component/current-build";

const dashboard = () => {
  return (
    <div className="flex flex-col max-w-9xl gap-6 lg:flex-row lg:items-start">
      <div className="min-w-0 flex-1">
        <CurrentBuild />
      </div>
      <aside className="shrink-0 lg:sticky lg:top-6 lg:w-80"></aside>
    </div>
  );
};

export default dashboard;
