import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

const DATA_FILE = join(__dirname, 'data.json');
const STATIC_FILES = join(__dirname, '../dist');

let data = {
  carts: {},
  orders: [],
  products: [] 
};

// Load existing data from file
function loadData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const rawData = fs.readFileSync(DATA_FILE, 'utf8');
      data = JSON.parse(rawData);
      console.log('Data loaded successfully');
    }
  } catch (err) {
    console.error('Error loading data:', err);
  }
}

// Save data to file
function saveData() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    console.log('Data saved successfully');
  } catch (err) {
    console.error('Error saving data:', err);
  }
}

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://your-vercel-app-url.vercel.app' 
    : 'http://localhost:5173',
  credentials: true
}));
app.use(bodyParser.json());
app.use(express.static(STATIC_FILES));

// Load data on startup
loadData();

// Helper function to generate unique ID
function generateId(collection) {
  return collection.length > 0 ? Math.max(...collection.map(item => item.id)) + 1 : 1;
}

// API Routes

// Cart Endpoints
app.get('/api/cart/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const cart = data.carts[userId] || { items: [], totalItems: 0, totalPrice: 0 };
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

app.post('/api/cart/:userId/items', (req, res) => {
  try {
    const { userId } = req.params;
    const newItem = req.body;
    
    if (!data.carts[userId]) {
      data.carts[userId] = { items: [], totalItems: 0, totalPrice: 0 };
    }
    
    const cart = data.carts[userId];
    const existingItemIndex = cart.items.findIndex(item => item.productId === newItem.productId);
    
    if (existingItemIndex >= 0) {
      cart.items[existingItemIndex].quantity += newItem.quantity;
    } else {
      const newId = generateId(cart.items);
      cart.items.push({ ...newItem, id: newId });
    }
    
    // Update totals
    cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    cart.totalPrice = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    saveData();
    res.status(201).json(cart);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
});

app.put('/api/cart/:userId/items/:itemId', (req, res) => {
  try {
    const { userId, itemId } = req.params;
    const { quantity } = req.body;
    
    if (!data.carts[userId]) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    const cart = data.carts[userId];
    const itemIndex = cart.items.findIndex(item => item.id === parseInt(itemId));
    
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }
    
    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }
    
    // Update totals
    cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    cart.totalPrice = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    saveData();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update cart item' });
  }
});

app.delete('/api/cart/:userId/items/:itemId', (req, res) => {
  try {
    const { userId, itemId } = req.params;
    
    if (!data.carts[userId]) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    const cart = data.carts[userId];
    const itemIndex = cart.items.findIndex(item => item.id === parseInt(itemId));
    
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }
    
    cart.items.splice(itemIndex, 1);
    
    // Update totals
    cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    cart.totalPrice = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    saveData();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove item from cart' });
  }
});

app.delete('/api/cart/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    data.carts[userId] = { items: [], totalItems: 0, totalPrice: 0 };
    saveData();
    res.json(data.carts[userId]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to clear cart' });
  }
});

// Order Endpoints
app.post('/api/orders', (req, res) => {
  try {
    const { userId, shippingInfo, items, totalAmount } = req.body;
    
    const order = {
      id: generateId(data.orders),
      userId,
      shippingInfo,
      items: items.map(item => ({
        ...item,
        price: Number(item.price.toFixed(2)) // Ensure proper decimal format
      })),
      totalAmount: Number(totalAmount.toFixed(2)),
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    data.orders.push(order);
    
    // Clear the user's cart after order is placed
    if (data.carts[userId]) {
      data.carts[userId] = { items: [], totalItems: 0, totalPrice: 0 };
    }
    
    saveData();
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create order' });
  }
});

app.get('/api/orders/all', (req, res) => {
  try {
    // Sort by most recent first
    const sortedOrders = [...data.orders].sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );
    res.json(sortedOrders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

app.get('/api/orders/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const userOrders = data.orders
      .filter(order => order.userId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(userOrders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user orders' });
  }
});

app.get('/api/orders/details/:orderId', (req, res) => {
  try {
    const { orderId } = req.params;
    const order = data.orders.find(o => o.id === parseInt(orderId));
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch order details' });
  }
});

app.patch('/api/orders/:orderId', (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    
    const orderIndex = data.orders.findIndex(o => o.id === parseInt(orderId));
    
    if (orderIndex === -1) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    data.orders[orderIndex].status = status;
    data.orders[orderIndex].updatedAt = new Date().toISOString();
    
    saveData();
    res.json(data.orders[orderIndex]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// Admin Endpoints
app.get('/api/admin/stats', (req, res) => {
  try {
    const stats = {
      totalOrders: data.orders.length,
      pendingOrders: data.orders.filter(o => o.status === 'pending').length,
      completedOrders: data.orders.filter(o => o.status === 'completed').length,
      totalRevenue: data.orders
        .filter(o => o.status === 'completed')
        .reduce((sum, order) => sum + order.totalAmount, 0)
    };
    
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Serve frontend
app.get('*', (req, res) => {
  res.sendFile(join(STATIC_FILES, 'index.html'));
});

// Handle server shutdown
process.on('SIGINT', () => {
  saveData();
  process.exit();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});