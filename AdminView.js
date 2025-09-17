import React, { useState } from 'react';
import AnalyticsDashboard from './AnalyticsDashboard';
import CouponManager from './CouponManager';
import UserManagement from './UserManagement';
import SalesReports from './SalesReports';
import CouponReports from './CouponReports';
import AnnouncementManager from './AnnouncementManager';
import DeliveryManager from './DeliveryManager';
import BannerManager from './BannerManager';
import SearchAnalytics from './SearchAnalytics';
import BulkProductActions from './BulkProductActions';
import CSVProductManager from './CSVProductManager';

const AdminView = ({ orders, products, users, onUpdateStatus, onAddProductClick, onEditProductClick, onDeleteProduct, showNotification, onManageAdmin, onUserClick, searchAnalytics, onBulkSale, onBulkDelete, onBulkSetNewArrival, onFilterChange, onCSVImport, onBulkAssignCategory }) => {
    const [activeTab, setActiveTab] = useState('analytics');
    const [selectedProducts, setSelectedProducts] = useState([]);

    const handleProductSelect = (productId) => {
        setSelectedProducts(prev => 
            prev.includes(productId) 
                ? prev.filter(id => id !== productId) 
                : [...prev, productId]
        );
    };

    const handleSelectAll = () => {
        if (products.length > 0 && selectedProducts.length === products.length) {
            setSelectedProducts([]); // Deselect all
        } else {
            setSelectedProducts(products.map(p => p.id)); // Select all
        }
    };

    const statusColors = {
        Placed: 'bg-yellow-100 text-yellow-800',
        'Out for Delivery': 'bg-blue-100 text-blue-800',
        Delivered: 'bg-green-100 text-green-800',
        Cancelled: 'bg-red-100 text-red-800',
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-extrabold text-gray-800 sm:text-4xl">Admin Dashboard</h2>
                <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600">Manage your store's performance and operations.</p>
            </div>

            <div className="border-b border-gray-200 mb-8">
                <nav className="-mb-px flex space-x-8 justify-center flex-wrap" aria-label="Tabs">
                    <button onClick={() => setActiveTab('analytics')} className={`${activeTab === 'analytics' ? 'border-[#b08d57] text-[#b08d57]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Analytics</button>
                    <button onClick={() => setActiveTab('reports')} className={`${activeTab === 'reports' ? 'border-[#b08d57] text-[#b08d57]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Reports</button>
                    <button onClick={() => setActiveTab('orders')} className={`${activeTab === 'orders' ? 'border-[#b08d57] text-[#b08d57]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Orders</button>
                    <button onClick={() => setActiveTab('products')} className={`${activeTab === 'products' ? 'border-[#b08d57] text-[#b08d57]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Products</button>
                    <button onClick={() => setActiveTab('users')} className={`${activeTab === 'users' ? 'border-[#b08d57] text-[#b08d57]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Users</button>
                    <button onClick={() => setActiveTab('coupons')} className={`${activeTab === 'coupons' ? 'border-[#b08d57] text-[#b08d57]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Coupons</button>
                    <button onClick={() => setActiveTab('banners')} className={`${activeTab === 'banners' ? 'border-[#b08d57] text-[#b08d57]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Banners</button>
                    <button onClick={() => setActiveTab('settings')} className={`${activeTab === 'settings' ? 'border-[#b08d57] text-[#b08d57]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Settings</button>
                </nav>
            </div>

            {activeTab === 'analytics' && <AnalyticsDashboard orders={orders} products={products} />}
            
            {activeTab === 'reports' && (
                <section>
                    <h3 className="text-2xl font-bold text-gray-800 text-center mb-8">Reports</h3>
                    <SalesReports orders={orders} />
                    <CouponReports orders={orders} />
                    <SearchAnalytics searchData={searchAnalytics} />
                </section>
            )}

            {activeTab === 'products' && (
                 <section>
                     <div className="flex justify-between items-center mb-4">
                        <h3 className="text-2xl font-bold text-gray-800">Product Management</h3>
                        <button onClick={onAddProductClick} className="px-4 py-2 bg-[#b08d57] text-white font-semibold rounded-md hover:bg-[#9c7b4d] shadow-md hover:shadow-lg transition-all">
                            + Add Product
                        </button>
                     </div>
                     
                     <CSVProductManager products={products} onImport={onCSVImport} />

                     {selectedProducts.length > 0 && (
                        <BulkProductActions
                            selectedCount={selectedProducts.length}
                            onBulkSale={(percentage) => { onBulkSale(selectedProducts, percentage); setSelectedProducts([]); }}
                            onBulkDelete={() => { onDeleteProduct(selectedProducts); setSelectedProducts([]); }}
                            onBulkSetNewArrival={(isNew) => { onBulkSetNewArrival(selectedProducts, isNew); setSelectedProducts([]); }}
                            onBulkAssignCategory={(category) => { onBulkAssignCategory(selectedProducts, category); setSelectedProducts([]); }}
                            onClearSelection={() => setSelectedProducts([])}
                        />
                     )}

                     <div className="bg-white shadow overflow-hidden sm:rounded-md mt-6">
                         <ul role="list" className="divide-y divide-gray-200">
                            <li className="p-4 bg-gray-50 flex items-center">
                                <input 
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 text-[#b08d57] focus:ring-[#b08d57]"
                                    onChange={handleSelectAll}
                                    checked={products.length > 0 && selectedProducts.length === products.length}
                                    ref={el => el && (el.indeterminate = selectedProducts.length > 0 && selectedProducts.length < products.length)}
                                />
                                <label className="ml-3 text-sm font-medium text-gray-700">Select All</label>
                            </li>
                             {products.map((product) => (
                                 <li key={product.id} className="p-4 sm:p-6 flex items-center justify-between">
                                     <div className="flex items-center">
                                        <input 
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300 text-[#b08d57] focus:ring-[#b08d57]"
                                            checked={selectedProducts.includes(product.id)}
                                            onChange={() => handleProductSelect(product.id)}
                                        />
                                        <div className="ml-4">
                                            <p className="text-sm font-medium text-gray-900">{product.name}</p>
                                            <p className="text-sm text-gray-500">ID: {product.id} | Qty: {product.quantity}</p>
                                        </div>
                                     </div>
                                     <div className="flex space-x-2">
                                        <button onClick={() => onEditProductClick(product)} className="text-sm text-blue-600 hover:underline">Edit</button>
                                        <button onClick={() => onDeleteProduct([product.id])} className="text-sm text-red-600 hover:underline">Delete</button>
                                     </div>
                                 </li>
                             ))}
                         </ul>
                     </div>
                 </section>
            )}

            {activeTab === 'orders' && (
                 <section>
                    <h3 className="text-2xl font-bold text-gray-800 text-center mb-8">Order Management</h3>
                    <div className="bg-white shadow overflow-hidden sm:rounded-md">
                        <ul role="list" className="divide-y divide-gray-200">
                            {orders.map((order) => (
                                <li key={order.id} className="p-4 sm:p-6">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium text-gray-600 truncate">Order #{order.id.substring(0, 6)}</p>
                                        <div className="ml-2 flex-shrink-0 flex">
                                            <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}>{order.status}</p>
                                        </div>
                                    </div>
                                    <div className="mt-2 sm:flex sm:justify-between">
                                        <div className="sm:flex flex-col">
                                            <p className="flex items-center text-sm text-gray-500">{order.customer.name} ({order.customer.phone})</p>
                                            <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">{order.customer.address}, {order.customer.city}</p>
                                        </div>
                                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                            <p className="font-bold">EGP {order.total.toFixed(2)}</p>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <h4 className="font-medium text-sm text-gray-700">Items:</h4>
                                        <ul className="list-disc pl-5 mt-1 text-sm text-gray-500">
                                            {order.items.map(item => <li key={item.id}>{item.quantity} x {item.name}</li>)}
                                        </ul>
                                    </div>
                                    <div className="mt-4">
                                        <label htmlFor={`status-${order.id}`} className="sr-only">Update Status</label>
                                        <select
                                            id={`status-${order.id}`}
                                            value={order.status}
                                            onChange={(e) => onUpdateStatus(order.id, e.target.value)}
                                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#b08d57] focus:border-[#b08d57] sm:text-sm rounded-md"
                                        >
                                            <option>Placed</option>
                                            <option>Out for Delivery</option>
                                            <option>Delivered</option>
                                            <option>Cancelled</option>
                                        </select>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                 </section>
            )}

            {activeTab === 'users' && (
                <section>
                    <h3 className="text-2xl font-bold text-gray-800 text-center mb-8">User Management</h3>
                    <UserManagement users={users} onManageAdmin={onManageAdmin} onUserClick={onUserClick} onFilterChange={onFilterChange} />
                </section>
            )}

            {activeTab === 'coupons' && (
                <section>
                    <h3 className="text-2xl font-bold text-gray-800 text-center mb-8">Coupon Management</h3>
                    <CouponManager showNotification={showNotification} />
                </section>
            )}
            
            {activeTab === 'banners' && (
                <section>
                    <h3 className="text-2xl font-bold text-gray-800 text-center mb-8">Homepage Banners</h3>
                    <BannerManager showNotification={showNotification} />
                </section>
            )}

            {activeTab === 'settings' && (
                <section>
                    <h3 className="text-2xl font-bold text-gray-800 text-center mb-8">Store Settings</h3>
                    <AnnouncementManager showNotification={showNotification} />
                    <DeliveryManager showNotification={showNotification} />
                </section>
            )}
        </div>
    );
};

export default AdminView;

