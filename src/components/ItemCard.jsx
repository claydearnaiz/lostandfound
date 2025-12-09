import React, { useState, useCallback } from 'react';
import { Calendar, MapPin, Pencil, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

export const ItemCard = React.memo(({ item, onClick, isAdmin, onEdit, onDelete }) => {
  const [imageError, setImageError] = useState(false);

  const handleClick = useCallback(() => {
    onClick(item);
  }, [onClick, item]);

  const handleEdit = useCallback((e) => {
    e.stopPropagation();
    onEdit(item);
  }, [onEdit, item]);

  const handleDelete = useCallback((e) => {
    e.stopPropagation();
    onDelete(item);
  }, [onDelete, item]);

  return (
    <div 
      className="group relative bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer will-change-transform"
      onClick={handleClick}
    >
      {/* Image */}
      <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden">
        {!imageError ? (
          <img 
            src={item.image} 
            alt={item.name}
            loading="lazy"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span className={`badge ${
            item.status === 'Claimed' ? 'badge-success' : 'badge-warning'
          }`}>
            {item.status}
          </span>
        </div>

        {/* Admin Actions */}
        {isAdmin && (
          <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            <button 
              onClick={handleEdit}
              className="p-2 bg-white/95 text-blue-600 hover:bg-blue-50 rounded-lg shadow-md transition-colors"
              title="Edit"
            >
              <Pencil size={14} />
            </button>
            <button 
              onClick={handleDelete}
              className="p-2 bg-white/95 text-red-500 hover:bg-red-50 rounded-lg shadow-md transition-colors"
              title="Delete"
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-slate-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors duration-150">
          {item.name}
        </h3>
        
        <div className="space-y-1 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-slate-400 shrink-0" />
            <span>{format(new Date(item.dateFound), 'MMM d, yyyy')}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-slate-400 shrink-0" />
            <span className="line-clamp-1">{item.locationFound}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
          <span className="text-xs text-slate-400">Claim at</span>
          <span className="badge badge-info">{item.claimLocation}</span>
        </div>
      </div>
    </div>
  );
});

ItemCard.displayName = 'ItemCard';
