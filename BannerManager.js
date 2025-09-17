import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, serverTimestamp, addDoc, doc, deleteDoc, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase/config'; // storage is no longer needed here

const BannerManager = ({ showNotification }) => {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    
    // --- MODIFIED: State now holds URLs instead of files ---
    const [newImageUrl, setNewImageUrl] = useState('');
    const [newLinkUrl, setNewLinkUrl] = useState('');

    const bannersRef = collection(db, "storeSettings", "banners", "slides");

    useEffect(() => {
        const q = query(bannersRef, orderBy('createdAt', 'asc'));
        const unsubscribe = onSnapshot(q, snapshot => {
            setBanners(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleAddBanner = async (e) => {
        e.preventDefault();
        if (!newImageUrl) {
            showNotification("Please provide an image URL.");
            return;
        }
        setIsSaving(true);

        try {
            // --- MODIFIED: Directly save the URLs to Firestore ---
            await addDoc(bannersRef, {
                imageUrl: newImageUrl,
                linkUrl: newLinkUrl,
                createdAt: serverTimestamp()
            });

            showNotification("New banner added successfully!");
            setNewImageUrl('');
            setNewLinkUrl('');
        } catch (error) {
            console.error("Error adding banner:", error);
            showNotification("Failed to add banner.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteBanner = async (banner) => {
        if (window.confirm("Are you sure you want to delete this banner?")) {
            try {
                // --- MODIFIED: Only delete the document from Firestore ---
                // We no longer delete from Storage since we don't own the URL.
                await deleteDoc(doc(db, "storeSettings", "banners", "slides", banner.id));
                showNotification("Banner deleted successfully.");
            } catch (error) {
                console.error("Error deleting banner:", error);
                showNotification("Failed to delete banner.");
            }
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow mt-8 space-y-6">
            <h4 className="text-lg font-semibold text-gray-800">Homepage Banners</h4>
            
            {/* --- MODIFIED: Form now uses text inputs for URLs --- */}
            <form onSubmit={handleAddBanner} className="space-y-4 p-4 border rounded-md">
                <div>
                    <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">Image URL</label>
                    <input 
                        id="imageUrl"
                        type="url" 
                        value={newImageUrl} 
                        onChange={e => setNewImageUrl(e.target.value)} 
                        placeholder="https://..." 
                        className="mt-1 w-full border-gray-300 rounded-md shadow-sm" 
                        required 
                    />
                </div>
                <div>
                    <label htmlFor="linkUrl" className="block text-sm font-medium text-gray-700">Optional: Hyperlink</label>
                    <input 
                        id="linkUrl"
                        type="url" 
                        value={newLinkUrl} 
                        onChange={e => setNewLinkUrl(e.target.value)} 
                        placeholder="https://..." 
                        className="mt-1 w-full border-gray-300 rounded-md shadow-sm" 
                    />
                </div>
                <button type="submit" disabled={isSaving} className="w-full py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 disabled:bg-gray-400">
                    {isSaving ? 'Saving...' : 'Add New Banner'}
                </button>
            </form>

            {/* List of existing banners */}
            <div>
                <h5 className="text-md font-semibold text-gray-700 mb-2">Current Banners</h5>
                {loading && <p>Loading banners...</p>}
                <div className="space-y-4">
                    {banners.map(banner => (
                        <div key={banner.id} className="flex items-center justify-between p-2 border rounded-md">
                            <img src={banner.imageUrl} alt="Banner" className="h-16 w-32 object-cover rounded-md" onError={(e) => e.target.style.display='none'}/>
                            <a href={banner.linkUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline truncate mx-4">{banner.linkUrl || 'No link'}</a>
                            <button onClick={() => handleDeleteBanner(banner)} className="text-red-500 hover:text-red-700 font-semibold">Delete</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BannerManager;

