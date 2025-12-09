import React, { useState, useEffect, useMemo } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider, useToast } from './components/Toast';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { ItemGrid } from './components/ItemGrid';
import { ItemTable } from './components/ItemTable';
import { ItemDetailsModal } from './components/ItemDetailsModal';
import { ItemFormModal } from './components/ItemFormModal';
import { AuthModal } from './components/AuthModal';
import { StatsCards } from './components/StatsCards';
import { ItemGridSkeleton } from './components/Skeleton';
import { itemService } from './services/itemService';
import { Package, Search } from 'lucide-react';

function AppContent() {
  const { isAdmin } = useAuth();
  const toast = useToast();
  
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdminView, setIsAdminView] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  
  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Modals
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Reset admin view if user loses admin status
  useEffect(() => {
    if (!isAdmin && isAdminView) {
      setIsAdminView(false);
    }
  }, [isAdmin, isAdminView]);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    setLoading(true);
    try {
      const data = await itemService.getAll();
      setItems(data);
    } catch (error) {
      console.error('Failed to load items:', error);
      toast.error('Failed to load items');
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = 
        (item.name || '').toLowerCase().includes(search.toLowerCase()) || 
        (item.description || '').toLowerCase().includes(search.toLowerCase()) ||
        (item.locationFound || '').toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
      const matchesLocation = locationFilter === 'All' || (item.locationFound || '').includes(locationFilter);
      const matchesCategory = !categoryFilter || (item.category || '').toLowerCase() === categoryFilter.toLowerCase();
      
      return matchesSearch && matchesStatus && matchesLocation && matchesCategory;
    });
  }, [items, search, statusFilter, locationFilter, categoryFilter]);

  const handleCardClick = (item) => {
    setSelectedItem(item);
    setIsDetailsOpen(true);
  };

  const handleAddItem = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleDeleteItem = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await itemService.delete(id);
        toast.success('Item deleted successfully');
        loadItems();
      } catch (error) {
        toast.error('Failed to delete item');
      }
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingItem) {
        await itemService.update(editingItem.id, formData);
        toast.success('Item updated successfully');
      } else {
        await itemService.add(formData);
        toast.success('Item added successfully');
      }
      loadItems();
      setIsFormOpen(false);
    } catch (error) {
      toast.error('Failed to save item');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Background Pattern */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 via-slate-50 to-slate-50" />
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-br from-blue-100/30 to-transparent rounded-full blur-3xl" />
      </div>

      <Header 
        isAdminView={isAdminView} 
        setIsAdminView={setIsAdminView}
        onLoginClick={() => setIsAuthOpen(true)}
      />
      
      <FilterBar 
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        locationFilter={locationFilter}
        setLocationFilter={setLocationFilter}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        isAdmin={isAdminView}
        onAddItem={handleAddItem}
        viewMode={viewMode}
        setViewMode={setViewMode}
        totalItems={filteredItems.length}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats for Admin */}
        {isAdminView && !loading && (
          <StatsCards items={items} />
        )}

        {/* Content */}
        {loading ? (
          <ItemGridSkeleton count={8} />
        ) : filteredItems.length === 0 ? (
          <EmptyState 
            search={search}
            onClear={() => { 
              setSearch(''); 
              setStatusFilter('All'); 
              setLocationFilter('All');
              setCategoryFilter('');
            }}
          />
        ) : isAdminView && viewMode === 'table' ? (
          <ItemTable 
            items={filteredItems} 
            onView={handleCardClick}
            onEdit={handleEditItem}
            onDelete={(id) => handleDeleteItem(id)} 
          />
        ) : (
          <ItemGrid 
            items={filteredItems} 
            onCardClick={handleCardClick}
            isAdmin={isAdminView}
            onEdit={handleEditItem} 
            onDelete={(item) => handleDeleteItem(item.id)}
          />
        )}
      </main>

      {/* Modals */}
      <ItemDetailsModal 
        item={selectedItem} 
        isOpen={isDetailsOpen} 
        onClose={() => setIsDetailsOpen(false)} 
      />

      <ItemFormModal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSubmit={handleFormSubmit}
        initialData={editingItem}
        title={editingItem ? 'Edit Item' : 'Add New Item'}
      />

      <AuthModal 
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />
    </div>
  );
}

const EmptyState = ({ search, onClear }) => (
  <div className="flex flex-col items-center justify-center py-20">
    <div className="bg-slate-100 p-6 rounded-full mb-6">
      {search ? (
        <Search size={40} className="text-slate-400" />
      ) : (
        <Package size={40} className="text-slate-400" />
      )}
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-2">
      {search ? 'No results found' : 'No items yet'}
    </h3>
    <p className="text-slate-500 text-center max-w-md mb-6">
      {search 
        ? 'Try adjusting your search or filter criteria to find what you\'re looking for.'
        : 'Lost items will appear here once they are added to the system.'
      }
    </p>
    {search && (
      <button onClick={onClear} className="btn-secondary">
        Clear filters
      </button>
    )}
  </div>
);

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
