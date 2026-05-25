export const SkeletonCard = () => {
  return (
    <div className="card overflow-hidden">
      <div className="w-full h-48 skeleton"></div>
      <div className="p-5 space-y-4">
        <div className="flex justify-between items-start">
          <div className="w-2/3 h-6 skeleton"></div>
          <div className="w-16 h-6 skeleton rounded-full"></div>
        </div>
        <div className="w-1/2 h-4 skeleton"></div>
        <div className="flex gap-2">
          <div className="w-1/4 h-8 skeleton"></div>
          <div className="w-1/4 h-8 skeleton"></div>
        </div>
        <div className="pt-4 flex gap-3">
          <div className="w-full h-10 skeleton rounded-lg"></div>
          <div className="w-10 h-10 skeleton rounded-lg shrink-0"></div>
        </div>
      </div>
    </div>
  );
};

export const SkeletonText = ({ lines = 3 }: { lines?: number }) => {
  return (
    <div className="space-y-2 w-full">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className={`h-4 skeleton ${i === lines - 1 ? 'w-2/3' : 'w-full'}`}></div>
      ))}
    </div>
  );
};
