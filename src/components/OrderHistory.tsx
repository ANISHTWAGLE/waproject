import React from 'react';
import { Clock, Package } from 'lucide-react';
import { Order } from '../types';
import { DateTime } from 'luxon';

interface OrderHistoryProps {
  orders: Order[];
}

export function OrderHistory({ orders }: OrderHistoryProps) {
  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p className="text-gray-600">No orders yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <Clock size={20} className="text-gray-400" />
              <span className="text-gray-600">
                {DateTime.fromISO(order.created_at).toLocaleString(DateTime.DATETIME_MED)}
              </span>
            </div>
            <span className="font-semibold text-lg">₹{order.total.toFixed(2)}</span>
          </div>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{item.name}</span>
                  <span className="text-gray-500">x{item.quantity}</span>
                </div>
                <span className="text-gray-600">₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}