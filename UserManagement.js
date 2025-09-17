import React, { useState } from 'react';

const UserManagement = ({ users, onManageAdmin, onUserClick, onFilterChange }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [minSpend, setMinSpend] = useState('');
    const [minOrders, setMinOrders] = useState('');

    const handleApplyFilters = () => {
        onFilterChange({
            search: searchTerm,
            minSpend: Number(minSpend) || 0,
            minOrders: Number(minOrders) || 0,
        });
    };
    
    const handleClearFilters = () => {
        setSearchTerm('');
        setMinSpend('');
        setMinOrders('');
        onFilterChange({ search: '', minSpend: 0, minOrders: 0 });
    };

    return (
        <div>
            {/* --- NEW: Filter Controls --- */}
            <div className="bg-white p-4 rounded-lg shadow mb-6 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="md:col-span-2 p-2 border border-gray-300 rounded-md shadow-sm"
                />
                <input
                    type="number"
                    placeholder="Min. Total Spend (EGP)"
                    value={minSpend}
                    onChange={(e) => setMinSpend(e.target.value)}
                    className="p-2 border border-gray-300 rounded-md shadow-sm"
                />
                 <input
                    type="number"
                    placeholder="Min. # of Orders"
                    value={minOrders}
                    onChange={(e) => setMinOrders(e.target.value)}
                    className="p-2 border border-gray-300 rounded-md shadow-sm"
                />
                 <button onClick={handleApplyFilters} className="md:col-span-2 py-2 bg-[#b08d57] text-white rounded-md font-semibold">Apply Filters</button>
                 <button onClick={handleClearFilters} className="md:col-span-2 py-2 bg-gray-200 text-gray-800 rounded-md font-semibold">Clear Filters</button>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul role="list" className="divide-y divide-gray-200">
                    {users.map((user) => (
                        <li key={user.uid} className="p-4 sm:p-6 hover:bg-gray-50">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{user.name || 'N/A'}</p>
                                    <p className="text-sm text-gray-500">{user.email}</p>
                                    {/* Display the new calculated data */}
                                    <div className="text-xs text-gray-400 mt-1 space-x-4">
                                        <span>Total Spent: EGP {user.totalSpend?.toFixed(2) || 0}</span>
                                        <span>Total Orders: {user.orderCount || 0}</span>
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => onUserClick(user)}
                                        className="text-sm text-blue-600 hover:underline"
                                    >
                                        View Orders
                                    </button>
                                    <button
                                        onClick={() => onManageAdmin(user.uid, !user.isAdmin)}
                                        className={`text-sm font-semibold ${user.isAdmin ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'}`}
                                    >
                                        {user.isAdmin ? 'Revoke Admin' : 'Make Admin'}
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                     {users.length === 0 && <p className="text-center text-gray-500 py-8">No users match the current filters.</p>}
                </ul>
            </div>
        </div>
    );
};

export default UserManagement;

