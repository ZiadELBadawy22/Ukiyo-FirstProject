import React from 'react';

const statusColors = {
    Placed: 'bg-yellow-100 text-yellow-800',
    'Out for Delivery': 'bg-blue-100 text-blue-800',
    Delivered: 'bg-green-100 text-green-800',
    Cancelled: 'bg-red-100 text-red-800',
};

const UserOrdersView = ({ isOpen, onClose, user, orders }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="p-4 border-b">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">Order History for {user.name}</h2>
                            <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                        <button onClick={onClose} className="p-2 -mr-2 rounded-full text-gray-500 hover:bg-gray-100 text-2xl">&times;</button>
                    </div>
                </div>
                <div className="overflow-y-auto">
                    {orders.length > 0 ? (
                        <ul role="list" className="divide-y divide-gray-200">
                            {orders.map((order) => (
                                <li key={order.id} className="p-4 sm:p-6">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium text-gray-600 truncate">Order #{order.id.substring(0, 6)}</p>
                                        <div className="ml-2 flex-shrink-0 flex"><p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}>{order.status}</p></div>
                                    </div>
                                    <div className="mt-2 sm:flex sm:justify-between">
                                        <p className="flex items-center text-sm text-gray-500">{new Date(order.createdAt?.seconds * 1000).toLocaleDateString()}</p>
                                        <p className="mt-2 flex items-center text-sm font-bold text-gray-800 sm:mt-0 sm:ml-6">EGP {order.total.toFixed(2)}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="p-8 text-center text-gray-500">This user has not placed any orders.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserOrdersView;
