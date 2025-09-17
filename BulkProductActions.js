import React, { useState } from 'react';

const BulkProductActions = ({ selectedCount, onBulkSale, onBulkDelete, onBulkSetNewArrival, onClearSelection, onBulkAssignCategory }) => {
    const [salePercentage, setSalePercentage] = useState('');
    const [category, setCategory] = useState(''); // State for the new category input

    const handleApplySale = () => {
        const percentage = parseInt(salePercentage, 10);
        if (isNaN(percentage) || percentage <= 0 || percentage > 100) {
            alert("Please enter a valid sale percentage (1-100).");
            return;
        }
        onBulkSale(percentage);
        setSalePercentage('');
    };

    const handleAssignCategory = () => {
        if (!category.trim()) {
            alert("Please enter a category name.");
            return;
        }
        onBulkAssignCategory(category);
        setCategory('');
    };

    return (
        <div className="bg-gray-100 p-4 rounded-lg mb-6 border border-gray-200">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <p className="text-sm font-semibold text-gray-800">{selectedCount} product(s) selected</p>
                
                {/* --- NEW: Bulk Category Action --- */}
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        placeholder="Category Name"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-32 p-2 border border-gray-300 rounded-md shadow-sm text-sm"
                    />
                    <button onClick={handleAssignCategory} className="px-3 py-2 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700">Assign Category</button>
                </div>

                {/* Bulk Sale Action */}
                <div className="flex items-center gap-2">
                    <input
                        type="number"
                        placeholder="% Sale"
                        value={salePercentage}
                        onChange={(e) => setSalePercentage(e.target.value)}
                        className="w-24 p-2 border border-gray-300 rounded-md shadow-sm text-sm"
                    />
                    <button onClick={handleApplySale} className="px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700">Apply Sale</button>
                </div>

                {/* Other Bulk Actions */}
                <div className="flex items-center gap-2">
                     <button onClick={() => onBulkSetNewArrival(true)} className="px-3 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700">Set as New</button>
                     <button onClick={() => onBulkSetNewArrival(false)} className="px-3 py-2 bg-yellow-500 text-white text-sm rounded-md hover:bg-yellow-600">Remove New</button>
                     <button onClick={onBulkDelete} className="px-3 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700">Delete</button>
                </div>
                 <button onClick={onClearSelection} className="text-sm text-gray-600 hover:underline">Clear Selection</button>
            </div>
        </div>
    );
};

export default BulkProductActions;

