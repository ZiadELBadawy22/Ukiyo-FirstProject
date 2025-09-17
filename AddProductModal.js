import React, { useState } from 'react';

const AddProductModal = ({ isOpen, onClose, onAddProduct }) => {
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [salePrice, setSalePrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [category, setCategory] = useState('');
    const [imageUrls, setImageUrls] = useState('');
    const [keywords, setKeywords] = useState('');
    const [isNew, setIsNew] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        const productData = {
            id,
            name,
            description,
            price: parseFloat(price),
            salePrice: salePrice ? parseFloat(salePrice) : null,
            quantity: parseInt(quantity, 10),
            category,
            imageUrls: imageUrls.split(',').map(url => url.trim()),
            keywords: keywords.split(',').map(kw => kw.trim().toLowerCase()),
            isNew,
        };
        onAddProduct(productData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[95vh] overflow-y-auto">
                <form onSubmit={handleSubmit} className="p-6">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add New Product</h2>
                    <div className="space-y-4">
                        <input type="text" placeholder="Product ID (e.g., prod9)" value={id} onChange={e => setId(e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm" required />
                        <input type="text" placeholder="Product Name" value={name} onChange={e => setName(e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm" required />
                        <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm" />
                        <input type="number" placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm" required />
                        <input type="number" placeholder="Sale Price (Optional)" value={salePrice} onChange={e => setSalePrice(e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm" />
                        <input type="number" placeholder="Quantity" value={quantity} onChange={e => setQuantity(e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm" required />
                        <input type="text" placeholder="Category" value={category} onChange={e => setCategory(e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm" />
                        <textarea 
                            placeholder="Image URLs (comma-separated)" 
                            value={imageUrls} 
                            onChange={e => setImageUrls(e.target.value)} 
                            className="w-full border-gray-300 rounded-md shadow-sm" 
                            rows="3"
                        />
                        <textarea 
                            placeholder="Search Keywords (comma-separated)" 
                            value={keywords} 
                            onChange={e => setKeywords(e.target.value)} 
                            className="w-full border-gray-300 rounded-md shadow-sm" 
                            rows="2"
                        />
                        <div className="flex items-center">
                            <input type="checkbox" id="isNewAdd" checked={isNew} onChange={e => setIsNew(e.target.checked)} className="h-4 w-4 text-[#b08d57] border-gray-300 rounded" />
                            <label htmlFor="isNewAdd" className="ml-2 block text-sm text-gray-900">New Arrival</label>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end gap-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-[#b08d57] text-white rounded-md">Add Product</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProductModal;

