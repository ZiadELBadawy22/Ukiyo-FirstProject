import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, serverTimestamp, setDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

const CouponManager = ({ showNotification }) => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // State for the new coupon form
    const [code, setCode] = useState('');
    const [type, setType] = useState('percentage');
    const [value, setValue] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [maxDiscount, setMaxDiscount] = useState(''); // Capped at amount
    const [minPurchase, setMinPurchase] = useState(''); // Eligible for orders over
    const [usageLimit, setUsageLimit] = useState(1); // Number of uses per user
    const [firstOrderOnly, setFirstOrderOnly] = useState(false);

    useEffect(() => {
        const couponsRef = collection(db, "coupons");
        const unsubscribe = onSnapshot(couponsRef, snapshot => {
            setCoupons(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleAddCoupon = async (e) => {
        e.preventDefault();
        // Free delivery coupons don't need a value
        if (!code || (type !== 'free_delivery' && !value)) {
            showNotification("Code and Value are required for this coupon type.");
            return;
        }
        const couponData = {
            code: code.toUpperCase(),
            type,
            value: type === 'free_delivery' ? null : Number(value), // Value is null for free delivery
            expiryDate: expiryDate ? new Date(expiryDate) : null,
            maxDiscount: maxDiscount ? Number(maxDiscount) : null,
            minPurchase: minPurchase ? Number(minPurchase) : null,
            usageLimit: usageLimit ? Number(usageLimit) : null,
            firstOrderOnly,
            createdAt: serverTimestamp()
        };
        try {
            await setDoc(doc(db, "coupons", couponData.code), couponData);
            showNotification(`Coupon ${couponData.code} added successfully.`);
            // Reset form
            setCode(''); setType('percentage'); setValue(''); setExpiryDate('');
            setMaxDiscount(''); setMinPurchase(''); setUsageLimit(1); setFirstOrderOnly(false);
        } catch (error) {
            console.error(error);
            showNotification("Error adding coupon.");
        }
    };

    const handleDeleteCoupon = async (couponId) => {
        if (window.confirm("Are you sure you want to delete this coupon?")) {
            try {
                await deleteDoc(doc(db, "coupons", couponId));
                showNotification("Coupon deleted.");
            } catch (error) {
                console.error(error);
                showNotification("Error deleting coupon.");
            }
        }
    };
    
    const formatDate = (timestamp) => {
        if (!timestamp) return 'N/A';
        return new Date(timestamp.seconds * 1000).toLocaleDateString();
    }
    
    const getCouponDisplayValue = (coupon) => {
        if (coupon.type === 'free_delivery') return 'Free Delivery';
        if (coupon.type === 'percentage') return `${coupon.value}% OFF`;
        return `EGP ${coupon.value} OFF`;
    };

    return (
        <div>
            <form onSubmit={handleAddCoupon} className="bg-white p-6 rounded-lg shadow mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                <h4 className="md:col-span-2 text-lg font-semibold text-gray-800">Create New Coupon</h4>
                <input type="text" value={code} onChange={e => setCode(e.target.value)} placeholder="Coupon Code (e.g., SUMMER10)" className="border-gray-300 rounded-md shadow-sm" required />
                <select value={type} onChange={e => setType(e.target.value)} className="border-gray-300 rounded-md shadow-sm">
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed (EGP)</option>
                    <option value="free_delivery">Free Delivery</option>
                </select>
                <input type="number" value={value} onChange={e => setValue(e.target.value)} placeholder="Discount Value" className="border-gray-300 rounded-md shadow-sm" disabled={type === 'free_delivery'} />
                <input type="number" value={minPurchase} onChange={e => setMinPurchase(e.target.value)} placeholder="Min. Purchase (EGP, Optional)" className="border-gray-300 rounded-md shadow-sm" />
                <input type="number" value={maxDiscount} onChange={e => setMaxDiscount(e.target.value)} placeholder="Max Discount (EGP, Optional)" className="border-gray-300 rounded-md shadow-sm" />
                <input type="date" value={expiryDate} onChange={e => setExpiryDate(e.target.value)} className="border-gray-300 rounded-md shadow-sm" />
                <input type="number" value={usageLimit} onChange={e => setUsageLimit(e.target.value)} placeholder="Uses per User" className="border-gray-300 rounded-md shadow-sm" />
                <div className="flex items-center">
                    <input type="checkbox" id="firstOrder" checked={firstOrderOnly} onChange={e => setFirstOrderOnly(e.target.checked)} className="h-4 w-4 text-[#b08d57] border-gray-300 rounded" />
                    <label htmlFor="firstOrder" className="ml-2 block text-sm text-gray-900">First Order Only</label>
                </div>
                <button type="submit" className="md:col-span-2 py-2 bg-[#b08d57] text-white rounded-md hover:bg-[#9c7b4d] font-semibold">Add Coupon</button>
            </form>

            <div className="bg-white p-4 rounded-lg shadow">
                 <h4 className="text-lg font-semibold text-gray-800 mb-4">Existing Coupons</h4>
                <ul className="space-y-2">
                    {loading && <p>Loading coupons...</p>}
                    {coupons.map(c => (
                        <li key={c.id} className="p-3 border rounded-md">
                            <div className="flex justify-between items-center font-semibold">
                                <span className="text-gray-900">{c.code}</span>
                                <span className="text-green-600">{getCouponDisplayValue(c)}</span>
                                <button onClick={() => handleDeleteCoupon(c.id)} className="text-red-500 hover:text-red-700 font-semibold">Delete</button>
                            </div>
                            <div className="text-xs text-gray-500 mt-2 grid grid-cols-2 gap-1">
                                <span>Expires: {formatDate(c.expiryDate)}</span>
                                <span>Min Purchase: {c.minPurchase ? `EGP ${c.minPurchase}` : 'N/A'}</span>
                                <span>Max Discount: {c.maxDiscount ? `EGP ${c.maxDiscount}` : 'N/A'}</span>
                                <span>Usage Limit: {c.usageLimit || 'N/A'}</span>
                                <span>First Order Only: {c.firstOrderOnly ? 'Yes' : 'No'}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default CouponManager;

