    import React from 'react';

    const LOW_STOCK_THRESHOLD = 5; // You can adjust this value

    const AnalyticsDashboard = ({ orders, products }) => {
        const deliveredOrders = orders.filter(o => o.status === 'Delivered');

        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay())).getTime();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

        const salesToday = deliveredOrders.filter(o => o.createdAt.seconds * 1000 >= startOfToday).reduce((sum, o) => sum + o.total, 0);
        const salesThisWeek = deliveredOrders.filter(o => o.createdAt.seconds * 1000 >= startOfWeek).reduce((sum, o) => sum + o.total, 0);
        const salesThisMonth = deliveredOrders.filter(o => o.createdAt.seconds * 1000 >= startOfMonth).reduce((sum, o) => sum + o.total, 0);

        const productSales = deliveredOrders.flatMap(o => o.items).reduce((acc, item) => {
            acc[item.id] = (acc[item.id] || 0) + item.quantity;
            return acc;
        }, {});
        const popularProducts = Object.entries(productSales).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([id, quantity]) => ({
            name: products.find(p => p.id === id)?.name || 'Unknown Product',
            quantity
        }));

        const lowStockProducts = products.filter(p => p.quantity > 0 && p.quantity < LOW_STOCK_THRESHOLD);

        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow"><h4 className="text-sm font-medium text-gray-500">Sales Today</h4><p className="mt-1 text-2xl font-semibold text-gray-900">EGP {salesToday.toFixed(2)}</p></div>
                    <div className="bg-white p-4 rounded-lg shadow"><h4 className="text-sm font-medium text-gray-500">Sales This Week</h4><p className="mt-1 text-2xl font-semibold text-gray-900">EGP {salesThisWeek.toFixed(2)}</p></div>
                    <div className="bg-white p-4 rounded-lg shadow"><h4 className="text-sm font-medium text-gray-500">Sales This Month</h4><p className="mt-1 text-2xl font-semibold text-gray-900">EGP {salesThisMonth.toFixed(2)}</p></div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h4 className="font-medium text-gray-700">Most Popular Products</h4>
                    <ul className="mt-2 space-y-2">{popularProducts.map(p => <li key={p.name} className="text-sm text-gray-600 flex justify-between"><span>{p.name}</span> <strong>{p.quantity} sold</strong></li>)}</ul>
                </div>
                <div className="bg-white p-4 rounded-lg shadow md:col-span-2">
                    <h4 className="font-medium text-gray-700">Low Stock Alerts (<strong className="text-red-500">{`< ${LOW_STOCK_THRESHOLD}`}</strong> items)</h4>
                    <ul className="mt-2 space-y-2">{lowStockProducts.length > 0 ? lowStockProducts.map(p => <li key={p.id} className="text-sm text-gray-600 flex justify-between"><span>{p.name}</span> <strong>{p.quantity} left</strong></li>) : <p className="text-sm text-gray-500">No products are low on stock.</p>}</ul>
                </div>
            </div>
        );
    };

    export default AnalyticsDashboard;
    
