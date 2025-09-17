import React from 'react';

const OrderConfirmationModal = ({ isOpen, data, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md text-center p-8">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                    <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 className="mt-4 text-2xl font-semibold text-gray-800">Thank you for your order!</h2>
                <p className="mt-2 text-gray-600">Your order has been placed successfully.</p>
                <div className="mt-6 bg-[#b08d57]/10 rounded-lg p-4 text-left">
                    <p className="text-sm text-gray-500">Order ID:</p>
                    <p className="font-mono text-gray-800 font-semibold">{data.orderId}</p>
                    <p className="text-sm text-gray-500 mt-2">Total Amount:</p>
                    <p className="font-sans text-gray-800 font-bold text-lg">EGP {data.total.toFixed(2)}</p>
                </div>
                <button
                    onClick={onClose}
                    className="w-full mt-6 py-3 px-4 bg-[#b08d57] text-white font-semibold rounded-md hover:bg-[#9c7b4d]"
                >
                    Continue Shopping
                </button>
            </div>
        </div>
    );
};

export default OrderConfirmationModal;