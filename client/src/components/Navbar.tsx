interface NavbarProps {
  title?: string;
}

const Navbar = ({
  title = "RegisterKaro Automation Dashboard",
}: NavbarProps) => {
  return (
    <nav className="w-full bg-slate-900 border-b border-slate-700 px-8 py-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">{title}</h1>

        <div className="text-sm text-slate-400">
          Playwright • Express • MongoDB
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
