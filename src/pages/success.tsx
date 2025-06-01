import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowLeft } from 'lucide-react';

const CheckoutSuccessPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Order Confirmed | Eclypse';
  }, []);

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-24">
      <div className="container text-center">
        <CheckCircle size={80} className="mx-auto text-green-500 mb-6" />
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Order Confirmed!</h1>
        <h2 className="text-xl md:text-2xl font-semibold mb-6">Thank you for your purchase</h2>
        <p className="text-gray-600 max-w-md mx-auto mb-8">
          Your order has been placed successfully. We've sent a confirmation email with your order details. 
          Your items will be shipped within 2-3 business days.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link 
            to="/orders" 
            className="btn btn-primary inline-flex items-center justify-center"
          >
            View Order Details
          </Link>
          <Link 
            to="/" 
            className="btn btn-outline inline-flex items-center justify-center"
          >
            <ArrowLeft size={18} className="mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccessPage;