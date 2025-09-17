import React from 'react';

const UploadingModal = ({ isOpen, message }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-8 text-center">
                <div className="flex justify-center items-center mb-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#b08d57]"></div>
                </div>
                <h3 className="text-lg font-medium text-gray-900">{message || "Processing..."}</h3>
            </div>
        </div>
    );
};

export default UploadingModal;
