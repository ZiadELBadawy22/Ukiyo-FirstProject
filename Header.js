import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Header = ({ isAdmin, cartItemCount, setShowCart, searchQuery, setSearchQuery, currentUser, userInfo, onLoginClick, onLogoutClick, showBackButton, onBackClick, allProducts, onLogSearch }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [logoError, setLogoError] = useState(false);
    const menuRef = useRef(null);
    const searchRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();

    // --- NEW: State and logic for hiding header on scroll ---
    const [headerVisible, setHeaderVisible] = useState(true);
    const lastScrollY = useRef(0);

    useEffect(() => {
        const controlHeader = () => {
            if (typeof window !== 'undefined') {
                // If scrolling down and past the header height, hide it
                if (window.scrollY > lastScrollY.current && window.scrollY > 100) {
                    setHeaderVisible(false);
                } else { // If scrolling up, show it
                    setHeaderVisible(true);
                }
                // Remember the new scroll position
                lastScrollY.current = window.scrollY;
            }
        };

        window.addEventListener('scroll', controlHeader);
        return () => {
            window.removeEventListener('scroll', controlHeader);
        };
    }, []);


    const isRealUser = currentUser && !currentUser.isAnonymous;
    const displayName = userInfo?.name || currentUser?.displayName || currentUser?.email;

    const [searchResults, setSearchResults] = useState([]);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [noResults, setNoResults] = useState(false);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setSearchResults([]);
            setNoResults(false);
            return;
        }
        if (allProducts) {
            const lowerCaseQuery = searchQuery.toLowerCase();
            const results = allProducts
                .filter(product => 
                    product.name.toLowerCase().includes(lowerCaseQuery) ||
                    (product.keywords && product.keywords.some(kw => kw.includes(lowerCaseQuery)))
                )
                .slice(0, 5);
            
            setSearchResults(results);
            const foundResults = results.length > 0;
            setNoResults(!foundResults);

            if(onLogSearch) {
                onLogSearch(lowerCaseQuery, foundResults);
            }
        }
    }, [searchQuery, allProducts, onLogSearch]);
    
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsSearchFocused(false);
            }
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [searchRef, menuRef]);

    const handleResultClick = (productId) => {
        navigate(`/product/${productId}`);
        setSearchQuery('');
        setSearchResults([]);
        setIsSearchFocused(false);
    };

    const UserAvatar = () => (
        <div className="h-8 w-8 rounded-full bg-stone-200 flex items-center justify-center">
            <svg className="h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
        </div>
    );

    const handleLogoutClick = () => {
        setMenuOpen(false);
        onLogoutClick();
    };
    
    const Logo = () => {
        if (logoError) {
            return (
                <div className="h-16 w-16 flex items-center justify-center rounded-full bg-amber-100 border border-amber-200">
                    <span className="font-serif text-3xl text-amber-800">U</span>
                </div>
            );
        }
        return (
            <img
                src="https://firebasestorage.googleapis.com/v0/b/ukiyo-store.firebasestorage.app/o/6667B111-9635-4244-A0A7-CAB11F4F19F2.PNG?alt=media&token=835272e0-8864-4c12-88df-746932928fdb"
                alt="Ukiyo Logo"
                className="h-16 w-16 object-contain rounded-full transition-transform duration-300 hover:scale-110"
                onError={() => setLogoError(true)}
            />
        );
    };

    return (
        // --- MODIFIED: Added transition and translate classes for smooth hiding/showing ---
    <header className={`bg-[#b08d57]/50 backdrop-blur-md shadow-lg sticky top-0 z-30 transition-transform duration-300 ${headerVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap sm:flex-nowrap items-center justify-between py-2 sm:h-20">
                <div className="flex items-center space-x-4">
                    {showBackButton && (
                        <button onClick={onBackClick} className="p-2 rounded-full text-white hover:bg-white/20 transition-colors -ml-2" aria-label="Go back">
                            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                    )}
                     <Link to="/" className="flex items-center space-x-4">
                        <Logo />
                        <div className="flex flex-col items-center -space-y-2">
                            <span className="text-4xl font-serif font-bold text-white tracking-wider">UKIYO</span>
                            <span className="font-serif text-xs text-white tracking-widest">STYLING HOMES</span>
                        </div>
                    </Link>
                </div>

                <div className="flex items-center space-x-4 sm:order-3">
                    {isRealUser ? (
                        <div className="relative" ref={menuRef}>
                            <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center space-x-2">
                                {currentUser.photoURL ? (
                                    <img src={currentUser.photoURL} alt="User" className="h-8 w-8 rounded-full" />
                                ) : (
                                    <UserAvatar />
                                )}
                                <span className="hidden sm:block text-sm font-medium text-white">{displayName}</span>
                            </button>
                            {menuOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                                    <Link to="/profile" onClick={() => setMenuOpen(false)} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Profile</Link>
                                    <Link to="/orders" onClick={() => setMenuOpen(false)} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Orders</Link>
                                    <Link to="/wishlist" onClick={() => setMenuOpen(false)} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Wishlist</Link>
                                    {isAdmin && <Link to="/admin" onClick={() => setMenuOpen(false)} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Admin Panel</Link>}
                                    <button onClick={handleLogoutClick} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button onClick={onLoginClick} className="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-white/20 transition-colors">Login</button>
                    )}

                    <button onClick={() => setShowCart(true)} className="relative p-2 rounded-full text-white hover:bg-white/20 transition-colors">
                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        {cartItemCount > 0 && (
                            <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold text-red-100 bg-red-600 rounded-full">{cartItemCount}</span>
                        )}
                    </button>
                </div>

                 {location.pathname === '/' && (
                    <div className="w-full sm:w-auto sm:flex-1 flex justify-center px-2 lg:ml-6 lg:justify-end order-3 sm:order-2 mt-4 sm:mt-0">
                        <div className="max-w-lg w-full lg:max-w-xs" ref={searchRef}>
                            <label htmlFor="search" className="sr-only">Search</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-white/70" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <input 
                                    id="search" 
                                    name="search" 
                                    className="block w-full pl-10 pr-10 py-2 rounded-md bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all" 
                                    placeholder="Search products..." 
                                    type="search" 
                                    autoComplete="off"
                                    value={searchQuery} 
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={() => setIsSearchFocused(true)}
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        aria-label="Clear search"
                                    >
                                        <svg className="h-5 w-5 text-white/70" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path></svg>
                                    </button>
                                )}
                            </div>
                            
                            {isSearchFocused && searchQuery.length > 0 && (
                                <div className="absolute mt-2 w-full bg-white rounded-md shadow-lg z-20 max-h-80 overflow-y-auto thin-scrollbar">
                                    {searchResults.length > 0 && (
                                        <ul className="divide-y divide-gray-200">
                                            {searchResults.map(product => (
                                                <li 
                                                    key={product.id} 
                                                    className="p-3 flex items-center hover:bg-gray-100 cursor-pointer"
                                                    onClick={() => handleResultClick(product.id)}
                                                >
                                                    <img src={product.imageUrls[0]} alt={product.name} className="h-12 w-12 object-cover rounded-md" />
                                                    <div className="ml-3">
                                                        <p className="text-sm font-medium text-gray-900">{product.name}</p>
                                                        <p className="text-sm text-gray-500">EGP {product.salePrice || product.price}</p>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                    {noResults && (
                                        <p className="p-4 text-sm text-gray-500">No results found for "{searchQuery}"</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                 )}
            </div>
        </div>
    </header>
    );
};

export default Header;

