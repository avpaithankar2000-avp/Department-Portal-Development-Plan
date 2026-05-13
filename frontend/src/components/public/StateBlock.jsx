import Skeleton from "../ui/Skeleton";

const StateBlock = ({ loading, error, empty }) => {
  if (loading) {
    return (
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
      </div>
    );
  }
  if (error) return <div className="rounded-[2rem] border border-red-200 bg-red-50/90 p-8 text-center text-red-700 shadow-soft">{error}</div>;
  if (empty) return <div className="glass-panel rounded-[2rem] p-8 text-center text-slate-500 dark:text-slate-300">No records found.</div>;
  return null;
};

export default StateBlock;
