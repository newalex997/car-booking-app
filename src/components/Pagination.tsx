interface Props {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}

export default function Pagination({ page, totalPages, onPrev, onNext }: Props) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-4 py-6">
      <button
        onClick={onPrev}
        disabled={page <= 1}
        className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 disabled:opacity-40 hover:bg-slate-50 transition-colors"
      >
        Previous
      </button>
      <span className="text-sm text-slate-500">
        Page {page} of {totalPages}
      </span>
      <button
        onClick={onNext}
        disabled={page >= totalPages}
        className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 disabled:opacity-40 hover:bg-slate-50 transition-colors"
      >
        Next
      </button>
    </div>
  );
}
