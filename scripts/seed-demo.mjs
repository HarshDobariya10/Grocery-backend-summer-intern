// Seeds a realistic demo store through the running Grocery API (demo mode: no Firebase key).
// Usage: node scripts/seed-demo.mjs [http://localhost:4000]
// Safe to re-run: existing categories/products (by name) are skipped; orders are only created once.

const API = process.argv[2] ?? process.env.API_URL ?? 'http://localhost:4000';
const ADMIN = 'demo-admin';
const CUSTOMER = 'demo-9876543210';
const DRIVER = 'demo-9123456789';

async function call(method, path, token, body) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: { ...(body ? { 'Content-Type': 'application/json' } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  const json = text ? JSON.parse(text) : {};
  if (!res.ok) throw new Error(`${method} ${path} → ${res.status}: ${JSON.stringify(json.message ?? json)}`);
  return json;
}

// [name, price, stock, unit, bestseller, recommended, description]
const CATALOG = {
  'Fruits & Vegetables': [
    ['Shimla Apple', 180, 40, '1 kg', true, false, 'Crisp, juicy apples from Himachal orchards.'],
    ['Robusta Banana', 48, 60, '6 pcs', true, false, 'Naturally ripened, rich in potassium.'],
    ['Alphonso Mango', 499, 6, '1 dozen', false, true, 'Ratnagiri Alphonso, the king of mangoes.'],
    ['Hybrid Tomato', 32, 80, '1 kg', false, false, 'Firm red tomatoes for curries and salads.'],
    ['Onion', 38, 120, '1 kg', true, false, 'Everyday red onions.'],
    ['Potato', 30, 100, '1 kg', false, false, 'All-purpose potatoes.'],
    ['Fresh Spinach (Palak)', 25, 8, '250 g', false, true, 'Tender leaves, washed and bundled.'],
    ['Green Capsicum', 40, 0, '500 g', false, false, 'Crunchy bell peppers.'],
    ['Ooty Carrot', 45, 35, '500 g', false, false, 'Sweet, bright orange carrots.'],
  ],
  'Dairy & Eggs': [
    ['Amul Taaza Toned Milk', 27, 90, '500 ml', true, false, 'Pasteurised toned milk.'],
    ['Farm Fresh Eggs', 84, 30, '12 pcs', true, false, 'Protein-rich brown eggs.'],
    ['Malai Paneer', 95, 5, '200 g', false, true, 'Soft, fresh cottage cheese.'],
    ['Amul Butter', 58, 45, '100 g', false, false, 'Utterly butterly delicious.'],
    ['Thick Curd (Dahi)', 35, 25, '400 g', false, false, 'Set curd made from toned milk.'],
    ['Cheese Slices', 140, 0, '200 g', false, false, 'Processed cheese slices.'],
  ],
  'Bakery': [
    ['Whole Wheat Bread', 50, 30, '400 g', true, false, '100% whole wheat sandwich bread.'],
    ['Butter Croissant', 65, 12, '1 pc', false, true, 'Flaky, buttery French croissant.'],
    ['Pav (Dinner Rolls)', 35, 20, '6 pcs', false, false, 'Soft pav for vada pav and bhaji.'],
    ['Chocolate Muffin', 55, 9, '1 pc', false, false, 'Moist double-chocolate muffin.'],
  ],
  'Snacks & Munchies': [
    ['Classic Salted Chips', 20, 150, '52 g', true, false, 'Crunchy potato chips.'],
    ['Aloo Bhujia Namkeen', 55, 70, '200 g', false, false, 'Spicy Bikaneri bhujia.'],
    ['Dark Chocolate Bar', 110, 40, '100 g', false, true, '55% cocoa dark chocolate.'],
    ['Digestive Biscuits', 40, 60, '250 g', false, false, 'High-fibre wheat biscuits.'],
    ['Roasted Almonds', 299, 4, '200 g', false, true, 'Lightly salted California almonds.'],
  ],
  'Beverages': [
    ['Orange Juice', 120, 25, '1 L', false, true, 'No added sugar, 100% juice.'],
    ['Masala Chai Tea', 165, 30, '250 g', true, false, 'Assam tea with cardamom and ginger.'],
    ['Filter Coffee Powder', 220, 18, '200 g', false, false, 'South Indian coffee-chicory blend.'],
    ['Cola Soft Drink', 40, 80, '750 ml', false, false, 'Chilled fizzy cola.'],
    ['Packaged Drinking Water', 20, 200, '1 L', false, false, 'Purified mineral water.'],
  ],
  'Staples & Atta': [
    ['Chakki Fresh Atta', 260, 35, '5 kg', true, false, 'Whole wheat flour for soft rotis.'],
    ['Basmati Rice', 199, 28, '1 kg', false, true, 'Long-grain aged basmati.'],
    ['Toor Dal', 165, 7, '1 kg', false, false, 'Unpolished arhar dal.'],
    ['Sunflower Oil', 185, 22, '1 L', false, false, 'Refined sunflower oil.'],
    ['Sugar', 48, 50, '1 kg', false, false, 'Fine crystal sugar.'],
  ],
  'Personal Care': [
    ['Neem Handwash', 99, 30, '200 ml', false, false, 'Germ-protection neem handwash.'],
    ['Herbal Shampoo', 175, 15, '340 ml', false, false, 'Gentle daily-care shampoo.'],
    ['Toothpaste', 95, 40, '150 g', false, false, 'Cavity protection with fluoride.'],
  ],
};

console.log(`Seeding ${API} …`);

// Admin account
try { await call('POST', '/admin/auth/login', ADMIN, {}); } catch { await call('POST', '/admin/auth/signup', ADMIN, { loginType: 'EMAIL' }); }

// Settings + delivery slots
const current = await call('GET', '/admin/settings', ADMIN);
await call('PATCH', '/admin/settings', ADMIN, {
  delivery_charge_express: 40,
  delivery_charge_eco: 15,
  min_order_value: 99,
  low_stock_threshold: 10,
  express_delivery_enabled: true,
  ...(current.deliverySlots.length ? {} : {
    deliverySlots: [
      { label: 'Morning', time: '7:00 AM – 10:00 AM', maxOrders: 40 },
      { label: 'Afternoon', time: '12:00 PM – 3:00 PM', maxOrders: 30 },
      { label: 'Evening', time: '6:00 PM – 9:00 PM', maxOrders: 50 },
    ],
  }),
});
console.log('✓ settings & delivery slots');

// Categories + products
const existingCats = (await call('GET', '/admin/category?take=50', ADMIN)).list;
const existingProducts = new Set((await call('GET', '/admin/product?take=50', ADMIN)).list.map((p) => p.name));
let sort = 1;
for (const [catName, items] of Object.entries(CATALOG)) {
  let cat = existingCats.find((c) => c.name === catName);
  if (!cat) cat = await call('POST', '/admin/category', ADMIN, { name: catName, sortOrder: sort, isActive: true });
  sort++;
  let added = 0;
  for (const [name, price, stockQty, unitType, isBestSeller, isRecommended, description] of items) {
    if (existingProducts.has(name)) continue;
    await call('POST', '/admin/product', ADMIN, { name, price, stockQty, unitType, isBestSeller, isRecommended, description, categoryId: cat.id, isActive: true });
    added++;
  }
  console.log(`✓ ${catName}: ${added} new products`);
}

// Demo customer with addresses + a few orders
await call('POST', '/customer/auth/login', CUSTOMER, { userName: 'Priya Sharma' });
let addresses = (await call('GET', '/address', CUSTOMER)).list;
if (!addresses.length) {
  await call('POST', '/address', CUSTOMER, { title: 'Home', fullAddress: 'B-402, Green Meadows, Baner Road', landmark: 'Near D-Mart', city: 'Pune', state: 'Maharashtra', pincode: '411045' });
  await call('POST', '/address', CUSTOMER, { title: 'Work', fullAddress: 'Tower 3, Hinjewadi IT Park Phase 1', city: 'Pune', state: 'Maharashtra', pincode: '411057' });
  addresses = (await call('GET', '/address', CUSTOMER)).list;
}
const orders = (await call('GET', '/api/orders', CUSTOMER)).list;
if (!orders.length) {
  const products = (await call('GET', '/product?take=50&isActive=true', null)).list;
  const pick = (n) => products.find((p) => p.name === n).id;
  const { deliverySlots } = await call('GET', '/api/orders/checkout', CUSTOMER);
  const home = addresses.find((a) => a.title === 'Home') ?? addresses[0];
  const work = addresses.find((a) => a.title === 'Work') ?? addresses[0];
  await call('POST', '/api/orders', CUSTOMER, { addressId: home.id, deliveryType: 'EXPRESS', paymentMethod: 'COD', items: [{ productId: pick('Amul Taaza Toned Milk'), quantity: 2 }, { productId: pick('Whole Wheat Bread'), quantity: 1 }, { productId: pick('Farm Fresh Eggs'), quantity: 1 }] });
  const tomorrow = new Date(Date.now() + 86400000).toISOString();
  await call('POST', '/api/orders', CUSTOMER, { addressId: work.id, deliveryType: 'ECO', slotId: deliverySlots[2]?.id, scheduledDate: tomorrow, instructions: 'Leave at reception', paymentMethod: 'COD', items: [{ productId: pick('Chakki Fresh Atta'), quantity: 1 }, { productId: pick('Basmati Rice'), quantity: 2 }, { productId: pick('Toor Dal'), quantity: 1 }] });
  const c = await call('POST', '/api/orders', CUSTOMER, { addressId: home.id, deliveryType: 'EXPRESS', paymentMethod: 'COD', items: [{ productId: pick('Classic Salted Chips'), quantity: 3 }, { productId: pick('Cola Soft Drink'), quantity: 2 }] });
  await call('PATCH', `/api/orders/${c.id}/cancel`, CUSTOMER);
  console.log('✓ demo customer Priya: 2 addresses, 3 orders (1 cancelled)');
} else console.log('• demo customer already has orders');

// Demo driver
await call('POST', '/driver/auth/login', DRIVER, { userName: 'Ravi Kumar' });
await call('PUT', '/api/driver/profile', DRIVER, { fullName: 'Ravi Kumar', city: 'Pune', vehicleName: 'Honda Activa 6G', plateNumber: 'MH12AB1234', licenseNumber: 'MH1220210001234' });
console.log('✓ demo driver Ravi');
console.log('Done.');
