import React, { useState, useEffect } from 'react';

const FilterPanel = ({
    isOpen,
    onClose,
    activeFilters,
    onApplyFilters,
    onClearFilters,
    categories,
    maxPrice
}) => {
    const [draftFilters, setDraftFilters] = useState(activeFilters);

    useEffect(() => {
        if (isOpen) {
            setDraftFilters(activeFilters);
        }
    }, [isOpen, activeFilters]);

    if (!isOpen) return null;

    const handleFilterChange = (filter, value) => {
        setDraftFilters(prev => ({ ...prev, [filter]: value }));
    };

    const handleApply = () => {
        onApplyFilters(draftFilters);
        onClose();
    };
    
    const handleClear = () => {
        onClearFilters();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose}>
            {/* --- MODIFIED: Matched header's translucent style --- */}
            <div 
                className="fixed left-0 top-0 h-full w-full max-w-sm bg-[#b08d57]/50 backdrop-blur-md shadow-xl flex flex-col p-6 border-r border-white/20" 
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    {/* --- MODIFIED: Text color updated to white --- */}
                    <h2 className="text-xl font-semibold text-white">Filters</h2>
                    <button onClick={onClose} className="p-2 -mr-2 rounded-full text-white hover:bg-white/20 text-2xl">&times;</button>
                </div>
                
                <div className="space-y-6 overflow-y-auto flex-grow">
                    {/* Price Range Slider */}
                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-white mb-1">Max Price: EGP {draftFilters.priceRange}</label>
                        <input
                            id="price"
                            type="range"
                            min="50"
                            max={maxPrice}
                            step="50"
                            value={draftFilters.priceRange}
                            onChange={(e) => handleFilterChange('priceRange', Number(e.target.value))}
                            className="w-full h-2 bg-white/30 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>
                    {/* Stock Status */}
                    <div>
                        <label htmlFor="stock" className="block text-sm font-medium text-white">Stock Status</label>
                        <select id="stock" value={draftFilters.stockStatus} onChange={(e) => handleFilterChange('stockStatus', e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-white/20 text-white border-white/30 rounded-md focus:outline-none focus:ring-white focus:border-white sm:text-sm">
                            <option className="text-black" value="all">All</option>
                            <option className="text-black" value="inStock">In Stock</option>
                            <option className="text-black" value="outOfStock">Out of Stock</option>
                        </select>
                    </div>
                    {/* On Sale Toggle */}
                    <div className="flex items-center justify-between">
                         <span className="text-white font-medium text-sm">On Sale Only</span>
                        <label className="flex items-center cursor-pointer">
                            <div className="relative">
                                <input type="checkbox" checked={draftFilters.onSaleOnly} onChange={(e) => handleFilterChange('onSaleOnly', e.target.checked)} className="sr-only" />
                                <div className="block bg-white/30 w-14 h-8 rounded-full"></div>
                                <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${draftFilters.onSaleOnly ? 'transform translate-x-full bg-green-400' : ''}`}></div>
                            </div>
                        </label>
                    </div>
                    
                    {/* Category Filter */}
                    <div className="border-t border-white/20 pt-4">
                        <h3 className="text-lg font-medium text-white mb-2">Category</h3>
                        <div className="flex flex-wrap gap-2">
                            {categories.map(category => (
                                <button 
                                    key={category} 
                                    onClick={() => handleFilterChange('selectedCategory', category)} 
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${draftFilters.selectedCategory === category ? 'bg-white text-[#b08d57] border-white' : 'bg-white/20 text-white hover:bg-white/30 border-transparent'}`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-auto pt-6 flex space-x-2">
                    <button onClick={handleClear} className="w-1/2 py-3 px-4 bg-white/30 text-white font-semibold rounded-md hover:bg-white/40">
                        Clear
                    </button>
                    <button onClick={handleApply} className="w-1/2 py-3 px-4 bg-white text-[#b08d57] font-semibold rounded-md hover:bg-gray-200">
                        Apply
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FilterPanel;

