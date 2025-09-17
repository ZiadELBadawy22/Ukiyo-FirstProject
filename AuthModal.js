import React, { useState } from 'react';

const AuthModal = ({ isOpen, onClose, onLogin, onRegister, onGoogleSignIn, onSendLink }) => {
    const [view, setView] = useState('password'); // 'password' or 'link'
    const [isRegistering, setIsRegistering] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');

    if (!isOpen) return null;

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        setMessage('');
        if (isRegistering) {
            onRegister(name, email, password);
        } else {
            onLogin(email, password);
        }
    };

    const handleLinkSubmit = (e) => {
        e.preventDefault();
        setMessage('');
        onSendLink(email);
        setMessage(`A sign-in link has been sent to ${email}. Check your inbox!`);
        setView('message'); // Show message view
    };

    const renderPasswordView = () => (
        <>
            <h2 className="text-2xl font-semibold text-gray-800">{isRegistering ? 'Create Account' : 'Login to Ukiyo'}</h2>
            <form onSubmit={handlePasswordSubmit} className="mt-6 space-y-4 text-left">
                {isRegistering && (
                     <div>
                        <label htmlFor="name-auth" className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input type="text" id="name-auth" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required />
                    </div>
                )}
                <div>
                    <label htmlFor="email-auth" className="block text-sm font-medium text-gray-700">Email</label>
                    <input type="email" id="email-auth" value={email} onChange={e => setEmail(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required />
                </div>
                <div>
                    <label htmlFor="password-auth"className="block text-sm font-medium text-gray-700">Password</label>
                    <input type="password" id="password-auth" value={password} onChange={e => setPassword(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required />
                </div>
                <button type="submit" className="w-full mt-4 py-2 px-4 bg-[#b08d57] text-white font-semibold rounded-md hover:bg-[#9c7b4d]">
                    {isRegistering ? 'Register' : 'Login'}
                </button>
            </form>

            <div className="my-4 flex items-center">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="flex-shrink mx-4 text-gray-400 text-sm">OR</span>
                <div className="flex-grow border-t border-gray-300"></div>
            </div>

             <button onClick={onGoogleSignIn} className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.42-4.55H24v8.51h12.8c-.57 3.02-2.31 5.48-4.79 7.21l7.47 5.81C43.34 38.08 46.98 32.08 46.98 24.55z"></path><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.47-5.81c-2.15 1.45-4.92 2.3-8.42 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path><path fill="none" d="M0 0h48v48H0z"></path></svg>
                Sign in with Google
            </button>

            <div className="mt-4 flex justify-center items-center space-x-4">
                <button onClick={() => setIsRegistering(!isRegistering)} className="text-sm text-[#b08d57] hover:underline">
                    {isRegistering ? 'Already have an account? Login' : "Don't have an account? Register"}
                </button>
                 <button onClick={() => setView('link')} className="text-sm text-gray-600 hover:underline">
                    Use sign-in link
                </button>
            </div>
        </>
    );

    const renderLinkView = () => (
        <>
            <h2 className="text-2xl font-semibold text-gray-800">Sign in with Email Link</h2>
            <p className="mt-2 text-gray-600 text-sm">Enter your email to receive a password-free sign-in link.</p>
            <form onSubmit={handleLinkSubmit} className="mt-6 space-y-4 text-left">
                <div>
                    <label htmlFor="email-link" className="block text-sm font-medium text-gray-700">Email</label>
                    <input type="email" id="email-link" value={email} onChange={e => setEmail(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required />
                </div>
                 <button type="submit" className="w-full mt-4 py-2 px-4 bg-[#b08d57] text-white font-semibold rounded-md hover:bg-[#9c7b4d]">
                    Send Link
                </button>
            </form>
            <div className="mt-4">
                 <button onClick={() => setView('password')} className="text-sm text-gray-600 hover:underline">
                    Back to password login
                </button>
            </div>
        </>
    );

    const renderMessageView = () => (
        <>
            <h2 className="text-2xl font-semibold text-gray-800">Check your Email</h2>
            <p className="mt-4 text-gray-600">{message}</p>
            <button onClick={onClose} className="w-full mt-6 py-2 px-4 bg-[#b08d57] text-white font-semibold rounded-md hover:bg-[#9c7b4d]">
                Close
            </button>
        </>
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-sm text-center p-8 relative">
                <button onClick={onClose} className="absolute top-2 right-2 p-1 rounded-full text-gray-500 hover:bg-gray-100">&times;</button>
                {view === 'password' && renderPasswordView()}
                {view === 'link' && renderLinkView()}
                {view === 'message' && renderMessageView()}
            </div>
        </div>
    );
};

export default AuthModal;