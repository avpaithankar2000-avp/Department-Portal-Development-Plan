const Pagination = ({ pagination, onPage }) => {
  if (!pagination || pagination.pages <= 1) return null;

  return (
    <div className="glass-panel mt-6 flex items-center justify-between rounded-[2rem] px-4 py-3">
      <p className="text-sm text-slate-600 dark:text-slate-300">
        Page {pagination.page} of {pagination.pages}
      </p>
      <div className="flex gap-2">
        <button className="btn-secondary" disabled={pagination.page === 1} onClick={() => onPage(pagination.page - 1)}>
          Previous
        </button>
        <button className="btn-secondary" disabled={pagination.page === pagination.pages} onClick={() => onPage(pagination.page + 1)}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
