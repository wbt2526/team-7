import React from "react";

const HomePagination = ({ currentPage, setCurrentPage, totalPages }) => {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
      <button
        type="button"
        onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
        disabled={currentPage === 1}
        className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Previous
      </button>
      {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
        <button
          type="button"
          key={page}
          onClick={() => setCurrentPage(page)}
          className={`rounded-xl px-4 py-3 text-sm font-bold shadow-sm transition ${
            page === currentPage ? "bg-blue-600 text-white" : "bg-white text-slate-700 hover:bg-slate-50"
          }`}
        >
          {page}
        </button>
      ))}
      <button
        type="button"
        onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
        disabled={currentPage === totalPages}
        className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
};

export default HomePagination;
