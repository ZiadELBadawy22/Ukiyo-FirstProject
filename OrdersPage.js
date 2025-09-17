import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import OrderList from '../components/OrderList';

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const currentUser = auth.currentUser;

    useEffect(() => {
        if (!currentUser) {
            setLoading(false);
            return;
        }

        const ordersRef = collection(db, "orders");
        const q = query(ordersRef, where("userId", "==", currentUser.uid), orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setLoading(false);
        }, (error) => {
            console.error("Error fetching orders:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [currentUser]);

    if (loading) {
        return <div className="text-center py-20">Loading orders...</div>;
    }

    return (
        <OrderList 
            orders={orders} 
            title="My Orders" 
            subtitle="Here's a list of your past and current orders." 
        />
    );
};

export default OrdersPage;