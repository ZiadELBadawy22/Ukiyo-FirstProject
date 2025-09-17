import React, { useState, useEffect } from 'react';
// This should be the list of cities from your old App.js
const egyptianCities = ["Cairo", "Alexandria", "Giza" /* ... and so on */].sort();

const ProfileView = ({ userInfo, onUpdate, onPasswordReset, onEmailUpdate, showNotification }) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [city, setCity] = useState('');
    const [address, setAddress] = useState('');

    useEffect(() => {
        if (userInfo) {
            setName(userInfo.name || '');
            setPhone(userInfo.phone || '');
            setCity(userInfo.city || '');
            setAddress(userInfo.address || '');
        }
    }, [userInfo]);

    const handleSave = () => {
        onUpdate({ name, phone, city, address });
    };

    const handleEmailChangeRequest = () => {
        const newEmail = prompt("Please enter your new email address:");
        if (newEmail) {
            const password = prompt("For security, please re-enter your password:");
            if (password) {
                onEmailUpdate(newEmail, password);
            } else {
                showNotification("Password is required to change email.");
            }
        }
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-extrabold text-gray-800 sm:text-4xl">My Profile</h2>
                    <p className="mt-4 text-xl text-gray-600">Update your personal and shipping information.</p>
                </div>

                <div className="bg-white shadow-lg rounded-lg p-8 space-y-6">
                    <div>
                        <label htmlFor="name-profile" className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input type="text" id="name-profile" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                    </div>
                    <div>
                        <label htmlFor="phone-profile" className="block text-sm font-medium text-gray-700">Phone Number</label>
                        <input type="tel" id="phone-profile" value={phone} onChange={e => setPhone(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                    </div>
                    <div>
                        <label htmlFor="city-profile" className="block text-sm font-medium text-gray-700">City</label>
                        <select id="city-profile" value={city} onChange={e => setCity(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                            <option value="">Select a City</option>
                            {egyptianCities.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="address-profile" className="block text-sm font-medium text-gray-700">Full Address</label>
                        <input type="text" id="address-profile" value={address} onChange={e => setAddress(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                    </div>
                    <button onClick={handleSave} className="w-full py-2 px-4 bg-[#b08d57] text-white font-semibold rounded-md hover:bg-[#9c7b4d]">Save Changes</button>
                </div>

                <div className="bg-white shadow-lg rounded-lg p-8 mt-8 space-y-4">
                    <h3 className="text-lg font-medium text-gray-800">Account Security</h3>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button onClick={handleEmailChangeRequest} className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-50">Change Email</button>
                        <button onClick={onPasswordReset} className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-50">Reset Password</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileView;