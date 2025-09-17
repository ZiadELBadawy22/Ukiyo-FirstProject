import React from 'react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6">
                <h3 className="text-lg font-medium text-gray-900">{title}</h3>
                <div className="mt-2">
                    <p className="text-sm text-gray-500">{message}</p>
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md">Cancel</button>
                    <button type="button" onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white rounded-md">Delete</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
