import React, { useState, useMemo } from 'react';

const SalesReports = ({ orders }) => {
    const [dateRange, setDateRange] = useState('last7'); // last7, last30, allTime
    
    const filteredOrders = useMemo(() => {
        const now = new Date();
        const delivered = orders.filter(o => o.status === 'Delivered');

        if (dateRange === 'allTime') {
            return delivered;
        }

        const startTime = new Date();
        if (dateRange === 'last7') {
            startTime.setDate(now.getDate() - 7);
        } else if (dateRange === 'last30') {
            startTime.setDate(now.getDate() - 30);
        }
        
        return delivered.filter(o => (o.createdAt.seconds * 1000) >= startTime.getTime());

    }, [orders, dateRange]);

    const totalSales = filteredOrders.reduce((sum, o) => sum + o.total, 0);
    const totalOrders = filteredOrders.length;
    const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

    const downloadCSV = () => {
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "OrderID,Date,CustomerName,Total,Items\r\n";

        filteredOrders.forEach(order => {
            const date = new Date(order.createdAt.seconds * 1000).toLocaleDateString();
            const items = order.items.map(item => `${item.quantity}x ${item.name}`).join('; ');
            csvContent += `${order.id},${date},"${order.customer.name}",${order.total},"${items}"\r\n`;
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `sales_report_${dateRange}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow space-y-6">
            <div className="flex justify-between items-center">
                <h4 className="text-lg font-semibold text-gray-800">Sales Report</h4>
                <select value={dateRange} onChange={e => setDateRange(e.target.value)} className="border-gray-300 rounded-md shadow-sm">
                    <option value="last7">Last 7 Days</option>
                    <option value="last30">Last 30 Days</option>
                    <option value="allTime">All Time</option>
                </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div className="bg-gray-50 p-4 rounded-lg">
                    <h5 className="text-sm font-medium text-gray-500">Total Sales</h5>
                    <p className="mt-1 text-2xl font-semibold text-gray-900">EGP {totalSales.toFixed(2)}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                    <h5 className="text-sm font-medium text-gray-500">Total Orders</h5>
                    <p className="mt-1 text-2xl font-semibold text-gray-900">{totalOrders}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                    <h5 className="text-sm font-medium text-gray-500">Avg. Order Value</h5>
                    <p className="mt-1 text-2xl font-semibold text-gray-900">EGP {averageOrderValue.toFixed(2)}</p>
                </div>
            </div>

            <div>
                <button onClick={downloadCSV} className="w-full py-2 px-4 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700">
                    Download Report (CSV)
                </button>
            </div>
        </div>
    );
};

export default SalesReports;
