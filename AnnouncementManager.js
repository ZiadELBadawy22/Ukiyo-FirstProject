import React, { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

const AnnouncementManager = ({ showNotification }) => {
    const [text, setText] = useState('');
    const [isActive, setIsActive] = useState(false);
    const [loading, setLoading] = useState(true);

    const announcementRef = doc(db, "storeSettings", "announcement");

    useEffect(() => {
        const unsubscribe = onSnapshot(announcementRef, (doc) => {
            if (doc.exists()) {
                const data = doc.data();
                setText(data.text || '');
                setIsActive(data.isActive || false);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleSave = async () => {
        try {
            await setDoc(announcementRef, { text, isActive });
            showNotification("Announcement banner updated successfully!");
        } catch (error) {
            console.error("Error updating announcement:", error);
            showNotification("Failed to update announcement.");
        }
    };

    if (loading) {
        return <p>Loading announcement settings...</p>;
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow space-y-4">
            <h4 className="text-lg font-semibold text-gray-800">Site-Wide Announcement</h4>
            <div>
                <label htmlFor="banner-text" className="block text-sm font-medium text-gray-700">Banner Text</label>
                <input
                    id="banner-text"
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="e.g., Free shipping on orders over EGP 1000!"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
            </div>
            <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">Display Banner</span>
                <label className="flex items-center cursor-pointer">
                    <div className="relative">
                        <input type="checkbox" checked={isActive} onChange={() => setIsActive(!isActive)} className="sr-only" />
                        <div className="block bg-gray-300 w-14 h-8 rounded-full"></div>
                        <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${isActive ? 'transform translate-x-full bg-green-500' : ''}`}></div>
                    </div>
                </label>
            </div>
            <button onClick={handleSave} className="w-full py-2 bg-[#b08d57] text-white font-semibold rounded-md hover:bg-[#9c7b4d]">
                Save Announcement
            </button>
        </div>
    );
};

export default AnnouncementManager;

