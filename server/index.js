import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(join(__dirname, '../dist')));

const carts = {};
const orders = [];

app.get('/api/cart/:userId', (req, res) => {
  const { userId } = req.params;
  const cart = carts[userId] || { items: [], totalItems: 0, totalPrice: 0 };
  res.json(cart);
});

app.post('/api/cart/:userId/items', (req, res) => {
  const { userId } = req.params;
  const newItem = req.body;
  
  if (!carts[userId]) {
    carts[userId] = { items: [], totalItems: 0, totalPrice: 0 };
  }
  
  const cart = carts[userId];
  const existingItemIndex = cart.items.findIndex(item => item.productId === newItem.productId);
  
  if (existingItemIndex >= 0) {
    cart.items[existingItemIndex].quantity += newItem.quantity;
  } else {
    const newId = cart.items.length > 0 ? Math.max(...cart.items.map(item => item.id)) + 1 : 1;
    cart.items.push({ ...newItem, id: newId });
  }
  
  cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  cart.totalPrice = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  res.status(201).json(cart);
});

app.put('/api/cart/:userId/items/:itemId', (req, res) => {
  const { userId, itemId } = req.params;
  const { quantity } = req.body;
  
  if (!carts[userId]) {
    return res.status(404).json({ message: 'Cart not found' });
  }
  
  const cart = carts[userId];
  const itemIndex = cart.items.findIndex(item => item.id === parseInt(itemId));
  
  if (itemIndex === -1) {
    return res.status(404).json({ message: 'Item not found in cart' });
  }
  
  if (quantity <= 0) {
    cart.items.splice(itemIndex, 1);
  } else {
    cart.items[itemIndex].quantity = quantity;
  }
  

  cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  cart.totalPrice = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  res.json(cart);
});

app.delete('/api/cart/:userId/items/:itemId', (req, res) => {
  const { userId, itemId } = req.params;
  
  if (!carts[userId]) {
    return res.status(404).json({ message: 'Cart not found' });
  }
  
  const cart = carts[userId];
  const itemIndex = cart.items.findIndex(item => item.id === parseInt(itemId));
  
  if (itemIndex === -1) {
    return res.status(404).json({ message: 'Item not found in cart' });
  }
  
  cart.items.splice(itemIndex, 1);
  
  cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  cart.totalPrice = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  res.json(cart);
});

app.delete('/api/cart/:userId', (req, res) => {
  const { userId } = req.params;
  
  carts[userId] = { items: [], totalItems: 0, totalPrice: 0 };
  
  res.json(carts[userId]);
});

app.post('/api/orders', (req, res) => {
  const { userId, shippingInfo, items, totalAmount } = req.body;
  
  const order = {
    id: orders.length + 1,
    userId,
    shippingInfo,
    items,
    totalAmount,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  
  orders.push(order);
  
  if (carts[userId]) {
    carts[userId] = { items: [], totalItems: 0, totalPrice: 0 };
  }
  
  res.status(201).json(order);
});

app.get('/api/orders/all', (req, res) => {
  res.json(orders);
});

app.get('/api/orders/:userId', (req, res) => {
  const { userId } = req.params;
  const userOrders = orders.filter(order => order.userId === userId);
  res.json(userOrders);
});

app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});