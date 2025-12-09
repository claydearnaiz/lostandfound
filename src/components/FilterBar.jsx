import React from 'react';
import { Search, Plus, LayoutGrid, List, Package, Smartphone, Briefcase, BookOpen, Shirt } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'All Items', icon: Package },
  { id: 'Electronics', label: 'Electronics', icon: Smartphone },
  { id: 'Bags', label: 'Bags', icon: Briefcase },
  { id: 'Books', label: 'Books', icon: BookOpen },
  { id: 'Clothing', label: 'Clothing', icon: Shirt },
  { id: 'Personal Items', label: 'Personal', icon: Package },
];

export const FilterBar = ({ 
  search, 
  setSearch, 
  statusFilter, 
  setStatusFilter, 
  locationFilter, 
  setLocationFilter,
  categoryFilter,
  setCategoryFilter,
  isAdmin,
  onAddItem,
  viewMode,
  setViewMode,
  totalItems
}) => {
  return (
    <div className="bg-white/70 backdrop-blur-sm border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-4">
        {/* Search Row */}
        <div className="flex flex-col lg:flex-row gap-3 items-stretch">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name, description, or location..." 
              className="input h-12 pl-11 pr-4"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 items-center">
            <select 
              className="input h-12 w-full sm:w-auto min-w-[130px]"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Unclaimed">Unclaimed</option>
              <option value="Claimed">Claimed</option>
            </select>

            <select 
              className="input h-12 w-full sm:w-auto min-w-[150px]"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            >
              <option value="All">All Locations</option>
              <option value="Library">Library</option>
              <option value="Ozanam">Ozanam</option>
              <option value="Adamson Hall">Adamson Hall</option>
              <option value="St. Vincent">St. Vincent</option>
              <option value="Cardinal Santos">Cardinal Santos</option>
              <option value="Basketball Court">Basketball Court</option>
            </select>

            {isAdmin && (
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-slate-100 p-1 rounded-xl">
                  <button 
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    aria-label="Grid view"
                  >
                    <LayoutGrid size={18} />
                  </button>
                  <button 
                    onClick={() => setViewMode('table')}
                    className={`p-2 rounded-lg transition-all ${viewMode === 'table' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    aria-label="Table view"
                  >
                    <List size={18} />
                  </button>
                </div>

                <button 
                  onClick={onAddItem}
                  className="btn-primary flex items-center gap-2 whitespace-nowrap h-12 px-4"
                >
                  <Plus size={18} />
                  <span className="hidden sm:inline">Add Item</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Category Chips */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = (categoryFilter || 'all') === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter?.(cat.id === 'all' ? '' : cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/20' 
                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                <Icon size={14} />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">
            <span className="font-semibold text-slate-900">{totalItems}</span> items found
          </p>
        </div>
      </div>
    </div>
  );
};
