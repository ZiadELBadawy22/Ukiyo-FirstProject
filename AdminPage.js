import React, { useState, useEffect, useMemo } from 'react';
import { collection, onSnapshot, query, orderBy, doc, getDoc, setDoc, deleteDoc, where, getDocs, writeBatch, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import AdminView from '../components/AdminView';
import UserOrdersView from '../components/UserOrdersView';

const AdminPage = (props) => {
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);
    const [searchAnalytics, setSearchAnalytics] = useState({});
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedUserOrders, setSelectedUserOrders] = useState([]);
    
    // State to hold the active user filters, controlled by the UserManagement component
    const [userFilters, setUserFilters] = useState({ search: '', minSpend: 0, minOrders: 0 });

    // Fetch all necessary data for the admin panel
    useEffect(() => {
        const ordersRef = collection(db, "orders");
        const qOrders = query(ordersRef, orderBy('createdAt', 'desc'));
        const unsubOrders = onSnapshot(qOrders, (snapshot) => {
            setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        const usersRef = collection(db, "users");
        const unsubUsers = onSnapshot(usersRef, async (usersSnapshot) => {
            const usersData = await Promise.all(usersSnapshot.docs.map(async (userDoc) => {
                const adminRef = doc(db, "admins", userDoc.id);
                const adminSnap = await getDoc(adminRef);
                return { uid: userDoc.id, ...userDoc.data(), isAdmin: adminSnap.exists() };
            }));
            setUsers(usersData);
            setLoading(false);
        });
        
        const searchRef = collection(db, "searchAnalytics");
        const unsubSearch = onSnapshot(searchRef, (snapshot) => {
            const analyticsData = {};
            snapshot.forEach(doc => {
                analyticsData[doc.id] = doc.data();
            });
            setSearchAnalytics(analyticsData);
        });

        // Cleanup all listeners when the component unmounts
        return () => {
            unsubOrders();
            unsubUsers();
            unsubSearch();
        };
    }, []);
    
    // This calculation runs whenever the users, orders, or filters change.
    // It calculates each user's spending and order stats, then filters the list.
    const segmentedUsers = useMemo(() => {
        // First, calculate total spend and order count for each user
        const usersWithStats = users.map(user => {
            const userOrders = orders.filter(order => order.userId === user.uid && order.status === 'Delivered');
            const totalSpend = userOrders.reduce((sum, order) => sum + order.total, 0);
            return {
                ...user,
                orderCount: userOrders.length,
                totalSpend: totalSpend,
            };
        });

        // Then, apply the active filters
        return usersWithStats.filter(user => {
            const searchLower = userFilters.search.toLowerCase();
            const matchesSearch = user.name?.toLowerCase().includes(searchLower) || user.email?.toLowerCase().includes(searchLower);
            const matchesSpend = user.totalSpend >= userFilters.minSpend;
            const matchesOrders = user.orderCount >= userFilters.minOrders;
            return matchesSearch && matchesSpend && matchesOrders;
        });
    }, [users, orders, userFilters]);


    const handleManageAdmin = async (uid, shouldBeAdmin) => {
        if (window.confirm(`Are you sure you want to ${shouldBeAdmin ? 'grant' : 'revoke'} admin privileges?`)) {
            const adminRef = doc(db, "admins", uid);
            if (shouldBeAdmin) {
                await setDoc(adminRef, {});
                props.showNotification("Admin privileges granted.");
            } else {
                await deleteDoc(adminRef);
                props.showNotification("Admin privileges revoked.");
            }
        }
    };

    const handleUserClick = async (user) => {
        setSelectedUser(user);
        const ordersRef = collection(db, "orders");
        const q = query(ordersRef, where("userId", "==", user.uid), orderBy('createdAt', 'desc'));
        const ordersSnapshot = await getDocs(q);
        setSelectedUserOrders(ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    const handleUpdateStatus = async (orderId, newStatus) => {
        const orderRef = doc(db, "orders", orderId);
        await updateDoc(orderRef, { status: newStatus });
        props.showNotification(`Order status updated to ${newStatus}.`);
    };

    const handleBulkSale = async (productIds, percentage) => {
        if (!window.confirm(`Are you sure you want to apply a ${percentage}% discount to ${productIds.length} products?`)) return;
        
        const batch = writeBatch(db);
        productIds.forEach(id => {
            const product = props.products.find(p => p.id === id);
            if (product) {
                const salePrice = product.price * (1 - percentage / 100);
                const docRef = doc(db, "products", id);
                batch.update(docRef, { salePrice: Math.round(salePrice) });
            }
        });
        await batch.commit();
        props.showNotification(`${productIds.length} products updated with a ${percentage}% sale.`);
    };

    const handleBulkSetNewArrival = async (productIds, isNew) => {
        const action = isNew ? "set as new arrival" : "remove from new arrivals";
        if (!window.confirm(`Are you sure you want to ${action} for ${productIds.length} products?`)) return;

        const batch = writeBatch(db);
        productIds.forEach(id => {
            const docRef = doc(db, "products", id);
            batch.update(docRef, { isNew });
        });
        await batch.commit();
        props.showNotification(`${productIds.length} products updated.`);
    };
    
    if (loading) {
        return <div className="text-center py-20">Loading Admin Panel...</div>;
    }

    return (
        <>
            <AdminView
                orders={orders}
                users={segmentedUsers}
                searchAnalytics={searchAnalytics}
                onManageAdmin={handleManageAdmin}
                onUserClick={handleUserClick}
                onFilterChange={setUserFilters} // Pass the setter function to UserManagement
                onUpdateStatus={handleUpdateStatus}
                onBulkSale={handleBulkSale}
                onBulkSetNewArrival={handleBulkSetNewArrival}
                {...props}
            />
            <UserOrdersView
                isOpen={!!selectedUser}
                onClose={() => setSelectedUser(null)}
                user={selectedUser}
                orders={selectedUserOrders}
            />
        </>
    );
};

export default AdminPage;

