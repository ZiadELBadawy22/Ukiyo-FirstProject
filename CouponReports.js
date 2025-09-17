import React, { useMemo } from 'react';

const CouponReports = ({ orders }) => {
    // Memoize the calculation to prevent re-running on every render
    const couponPerformance = useMemo(() => {
        const performance = {};
        // Only consider orders that are delivered and actually used a coupon
        const deliveredOrders = orders.filter(o => o.status === 'Delivered' && o.coupon);

        deliveredOrders.forEach(order => {
            const code = order.coupon.toUpperCase();
            if (!performance[code]) {
                performance[code] = { uses: 0, totalDiscount: 0 };
            }
            performance[code].uses += 1;
            performance[code].totalDiscount += order.discount || 0;
        });

        // Convert to an array and sort by most used
        return Object.entries(performance).sort((a, b) => b[1].uses - a[1].uses);
    }, [orders]);

    return (
        <div className="bg-white p-6 rounded-lg shadow mt-8">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Coupon Performance</h4>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coupon Code</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Times Used</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Discounted</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {couponPerformance.map(([code, data]) => (
                            <tr key={code}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{code}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{data.uses}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">EGP {data.totalDiscount.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {couponPerformance.length === 0 && <p className="text-center py-4 text-gray-500">No coupons have been used on completed orders yet.</p>}
            </div>
        </div>
    );
};

export default CouponReports;

