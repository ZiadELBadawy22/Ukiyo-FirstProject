import React, { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

const DeliveryManager = ({ showNotification }) => {
    const [costs, setCosts] = useState({ alexandria: 0, cairo: 0, other: 0 });
    const [loading, setLoading] = useState(true);

    const deliveryRef = doc(db, "storeSettings", "delivery");

    useEffect(() => {
        const unsubscribe = onSnapshot(deliveryRef, (doc) => {
            if (doc.exists()) {
                setCosts(doc.data());
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleSave = async () => {
        try {
            // Ensure values are numbers before saving
            const costsToSave = {
                alexandria: Number(costs.alexandria) || 0,
                cairo: Number(costs.cairo) || 0,
                other: Number(costs.other) || 0,
            };
            await setDoc(deliveryRef, costsToSave);
            showNotification("Delivery costs updated successfully!");
        } catch (error) {
            console.error("Error updating delivery costs:", error);
            showNotification("Failed to update delivery costs.");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCosts(prev => ({ ...prev, [name]: value }));
    };

    if (loading) {
        return <p>Loading delivery settings...</p>;
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow mt-8 space-y-4">
            <h4 className="text-lg font-semibold text-gray-800">Delivery Pricing (EGP)</h4>
            <div>
                <label htmlFor="alexandria" className="block text-sm font-medium text-gray-700">Alexandria</label>
                <input
                    id="alexandria"
                    name="alexandria"
                    type="number"
                    value={costs.alexandria}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
            </div>
            <div>
                <label htmlFor="cairo" className="block text-sm font-medium text-gray-700">Cairo</label>
                <input
                    id="cairo"
                    name="cairo"
                    type="number"
                    value={costs.cairo}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
            </div>
            <div>
                <label htmlFor="other" className="block text-sm font-medium text-gray-700">Other Cities</label>
                <input
                    id="other"
                    name="other"
                    type="number"
                    value={costs.other}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
            </div>
            <button onClick={handleSave} className="w-full py-2 bg-[#b08d57] text-white font-semibold rounded-md hover:bg-[#9c7b4d]">
                Save Delivery Costs
            </button>
        </div>
    );
};

export default DeliveryManager;
