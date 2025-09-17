import React, { useState, useEffect, useCallback, useRef } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Import services and hooks
import { auth, db } from './firebase/config';
import usePullToRefresh from './hooks/usePullToRefresh';
import {
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    GoogleAuthProvider,
    signInWithPopup,
    sendSignInLinkToEmail,
    isSignInWithEmailLink,
    signInWithEmailLink,
    sendPasswordResetEmail,
    updateEmail,
    reauthenticateWithCredential,
    EmailAuthProvider
} from 'firebase/auth';
import {
    doc,
    getDoc,
    collection,
    onSnapshot,
    query,
    where,
    getDocs,
    writeBatch,
    deleteDoc,
    addDoc,
    updateDoc,
    serverTimestamp,
    setDoc,
    orderBy,
    increment,
    runTransaction
} from 'firebase/firestore';

// Import Layout, Pages, and Global Components
import Layout from './components/Layout';
import ShopPage from './pages/ShopPage';
import ProductPage from './pages/ProductPage';
import ProfilePage from './pages/ProfilePage';
import OrdersPage from './pages/OrdersPage';
import WishlistPage from './pages/WishlistPage';
import AdminPage from './pages/AdminPage';
import Cart from './components/Cart';
import CheckoutModal from './components/CheckoutModal';
import AuthModal from './components/AuthModal';
import ImageLightbox from './components/ImageLightbox';
import Notification from './components/Notification';
import StylingAdviceModal from './components/StylingAdviceModal';
import OrderConfirmationModal from './components/OrderConfirmationModal';
import AddProductModal from './components/AddProductModal';
import EditProductModal from './components/EditProductModal';
import ConfirmationModal from './components/ConfirmationModal';
import PullToRefresh from './components/PullToRefresh';
import UploadingModal from './components/UploadingModal';

const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

// --- Main App Component ---
export default function App() {
    // --- All State Management ---
    const [isAdmin, setIsAdmin] = useState(false);
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [showCart, setShowCart] = useState(false);
    const [notification, setNotification] = useState({ show: false, message: '' });
    const [searchQuery, setSearchQuery] = useState('');
    const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [lightboxData, setLightboxData] = useState(null);
    const [orderConfirmation, setOrderConfirmation] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [couponError, setCouponError] = useState('');
    const [isStylingModalOpen, setIsStylingModalOpen] = useState(false);
    const [stylingAdvice, setStylingAdvice] = useState('');
    const [isStylingLoading, setIsStylingLoading] = useState(false);
    const [stylingError, setStylingError] = useState('');
    const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const [announcement, setAnnouncement] = useState({ text: '', isActive: false });
    const [deliveryCosts, setDeliveryCosts] = useState({ alexandria: 50, cairo: 70, other: 100 });
    const [isFreeDelivery, setIsFreeDelivery] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const { isRefreshing, pullPosition } = usePullToRefresh();
    const searchLogTimeout = useRef(null);


    const showNotification = useCallback((message) => {
        setNotification({ show: true, message });
        setTimeout(() => setNotification({ show: false, message: '' }), 3000);
    }, []);
    
    const mergeCarts = useCallback(async (user) => {
        if (!db) return;
        const localCartJson = localStorage.getItem('ukiyo-guest-cart');
        if (!localCartJson) return;
        const guestCart = JSON.parse(localCartJson);
        if (guestCart.length === 0) return;
        const userCartRef = collection(db, `users/${user.uid}/cart`);
        const batch = writeBatch(db);
        guestCart.forEach(item => {
            const docRef = doc(db, `users/${user.uid}/cart`, item.id);
            batch.set(docRef, item, { merge: true });
        });
        await batch.commit();
        localStorage.removeItem('ukiyo-guest-cart');
    }, []);

    const handleLogout = async () => {
        await signOut(auth);
        setCart([]);
        showNotification("You have been logged out.");
    };

    const handleAddToCart = useCallback((product) => {
        if (!currentUser) {
            const newCart = [...cart];
            const existingItemIndex = newCart.findIndex(item => item.id === product.id);
            if (existingItemIndex > -1) {
                newCart[existingItemIndex].quantity += 1;
            } else {
                newCart.push({ ...product, quantity: 1 });
            }
            setCart(newCart);
            localStorage.setItem('ukiyo-guest-cart', JSON.stringify(newCart));
        } else {
            const cartItemRef = doc(db, `users/${currentUser.uid}/cart`, product.id);
            getDoc(cartItemRef).then(docSnap => {
                const newQuantity = docSnap.exists() ? docSnap.data().quantity + 1 : 1;
                setDoc(cartItemRef, { ...product, quantity: newQuantity }, { merge: true });
            });
        }
        showNotification(`${product.name} added to cart!`);
    }, [currentUser, cart, showNotification]);

    const handleRemoveFromCart = useCallback((productId) => {
        if (currentUser) {
            deleteDoc(doc(db, `users/${currentUser.uid}/cart`, productId));
        } else {
            const newCart = cart.filter(item => item.id !== productId);
            setCart(newCart);
            localStorage.setItem('ukiyo-guest-cart', JSON.stringify(newCart));
        }
    }, [currentUser, cart]);

    const handleUpdateCartItem = useCallback((productId, newQuantity) => {
        if (newQuantity < 1) {
            handleRemoveFromCart(productId);
            return;
        }
        if (currentUser) {
            updateDoc(doc(db, `users/${currentUser.uid}/cart`, productId), { quantity: newQuantity });
        } else {
            const newCart = cart.map(item => item.id === productId ? { ...item, quantity: newQuantity } : item);
            setCart(newCart);
            localStorage.setItem('ukiyo-guest-cart', JSON.stringify(newCart));
        }
    }, [currentUser, cart, handleRemoveFromCart]);
    
    const handleToggleWishlist = async (product, isWishlisted) => {
        if (!currentUser) {
            showNotification("Please log in to use the wishlist.");
            setIsLoginModalOpen(true);
            return;
        }
        const wishlistRef = doc(db, `users/${currentUser.uid}/wishlist`, product.id);
        if (isWishlisted) {
            await deleteDoc(wishlistRef);
            showNotification(`${product.name} removed from wishlist.`);
        } else {
            await setDoc(wishlistRef, { productId: product.id, createdAt: serverTimestamp() });
            showNotification(`${product.name} added to wishlist!`);
        }
    };

    const handleEmailRegister = async (name, email, password) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            await setDoc(doc(db, "users", user.uid), { name, email, createdAt: serverTimestamp() });
            await mergeCarts(user);
            setIsLoginModalOpen(false);
            showNotification(`Welcome, ${name}!`);
        } catch (error) {
            showNotification(`Registration failed: ${error.message}`);
        }
    };

    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            const userRef = doc(db, 'users', user.uid);
            const docSnap = await getDoc(userRef);
            if (!docSnap.exists()) {
                await setDoc(userRef, { 
                    name: user.displayName, 
                    email: user.email,
                    createdAt: serverTimestamp()
                });
            }
            await mergeCarts(user);
            setIsLoginModalOpen(false);
            showNotification(`Welcome, ${user.displayName}!`);
        } catch (error) {
            showNotification("Could not sign in with Google.");
        }
    };

    const handleEmailLogin = async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const userRef = doc(db, 'users', user.uid);
            const docSnap = await getDoc(userRef);
            if (!docSnap.exists()) {
                await setDoc(userRef, { 
                    name: user.email, 
                    email: user.email,
                    createdAt: serverTimestamp()
                });
            }
            await mergeCarts(user);
            setIsLoginModalOpen(false);
            showNotification("Logged in successfully!");
        } catch (error) {
            showNotification(`Login failed: ${error.message}`);
        }
    };

    const handleSendSignInLink = async (email) => {
        const actionCodeSettings = { url: window.location.origin, handleCodeInApp: true };
        try {
            await sendSignInLinkToEmail(auth, email, actionCodeSettings);
            window.localStorage.setItem('emailForSignIn', email);
            showNotification("Sign-in link sent!");
        } catch (error) {
            showNotification(`Error sending link: ${error.message}`);
        }
    };

    const handleUpdateUserInfo = async (newInfo) => {
        if (!currentUser) return;
        const userRef = doc(db, "users", currentUser.uid);
        try {
            await updateDoc(userRef, newInfo);
            showNotification("Profile updated successfully!");
        } catch (error) {
            showNotification("Failed to update profile.");
        }
    };

    const handlePasswordReset = async () => {
        if (!currentUser?.email) return;
        try {
            await sendPasswordResetEmail(auth, currentUser.email);
            showNotification("Password reset email sent. Check your inbox.");
        } catch (error) {
            showNotification("Failed to send password reset email.");
        }
    };

    const handleEmailUpdate = async (newEmail, password) => {
        if (!currentUser) return;
        try {
            const credential = EmailAuthProvider.credential(currentUser.email, password);
            await reauthenticateWithCredential(currentUser, credential);
            await updateEmail(currentUser, newEmail);
            const userRef = doc(db, "users", currentUser.uid);
            await updateDoc(userRef, { email: newEmail });
            showNotification("Email updated successfully. Please log in again.");
            handleLogout();
        } catch (error) {
            showNotification(`Error updating email: ${error.message}`);
        }
    };

    const handleAddProduct = async (productData) => {
        const { id, ...data } = productData;
        if (!id || !data.name) {
            showNotification("Product ID and Name are required.");
            return;
        }
        try {
            await setDoc(doc(db, "products", id), { ...data, createdAt: serverTimestamp() });
            showNotification("Product added successfully!");
            setIsAddProductModalOpen(false);
        } catch (error) {
            showNotification("Failed to add product.");
        }
    };

    const handleUpdateProduct = async (updatedData) => {
        const { id, ...data } = updatedData;
        try {
            await updateDoc(doc(db, "products", id), data);
            showNotification("Product updated successfully!");
            setEditingProduct(null);
        } catch (error) {
            showNotification("Failed to update product.");
        }
    };

    const confirmDeleteProduct = async (productIds) => {
        if (!productIds || productIds.length === 0) return;
        
        const productOrProducts = productIds.length > 1 ? "products" : "product";
        if (!window.confirm(`Are you sure you want to permanently delete ${productIds.length} ${productOrProducts}? This cannot be undone.`)) {
            setIsConfirmModalOpen(false);
            setProductToDelete(null);
            return;
        }

        try {
            const batch = writeBatch(db);
            productIds.forEach(id => {
                const docRef = doc(db, "products", id);
                batch.delete(docRef);
            });
            await batch.commit();
            showNotification(`${productIds.length} ${productOrProducts} deleted successfully!`);
        } catch (error) {
            showNotification("Failed to delete products.");
        } finally {
            setIsConfirmModalOpen(false);
            setProductToDelete(null);
        }
    };

    const handleApplyCoupon = async (code) => {
        if (!code.trim()) {
            setCouponError("Please enter a coupon code.");
            return;
        }
        setCouponError('');
        setIsFreeDelivery(false);
        setCouponDiscount(0);

        const couponRef = doc(db, "coupons", code.toUpperCase());
        try {
            const docSnap = await getDoc(couponRef);
            if (!docSnap.exists()) {
                setCouponError("Invalid coupon code.");
                return;
            }

            const coupon = docSnap.data();
            const subtotal = cart.reduce((sum, item) => sum + (item.salePrice || item.price) * item.quantity, 0);

            if (coupon.expiryDate && new Date(coupon.expiryDate.seconds * 1000) < new Date()) {
                setCouponError("This coupon has expired.");
                return;
            }
            if (coupon.minPurchase && subtotal < coupon.minPurchase) {
                setCouponError(`This coupon requires a minimum purchase of EGP ${coupon.minPurchase}.`);
                return;
            }

            const ordersRef = collection(db, "orders");
            if (coupon.firstOrderOnly) {
                const q = query(ordersRef, where("userId", "==", currentUser.uid));
                const userOrdersSnap = await getDocs(q);
                if (!userOrdersSnap.empty) {
                    setCouponError("This coupon is for first-time customers only.");
                    return;
                }
            }
            if (coupon.usageLimit) {
                const q = query(ordersRef, where("userId", "==", currentUser.uid), where("coupon", "==", code.toUpperCase()));
                const usedOrdersSnap = await getDocs(q);
                if (usedOrdersSnap.size >= coupon.usageLimit) {
                    setCouponError("You have reached the usage limit for this coupon.");
                    return;
                }
            }

            if (coupon.type === 'free_delivery') {
                setIsFreeDelivery(true);
                showNotification("Free delivery unlocked!");
                return;
            }

            let discount = 0;
            if (coupon.type === 'percentage') {
                discount = (subtotal * coupon.value) / 100;
                if (coupon.maxDiscount && discount > coupon.maxDiscount) {
                    discount = coupon.maxDiscount;
                }
            } else if (coupon.type === 'fixed') {
                discount = coupon.value;
            }
            
            setCouponDiscount(discount);
            showNotification("Coupon applied successfully!");

        } catch (error) {
            console.error("Error applying coupon:", error);
            setCouponError("Could not apply coupon.");
        }
    };

    const handleGetStylingAdvice = useCallback(async () => {
        if (cart.length === 0) {
            showNotification("Add items to your cart for styling advice.");
            return;
        }
        setIsStylingLoading(true);
        setStylingAdvice('');
        setStylingError('');
        setIsStylingModalOpen(true);
        setShowCart(false);
        const productNames = cart.map(item => `${item.quantity} x ${item.name}`).join(', ');
        const userQuery = `I have the following Ukiyo home decor items in my cart: ${productNames}. How can I style these together in my home? Give me some elegant and inspiring ideas.`;
        const systemPrompt = "You are an expert interior designer for Ukiyo, a sophisticated home decor store in Egypt. Your style is minimalist, warm, and elegant, inspired by the Japanese concept of 'ukiyo' (living in the moment). Provide practical and beautiful styling advice. Keep the response concise, friendly, and in a single paragraph.";
        
        if (!GEMINI_API_KEY) {
             setStylingError("Styling service is not configured by the developer.");
             setIsStylingLoading(false);
             return;
        }
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;
        const payload = { contents: [{ parts: [{ text: userQuery }] }], systemInstruction: { parts: [{ text: systemPrompt }] }, };
        try {
            const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            if (!response.ok) throw new Error(`API call failed: ${response.status}`);
            const result = await response.json();
            const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) { setStylingAdvice(text); } else { throw new Error("Unexpected API response format."); }
        } catch (err) {
            console.error("Gemini API error:", err);
            setStylingError("Sorry, our AI stylist is taking a short break. Please try again later.");
        } finally {
            setIsStylingLoading(false);
        }
    }, [cart, showNotification]);

    const handleLogSearch = useCallback((term, foundResults) => {
        if (!term || term.length < 3) return;

        if (searchLogTimeout.current) {
            clearTimeout(searchLogTimeout.current);
        }

        searchLogTimeout.current = setTimeout(async () => {
            const searchTerm = term.toLowerCase().trim();
            const searchRef = doc(db, "searchAnalytics", searchTerm);
            
            try {
                await runTransaction(db, async (transaction) => {
                    const searchDoc = await transaction.get(searchRef);
                    if (!searchDoc.exists()) {
                        transaction.set(searchRef, {
                            term: searchTerm,
                            count: 1,
                            lastSearched: serverTimestamp(),
                            foundResults: foundResults
                        });
                    } else {
                        transaction.update(searchRef, {
                            count: increment(1),
                            lastSearched: serverTimestamp(),
                            foundResults: foundResults
                        });
                    }
                });
            } catch (error) {
                console.error("Error logging search:", error);
            }
        }, 1000);
    }, []);

    // --- DATA FETCHING & SUBSCRIPTIONS ---
    useEffect(() => {
        const favicon = document.querySelector('link[rel="icon"]');
        if (favicon) {
            favicon.href = 'https://firebasestorage.googleapis.com/v0/b/ukiyo-store.firebasestorage.app/o/ChatGPT%20Image%20Sep%2014%2C%202025%2C%2008_19_02%20AM.png?alt=media&token=4be29f8e-64b1-4bba-8d2d-10cc80ae5a30';
        }
    }, []);
    
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);
            if (user) {
                const adminRef = doc(db, "admins", user.uid);
                const adminDoc = await getDoc(adminRef);
                setIsAdmin(adminDoc.exists());
                
                const userRef = doc(db, "users", user.uid);
                const userUnsubscribe = onSnapshot(userRef, (doc) => {
                    if (doc.exists()) setUserInfo(doc.data());
                });
                
                const cartRef = collection(db, `users/${user.uid}/cart`);
                const cartUnsubscribe = onSnapshot(cartRef, snapshot => {
                    setCart(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
                });

                const wishlistRef = collection(db, `users/${user.uid}/wishlist`);
                const wishlistUnsubscribe = onSnapshot(wishlistRef, (snapshot) => {
                    setWishlist(snapshot.docs.map(doc => doc.id));
                });

                return () => {
                    userUnsubscribe();
                    cartUnsubscribe();
                    wishlistUnsubscribe();
                };
            } else {
                setIsAdmin(false);
                setUserInfo(null);
                setWishlist([]);
                try {
                    const localCart = localStorage.getItem('ukiyo-guest-cart');
                    setCart(localCart ? JSON.parse(localCart) : []);
                } catch { setCart([]); }
            }
        });
        return () => unsubscribe();
    }, []);
    
    useEffect(() => {
        const productsRef = collection(db, "products");
        const unsubscribe = onSnapshot(productsRef, snapshot => {
            setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const announcementRef = doc(db, "storeSettings", "announcement");
        const unsubscribe = onSnapshot(announcementRef, (doc) => {
            if (doc.exists()) {
                setAnnouncement(doc.data());
            } else {
                setAnnouncement({ text: '', isActive: false });
            }
        });
        return () => unsubscribe();
    }, []);
    
    useEffect(() => {
        const deliveryRef = doc(db, "storeSettings", "delivery");
        const unsubscribe = onSnapshot(deliveryRef, (doc) => {
            if (doc.exists()) {
                setDeliveryCosts(doc.data());
            }
        });
        return () => unsubscribe();
    }, []);

    const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <BrowserRouter>
            <PullToRefresh isRefreshing={isRefreshing} pullPosition={pullPosition} />
            <Routes>
                <Route path="/" element={
                    <Layout
                        isAdmin={isAdmin}
                        cartItemCount={cartItemCount}
                        setShowCart={setShowCart}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        currentUser={currentUser}
                        userInfo={userInfo}
                        onLoginClick={() => setIsLoginModalOpen(true)}
                        onLogoutClick={handleLogout}
                        announcement={announcement}
                        allProducts={products}
                        onLogSearch={handleLogSearch}
                    />
                }>
                    <Route index element={ <ShopPage allProducts={products} searchQuery={searchQuery} wishlist={wishlist} onToggleWishlist={handleToggleWishlist} /> } />
                    <Route path="product/:productId" element={ <ProductPage onAddToCart={handleAddToCart} onImageClick={(images, index) => setLightboxData({ images, index })} currentUser={currentUser} userInfo={userInfo} showNotification={showNotification} wishlist={wishlist} onToggleWishlist={handleToggleWishlist} /> } />
                    <Route path="wishlist" element={ <WishlistPage allProducts={products} wishlist={wishlist} onToggleWishlist={handleToggleWishlist} /> } />
                    <Route path="profile" element={ <ProfilePage userInfo={userInfo} onUpdate={handleUpdateUserInfo} onPasswordReset={handlePasswordReset} onEmailUpdate={handleEmailUpdate} showNotification={showNotification} /> } />
                    <Route path="orders" element={<OrdersPage />} />
                    {isAdmin && <Route path="admin" element={ <AdminPage products={products} onAddProductClick={() => setIsAddProductModalOpen(true)} onEditProductClick={(product) => setEditingProduct(product)} onDeleteProduct={confirmDeleteProduct} showNotification={showNotification} /> } />}
                </Route>
            </Routes>

            <Notification message={notification.message} show={notification.show} />
            <Cart showCart={showCart} setShowCart={setShowCart} cart={cart} updateCartItem={handleUpdateCartItem} removeFromCart={handleRemoveFromCart} openCheckout={() => setIsCheckoutModalOpen(true)} getStylingAdvice={handleGetStylingAdvice} />
            <AuthModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} onLogin={handleEmailLogin} onRegister={handleEmailRegister} onGoogleSignIn={handleGoogleSignIn} onSendLink={handleSendSignInLink} />
            <CheckoutModal isOpen={isCheckoutModalOpen} onClose={() => setIsCheckoutModalOpen(false)} cart={cart} userInfo={userInfo} onApplyCoupon={handleApplyCoupon} couponError={couponError} discount={couponDiscount} deliveryCosts={deliveryCosts} isFreeDelivery={isFreeDelivery} />
            <AnimatePresence> {lightboxData && <ImageLightbox data={lightboxData} onClose={() => setLightboxData(null)} />} </AnimatePresence>
            <StylingAdviceModal isOpen={isStylingModalOpen} onClose={() => setIsStylingModalOpen(false)} isLoading={isStylingLoading} advice={stylingAdvice} error={stylingError} />
            {orderConfirmation && <OrderConfirmationModal isOpen={!!orderConfirmation} data={orderConfirmation} onClose={() => setOrderConfirmation(null)} /> }
            <AddProductModal isOpen={isAddProductModalOpen} onClose={() => setIsAddProductModalOpen(false)} onAddProduct={handleAddProduct} />
            <EditProductModal isOpen={!!editingProduct} onClose={() => setEditingProduct(null)} product={editingProduct} onUpdateProduct={handleUpdateProduct} />
            <ConfirmationModal isOpen={isConfirmModalOpen} onClose={() => setIsConfirmModalOpen(false)} onConfirm={() => confirmDeleteProduct([productToDelete])} title="Delete Product" message="Are you sure you want to delete this product? This action cannot be undone." />
            <UploadingModal isOpen={isUploading} message="Processing..." />
        </BrowserRouter>
    );
}

