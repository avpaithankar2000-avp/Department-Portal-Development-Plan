import { Search } from "lucide-react";

const FilterBar = ({ search, setSearch, children }) => (
  <div className="glass-panel mb-6 grid gap-3 rounded-[2rem] p-4 md:grid-cols-[1fr_auto]">
    <label className="relative block">
      <Search className="pointer-events-none absolute left-4 top-3.5 text-slate-400" size={18} />
      <input className="pl-11" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search records" />
    </label>
    <div className="grid gap-3 sm:flex">{children}</div>
  </div>
);

export default FilterBar;
