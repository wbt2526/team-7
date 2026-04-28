import React from "react";

const HomePagination = ({ currentPage, setCurrentPage, totalPages }) => {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="mt-12 flex items-center justify-center gap-3">
      <button
        onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
        disabled={currentPage === 1}
        className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-500 shadow-sm disabled:opacity-40"
      >
        ‹
      </button>
      {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
        <button
          key={page}
          onClick={() => setCurrentPage(page)}
          className={`rounded-xl px-4 py-3 font-semibold shadow-sm ${
            page === currentPage ? "bg-blue-600 text-white" : "bg-white text-slate-700"
          }`}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
        disabled={currentPage === totalPages}
        className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-500 shadow-sm disabled:opacity-40"
      >
        ›
      </button>
    </div>
  );
};

export default HomePagination;
