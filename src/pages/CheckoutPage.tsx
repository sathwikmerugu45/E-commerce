import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import Button from '../components/ui/Button';

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  cardName: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  cardName?: string;
  cardNumber?: string;
  expiry?: string;
  cvv?: string;
}

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cartItems, totalPrice, clearCart } = useCart();
  const [formState, setFormState] = useState<FormState>({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    country: '',
    postalCode: '',
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  
  useEffect(() => {
    document.title = 'Checkout | Eclypse';
    window.scrollTo(0, 0);
    
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems.length, navigate]);
  
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateCardNumber = (cardNumber: string) => {
    const cleaned = cardNumber.replace(/\s+/g, '');
    return /^\d{13,16}$/.test(cleaned);
  };

  const validateExpiry = (expiry: string) => {
    if (!/^\d{2}\/\d{2}$/.test(expiry)) return false;
    
    const [month, year] = expiry.split('/').map(Number);
    if (month < 1 || month > 12) return false;
    
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;
    
    if (year < currentYear) return false;
    if (year === currentYear && month < currentMonth) return false;
    
    return true;
  };

  const validateCVV = (cvv: string) => {
    return /^\d{3,4}$/.test(cvv);
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};
    
    if (!formState.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formState.lastName.trim()) newErrors.lastName = 'Last name is required';
    
    if (!formState.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formState.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formState.address.trim()) newErrors.address = 'Address is required';
    if (!formState.city.trim()) newErrors.city = 'City is required';
    if (!formState.country) newErrors.country = 'Country is required';
    
    if (!formState.postalCode.trim()) {
      newErrors.postalCode = 'Postal code is required';
    }
    
    if (!formState.cardName.trim()) newErrors.cardName = 'Card name is required';
    
    if (!formState.cardNumber.trim()) {
      newErrors.cardNumber = 'Card number is required';
    } else if (!validateCardNumber(formState.cardNumber)) {
      newErrors.cardNumber = 'Please enter a valid card number';
    }
    
    if (!formState.expiry.trim()) {
      newErrors.expiry = 'Expiry date is required';
    } else if (!validateExpiry(formState.expiry)) {
      newErrors.expiry = 'Please enter a valid expiry date (MM/YY)';
    }
    
    if (!formState.cvv.trim()) {
      newErrors.cvv = 'CVV is required';
    } else if (!validateCVV(formState.cvv)) {
      newErrors.cvv = 'Please enter a valid CVV (3-4 digits)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateForm();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Format card number with spaces every 4 digits
    if (name === 'cardNumber') {
      const cleaned = value.replace(/\s+/g, '').replace(/\D/g, '');
      const formatted = cleaned.replace(/(\d{4})/g, '$1 ').trim();
      setFormState(prev => ({ ...prev, [name]: formatted }));
      return;
    }
    
    // Format expiry date with slash
    if (name === 'expiry' && value.length === 2 && !formState.expiry.includes('/')) {
      setFormState(prev => ({ ...prev, [name]: value + '/' }));
      return;
    }
    
    setFormState(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched to show errors
    const allFields = Object.keys(formState);
    const touchedFields = allFields.reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {} as Record<string, boolean>);
    setTouched(touchedFields);
    
    // Validate form and prevent submission if invalid
    const isValid = validateForm();
    if (!isValid) {
      return;
    }
    
    setIsProcessing(true);
    setError(null);
    
    try {
      // Create order on the backend
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: '123', // In a real app, this would come from auth
          shippingInfo: {
            firstName: formState.firstName,
            lastName: formState.lastName,
            email: formState.email,
            address: formState.address,
            city: formState.city,
            country: formState.country,
            postalCode: formState.postalCode,
          },
          items: cartItems,
          totalAmount: totalPrice * 1.1, // Including tax
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create order');
      }
      
      // Clear the cart and redirect to success page
      clearCart();
      navigate('/checkout/success');
    } catch (err) {
      setError('An error occurred while processing your order. Please try again.');
      console.error('Checkout error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Check if form is valid for submit button
  const isFormValid = () => {
    return (
      formState.firstName.trim() &&
      formState.lastName.trim() &&
      validateEmail(formState.email) &&
      formState.address.trim() &&
      formState.city.trim() &&
      formState.country &&
      formState.postalCode.trim() &&
      formState.cardName.trim() &&
      validateCardNumber(formState.cardNumber) &&
      validateExpiry(formState.expiry) &&
      validateCVV(formState.cvv)
    );
  };
  
  return (
    <div className="py-24">
      <div className="container">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2"
          >
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Shipping Information */}
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formState.firstName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-2 border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-primary focus:border-primary`}
                    />
                    {errors.firstName && touched.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formState.lastName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-2 border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-primary focus:border-primary`}
                    />
                    {errors.lastName && touched.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formState.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-primary focus:border-primary`}
                    />
                    {errors.email && touched.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formState.address}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-2 border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-primary focus:border-primary`}
                    />
                    {errors.address && touched.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formState.city}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-2 border ${errors.city ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-primary focus:border-primary`}
                    />
                    {errors.city && touched.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                      Country
                    </label>
                    <select
                      id="country"
                      name="country"
                      value={formState.country}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-2 border ${errors.country ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-primary focus:border-primary`}
                    >
                      <option value="">Select Country</option>
                      <option value="In">India</option>
                      <option value="us">United States</option>
                      <option value="ca">Canada</option>
                      <option value="uk">United Kingdom</option>
                      <option value="au">Australia</option>
                    </select>
                    {errors.country && touched.country && <p className="mt-1 text-sm text-red-600">{errors.country}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      value={formState.postalCode}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-2 border ${errors.postalCode ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-primary focus:border-primary`}
                    />
                    {errors.postalCode && touched.postalCode && <p className="mt-1 text-sm text-red-600">{errors.postalCode}</p>}
                  </div>
                </div>
              </div>
              
              {/* Payment Information */}
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">
                      Name on Card
                    </label>
                    <input
                      type="text"
                      id="cardName"
                      name="cardName"
                      value={formState.cardName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-2 border ${errors.cardName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-primary focus:border-primary`}
                    />
                    {errors.cardName && touched.cardName && <p className="mt-1 text-sm text-red-600">{errors.cardName}</p>}
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      id="cardNumber"
                      name="cardNumber"
                      value={formState.cardNumber}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      maxLength={19}
                      placeholder="XXXX XXXX XXXX XXXX"
                      className={`w-full px-4 py-2 border ${errors.cardNumber ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-primary focus:border-primary`}
                    />
                    {errors.cardNumber && touched.cardNumber && <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="expiry" className="block text-sm font-medium text-gray-700 mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      id="expiry"
                      name="expiry"
                      value={formState.expiry}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      maxLength={5}
                      placeholder="MM/YY"
                      className={`w-full px-4 py-2 border ${errors.expiry ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-primary focus:border-primary`}
                    />
                    {errors.expiry && touched.expiry && <p className="mt-1 text-sm text-red-600">{errors.expiry}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                      CVV
                    </label>
                    <input
                      type="text"
                      id="cvv"
                      name="cvv"
                      value={formState.cvv}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      maxLength={4}
                      placeholder="XXX"
                      className={`w-full px-4 py-2 border ${errors.cvv ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-primary focus:border-primary`}
                    />
                    {errors.cvv && touched.cvv && <p className="mt-1 text-sm text-red-600">{errors.cvv}</p>}
                  </div>
                </div>
              </div>
            </form>
          </motion.div>
          
          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-white rounded-lg shadow-sm overflow-hidden sticky top-24">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold">Order Summary</h2>
              </div>
              
              <div className="p-6">
                {/* Item List */}
                <div className="max-h-64 overflow-y-auto mb-6">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex items-center gap-3 mb-4">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-12 h-12 object-cover rounded-md"
                      />
                      <div className="flex-grow">
                        <h3 className="text-sm font-medium">{item.name}</h3>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Qty: {item.quantity}</span>
                          <span>${item.price.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span>${(totalPrice * 0.1).toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="border-t border-gray-100 pt-4 mb-6">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>${(totalPrice * 1.1).toLocaleString()}</span>
                  </div>
                </div>
                
                <Button 
                  onClick={handleSubmit}
                  variant="primary"
                  size="lg"
                  loading={isProcessing}
                  fullWidth
                  disabled={!isFormValid() || isProcessing}
                >
                  {isProcessing ? 'Processing...' : 'Complete Order'}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;