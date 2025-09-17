import React from 'react';

const StylingAdviceModal = ({ isOpen, onClose, isLoading, advice, error }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-full overflow-y-auto p-6">
                <div className="flex justify-between items-start">
                    <h2 className="text-2xl font-serif text-gray-800">✨ Ukiyo Styling Advice</h2>
                    <button onClick={onClose} className="p-1 rounded-full text-gray-500 hover:bg-gray-100">&times;</button>
                </div>
                <div className="mt-4 text-gray-600">
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center h-48">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#b08d57]"></div>
                            <p className="mt-4">Our AI stylist is thinking...</p>
                        </div>
                    )}
                    {error && <p className="text-red-500">{error}</p>}
                    {advice && <p className="whitespace-pre-wrap font-serif leading-relaxed">{advice}</p>}
                </div>
            </div>
        </div>
    );
};

export default StylingAdviceModal;