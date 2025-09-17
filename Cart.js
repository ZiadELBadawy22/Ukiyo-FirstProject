import React from 'react';
import { Link } from 'react-router-dom';

const Cart = ({ showCart, setShowCart, cart, updateCartItem, removeFromCart, openCheckout, getStylingAdvice }) => {
    if (!showCart) return null;
    const total = cart.reduce((sum, item) => sum + Number(item.salePrice || item.price) * item.quantity, 0);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setShowCart(false)}>
            {/* --- MODIFIED: Matched header's translucent style --- */}
            <div 
                className="fixed right-0 top-0 h-full w-full max-w-sm bg-[#b08d57]/50 backdrop-blur-md shadow-xl flex flex-col border-l border-white/20" 
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-4 border-b border-white/20">
                    <h2 className="text-xl font-semibold text-white">Shopping Cart</h2>
                    <button onClick={() => setShowCart(false)} className="p-2 rounded-full text-white hover:bg-white/20 text-2xl">&times;</button>
                </div>

                {cart.length === 0 ? (
                    <div className="flex-grow flex flex-col items-center justify-center text-white p-8">
                        <svg className="h-16 w-16 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                        <p className="text-lg">Your cart is empty.</p>
                        <button onClick={() => setShowCart(false)} className="mt-4 px-6 py-2 bg-white text-[#b08d57] font-semibold rounded-md hover:bg-gray-200">
                            Continue Shopping
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="flex-grow overflow-y-auto p-4 space-y-4">
                            {cart.map(item => {
                                const imageUrl = (item.imageUrls && item.imageUrls[0]) || 'https://placehold.co/80x80/cccccc/ffffff?text=No+Image';
                                return (
                                <div key={item.id} className="flex items-start space-x-4">
                                    <img src={imageUrl} alt={item.name} className="w-20 h-20 object-cover rounded-md border border-white/10" />
                                    <div className="flex-grow">
                                        <h3 className="text-md font-medium text-white">{item.name}</h3>
                                        <div className="flex items-center gap-2">
                                            {item.salePrice ? (
                                                <>
                                                 <p className="text-sm text-red-400 font-bold">EGP {Number(item.salePrice || 0).toFixed(2)}</p>
                                                 <p className="text-xs text-gray-200 line-through">EGP {Number(item.price || 0).toFixed(2)}</p>
                                                </>
                                            ) : (
                                                 <p className="text-sm text-gray-200">EGP {Number(item.price || 0).toFixed(2)}</p>
                                            )}
                                        </div>
                                        <div className="flex items-center mt-2">
                                            <button onClick={() => updateCartItem(item.id, item.quantity - 1)} className="px-2 py-1 border border-white/30 rounded-md text-white">-</button>
                                            <span className="px-3 text-white">{item.quantity}</span>
                                            <button onClick={() => updateCartItem(item.id, item.quantity + 1)} className="px-2 py-1 border border-white/30 rounded-md text-white">+</button>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-white">EGP {(Number(item.salePrice || item.price) * item.quantity).toFixed(2)}</p>
                                        <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-300 text-sm mt-2 font-semibold">Remove</button>
                                    </div>
                                </div>
                            );})}
                        </div>
                        <div className="p-4 border-t border-white/20">
                            <div className="flex justify-between items-center text-lg font-semibold text-white"><span>Subtotal</span><span>EGP {total.toFixed(2)}</span></div>
                            <p className="text-sm text-gray-200 mt-1">Shipping calculated at checkout.</p>
                            <button onClick={getStylingAdvice} className="w-full mt-4 py-3 px-4 bg-white/20 text-white font-semibold rounded-md hover:bg-white/30 transition-colors">
                                ✨ Get Styling Advice
                            </button>
                            <button onClick={openCheckout} className="w-full mt-2 py-3 px-4 bg-white text-[#b08d57] font-semibold rounded-md hover:bg-gray-200">Proceed to Checkout</button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Cart;
