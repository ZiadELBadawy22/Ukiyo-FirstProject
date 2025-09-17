import React from 'react';

const Notification = ({ message, show }) => {
    if (!show) return null;
    return <div className="fixed top-24 right-5 bg-green-500 text-white py-2 px-4 rounded-md shadow-lg z-50">{message}</div>;
};

export default Notification;