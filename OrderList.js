import React from 'react';

const statusColors = {
    Placed: 'bg-yellow-100 text-yellow-800',
    'Out for Delivery': 'bg-blue-100 text-blue-800',
    Delivered: 'bg-green-100 text-green-800',
    Cancelled: 'bg-red-100 text-red-800',
};

const OrderList = ({ orders, title, subtitle }) => (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight sm:text-4xl">{title}</h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600">{subtitle}</p>
        </div>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul role="list" className="divide-y divide-gray-200">
                {orders.length === 0 && <li className="p-4 text-center text-gray-500">No orders found.</li>}
                {orders.map((order) => (
                    <li key={order.id} className="p-4 sm:p-6">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-600 truncate">Order #{order.id.substring(0, 6)}</p>
                            <div className="ml-2 flex-shrink-0 flex">
                                <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}>{order.status}</p>
                            </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                            <div className="sm:flex">
                                <p className="flex items-center text-sm text-gray-500">{order.customer.name}</p>
                                <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">{new Date(order.createdAt?.seconds * 1000).toLocaleDateString()}</p>
                            </div>
                            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                <p className="font-bold">EGP {order.total.toFixed(2)}</p>
                            </div>
                        </div>
                        <div className="mt-4">
                            <h4 className="font-medium text-sm text-gray-700">Items:</h4>
                            <ul className="list-disc pl-5 mt-1 text-sm text-gray-500">{order.items.map(item => <li key={item.id}>{item.quantity} x {item.name}</li>)}</ul>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    </div>
);

export default OrderList;