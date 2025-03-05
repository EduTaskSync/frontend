import { ModeToggle } from "./ModeToggle";

const MainNavigation = () => {
  return (
    <header className="flex h-16 items-center justify-between px-4">
      <ModeToggle />
    </header>
  );
};

export default MainNavigation;
