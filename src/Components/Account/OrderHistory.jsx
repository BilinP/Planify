import React from 'react';
import './OrderHistory.css'; // Make sure this path is correct for your project

const OrderHistory = () => {
    const exampleOrders = [
        {
            orderNumber: 'E1001',
            date: '2025-04-01',
            eventName: 'Electronic Music Festival',
            eventDate: '2025-04-10',
            items: ['General Admission Ticket', 'VIP Table Package'],
            total: '$250.00',
            status: 'Delivered',
            venue: 'Downtown Arena'
        },
        {
            orderNumber: 'E1002',
            date: '2025-03-21',
            eventName: 'Jazz Night at the Park',
            eventDate: '2025-03-25',
            items: ['VIP Table'],
            total: '$150.00',
            status: 'In Progress',
            venue: 'Central Park Amphitheater'
        },
        {
            orderNumber: 'E1003',
            date: '2025-03-10',
            eventName: 'Comedy Show: Live Laugh',
            eventDate: '2025-03-15',
            items: ['VIP Ticket', 'Dinner Package'],
            total: '$120.00',
            status: 'Pending',
            venue: 'Comedy Club HQ'
        }
    ];

    return (
        <div className="order-history-container">
            <h1 className="order-history-title">Order History</h1>
            {exampleOrders.length === 0 ? (
                <p className="no-orders">No orders found.</p>
            ) : (
                <div className="orders-list">
                    {exampleOrders.map((order, index) => (
                        <div className="order-card" key={index}>
                            <h2>Order #{order.orderNumber}</h2>
                            <p><strong>Event:</strong> {order.eventName}</p>
                            <p><strong>Event Date:</strong> {order.eventDate}</p>
                            <p><strong>Venue:</strong> {order.venue}</p>
                            <p><strong>Items:</strong> {order.items.join(', ')}</p>
                            <p><strong>Total:</strong> {order.total}</p>
                            <div className={`order-status ${order.status.toLowerCase().replace(' ', '-')}`}>
                                {order.status}
                            </div>
                            <div className="action-buttons">
                                <button className="btn">Reorder</button>
                                {order.status === 'In Progress' && <button className="btn">Track Order</button>}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderHistory;
