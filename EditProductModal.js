import React, { useState, useEffect } from 'react';

const EditProductModal = ({ isOpen, onClose, onUpdateProduct, product }) => {
    const [formData, setFormData] = useState({});

    // This effect runs when the modal is opened with a new product to edit
    useEffect(() => {
        if (product) {
            // Convert the arrays of URLs and keywords from Firestore back into
            // simple, comma-separated strings to be displayed in the textareas.
            const productWithStrings = {
                ...product,
                imageUrls: product.imageUrls ? product.imageUrls.join(', ') : '',
                keywords: product.keywords ? product.keywords.join(', ') : '',
            };
            setFormData(productWithStrings);
        }
    }, [product]);

    if (!isOpen || !product) return null;

    // A single handler to update the form data as the user types
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedData = {
            ...formData,
            price: parseFloat(formData.price),
            salePrice: formData.salePrice ? parseFloat(formData.salePrice) : null,
            quantity: parseInt(formData.quantity, 10),
            // Convert the comma-separated strings from the textareas back into arrays
            imageUrls: formData.imageUrls.split(',').map(url => url.trim()),
            keywords: formData.keywords.split(',').map(kw => kw.trim().toLowerCase()),
        };
        onUpdateProduct(updatedData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[95vh] overflow-y-auto">
                <form onSubmit={handleSubmit} className="p-6">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Edit Product</h2>
                    <div className="space-y-4">
                        <input type="text" value={formData.id || ''} className="w-full border-gray-300 rounded-md shadow-sm bg-gray-100" disabled />
                        <input type="text" name="name" placeholder="Product Name" value={formData.name || ''} onChange={handleChange} className="w-full border-gray-300 rounded-md shadow-sm" required />
                        <textarea name="description" placeholder="Description" value={formData.description || ''} onChange={handleChange} className="w-full border-gray-300 rounded-md shadow-sm" />
                        <input type="number" name="price" placeholder="Price" value={formData.price || ''} onChange={handleChange} className="w-full border-gray-300 rounded-md shadow-sm" required />
                        <input type="number" name="salePrice" placeholder="Sale Price (Optional)" value={formData.salePrice || ''} onChange={handleChange} className="w-full border-gray-300 rounded-md shadow-sm" />
                        <input type="number" name="quantity" placeholder="Quantity" value={formData.quantity || ''} onChange={handleChange} className="w-full border-gray-300 rounded-md shadow-sm" required />
                        <input type="text" name="category" placeholder="Category" value={formData.category || ''} onChange={handleChange} className="w-full border-gray-300 rounded-md shadow-sm" />
                        
                        <textarea 
                            name="imageUrls"
                            placeholder="Image URLs (comma-separated)" 
                            value={formData.imageUrls || ''} 
                            onChange={handleChange} 
                            className="w-full border-gray-300 rounded-md shadow-sm" 
                            rows="3"
                        />
                        <textarea 
                            name="keywords"
                            placeholder="Search Keywords (comma-separated)" 
                            value={formData.keywords || ''} 
                            onChange={handleChange} 
                            className="w-full border-gray-300 rounded-md shadow-sm" 
                            rows="2"
                        />
                        <div className="flex items-center">
                            <input type="checkbox" name="isNew" id="isNewEdit" checked={formData.isNew || false} onChange={handleChange} className="h-4 w-4 text-[#b08d57] border-gray-300 rounded" />
                            <label htmlFor="isNewEdit" className="ml-2 block text-sm text-gray-900">New Arrival</label>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end gap-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-[#b08d57] text-white rounded-md">Update Product</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProductModal;

