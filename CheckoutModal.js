import React, { useState, useEffect } from 'react';

// This list should be kept in a shared file in a real project, but is here for simplicity
const egyptianCities = [
    "Cairo", "Alexandria", "Giza", "Shubra El-Kheima", "Port Said", "Suez",
    "Luxor", "al-Mansura", "El-Mahalla El-Kubra", "Tanta", "Asyut", "Ismailia",
    "Fayyum", "Zagazig", "Aswan", "Damietta", "Damanhur", "al-Minya", "Beni Suef",
    "Qena", "Sohag", "Hurghada", "6th of October City", "Shibin El Kom", "Banha",
    "Kafr el-Sheikh", "Arish", "Belbeis", "Marsa Matruh", "Kafr El Dawwar", "Qalyub", "Abu Kabir"
].sort();

const CheckoutModal = ({ isOpen, onClose, cart, placeOrder, userInfo, onApplyCoupon, couponError, discount, deliveryCosts, isFreeDelivery }) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [city, setCity] = useState('');
    const [streetAddress, setStreetAddress] = useState('');
    const [shippingCost, setShippingCost] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [couponCode, setCouponCode] = useState('');

    useEffect(() => {
        if (userInfo) {
            setName(userInfo.name || '');
            setPhone(userInfo.phone || '');
            setCity(userInfo.city || '');
            setStreetAddress(userInfo.address || '');
        }
    }, [userInfo]);

    useEffect(() => {
        if (city) {
            const cityLower = city.toLowerCase();
            if (deliveryCosts && deliveryCosts[cityLower] !== undefined) {
                setShippingCost(deliveryCosts[cityLower]);
            } else if (deliveryCosts) {
                setShippingCost(deliveryCosts.other);
            }
        } else {
            setShippingCost(0);
        }
    }, [city, deliveryCosts]);

    if (!isOpen) return null;

    const subtotal = cart.reduce((sum, item) => sum + (item.salePrice || item.price) * item.quantity, 0);
    const finalShippingCost = isFreeDelivery ? 0 : shippingCost;
    const grandTotal = subtotal - discount + finalShippingCost;

    const handleSubmit = (e) => {
        e.preventDefault();
        const orderDetails = {
            customer: { name, phone, city, address: streetAddress },
            items: cart,
            subtotal,
            shipping: finalShippingCost,
            discount,
            coupon: couponCode.toUpperCase(),
            total: grandTotal,
            paymentMethod,
            status: 'Placed'
        };
        // This function is passed down from App.js but is currently commented out
        if (placeOrder) {
            placeOrder(orderDetails);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[95vh] overflow-y-auto">
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="flex justify-between items-start mb-6">
                        <h2 className="text-2xl font-semibold text-gray-800">Checkout</h2>
                        <button type="button" onClick={onClose} className="p-1 rounded-full text-gray-500 hover:bg-gray-100 text-3xl leading-none">&times;</button>
                    </div>
                    
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-medium text-gray-800">Shipping Information</h3>
                            <p className="text-sm text-gray-500">Enter your details for delivery.</p>
                        </div>
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                            <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required />
                        </div>
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                            <input type="tel" id="phone" value={phone} onChange={e => setPhone(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required />
                        </div>
                        <div>
                            <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                            <select id="city" value={city} onChange={e => setCity(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required>
                                <option value="">Select a City</option>
                                {egyptianCities.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Full Address (Street, Building, Apartment)</label>
                            <input type="text" id="address" value={streetAddress} onChange={e => setStreetAddress(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required />
                        </div>
                        
                        <div className="pt-4">
                            <label htmlFor="coupon" className="block text-sm font-medium text-gray-700">Coupon Code</label>
                            <div className="mt-1 flex rounded-md shadow-sm">
                                <input type="text" id="coupon" value={couponCode} onChange={e => setCouponCode(e.target.value)} className="flex-1 block w-full min-w-0 rounded-none rounded-l-md border-gray-300" placeholder="e.g., SUMMER10" />
                                <button 
                                    type="button" 
                                    onClick={() => onApplyCoupon(couponCode)} 
                                    className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm hover:bg-gray-100"
                                >
                                    Apply
                                </button>
                            </div>
                            {couponError && <p className="text-red-500 text-sm mt-1">{couponError}</p>}
                            {discount > 0 && <p className="text-green-600 text-sm mt-1">Success! EGP {discount.toFixed(2)} discount applied.</p>}
                            {isFreeDelivery && <p className="text-green-600 text-sm mt-1">Success! Free delivery applied.</p>}
                        </div>

                        <div className="pt-4">
                            <h3 className="text-lg font-medium text-gray-800">Payment Method</h3>
                             <div className="mt-2 space-y-2">
                                <label className="flex items-center p-3 border rounded-md has-[:checked]:bg-amber-50 has-[:checked]:border-amber-400">
                                    <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="h-4 w-4 text-[#b08d57] border-gray-300" />
                                    <span className="ml-3 text-sm font-medium text-gray-700">Cash on Delivery</span>
                                </label>
                                <label className="flex items-center p-3 border rounded-md has-[:checked]:bg-amber-50 has-[:checked]:border-amber-400">
                                    <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="h-4 w-4 text-[#b08d57] border-gray-300" disabled />
                                    <span className="ml-3 text-sm font-medium text-gray-500">Credit Card (coming soon)</span>
                                </label>
                            </div>
                        </div>
                        
                        <div className="border-t pt-4 mt-4 space-y-2">
                            <div className="flex justify-between text-md text-gray-600"><span>Subtotal</span><span>EGP {subtotal.toFixed(2)}</span></div>
                            {discount > 0 && <div className="flex justify-between text-md text-green-600"><span>Discount</span><span>- EGP {discount.toFixed(2)}</span></div>}
                            <div className={`flex justify-between text-md ${isFreeDelivery ? 'text-green-600' : 'text-gray-600'}`}>
                                <span>Shipping</span>
                                {isFreeDelivery ? (
                                    <span className="font-semibold">FREE</span>
                                ) : (
                                    <span>EGP {shippingCost.toFixed(2)}</span>
                                )}
                            </div>
                            <div className="flex justify-between items-center text-lg font-semibold text-gray-800"><span>Grand Total</span><span>EGP {grandTotal.toFixed(2)}</span></div>
                        </div>

                        <button type="submit" className="w-full mt-4 py-3 px-4 bg-[#b08d57] text-white font-semibold rounded-md hover:bg-[#9c7b4d] disabled:bg-gray-400" disabled={!city}>
                            {city ? 'Place Order' : 'Please Select a City'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CheckoutModal;

