import { Link, useNavigate } from 'react-router-dom';
import { X, ArrowRight, Scale, Trash2 } from 'lucide-react';
import { useCompareStore } from '../../stores/compareStore';
import { Button } from '../ui/Button';

export const CompareTray = () => {
  const { items, removeFromCompare, clearCompare } = useCompareStore();
  const navigate = useNavigate();

  if (items.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up">
      <div className="bg-white border-t border-gray-200 shadow-[0_-8px_30px_-4px_rgba(0,0,0,0.12)] backdrop-blur-xl bg-white/95">
        <div className="container-custom py-3">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="bg-primary-50 p-2 rounded-lg hidden sm:block">
                <Scale className="w-5 h-5 text-primary-600" />
              </div>
              <div className="flex-1 md:flex-none">
                <h4 className="font-semibold text-gray-900 text-sm">Compare Colleges</h4>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden w-24">
                    <div
                      className="h-full bg-primary-500 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${(items.length / 3) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 font-medium">{items.length}/3</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-1 overflow-x-auto scrollbar-hide px-2 w-full md:w-auto justify-center">
              {items.map((college) => (
                <div
                  key={college.id}
                  className="flex items-center bg-gray-50 border border-gray-200 rounded-lg p-2 min-w-[180px] max-w-[220px] shrink-0 hover:border-primary-200 transition-colors"
                >
                  <div className="w-9 h-9 bg-gray-200 rounded-md overflow-hidden mr-2.5 shrink-0">
                    {college.imageUrl ? (
                      <img src={college.imageUrl} alt={college.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                        <Scale className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                  <p className="text-xs font-medium text-gray-900 truncate flex-1 pr-1">
                    {college.shortName || college.name}
                  </p>
                  <button
                    onClick={() => removeFromCompare(college.id)}
                    className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors shrink-0"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {Array.from({ length: Math.max(0, 3 - items.length) }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="hidden sm:flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg p-2 min-w-[180px] h-[42px] bg-gray-50/50 shrink-0"
                >
                  <span className="text-[11px] text-gray-400 font-medium">Empty Slot</span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 shrink-0 w-full md:w-auto justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearCompare}
                className="text-gray-500 hover:text-red-500 text-xs"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1" />
                Clear
              </Button>
              <Button
                disabled={items.length < 2}
                onClick={() => navigate('/compare')}
                size="sm"
              >
                Compare Now
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
