import express from 'express';
import cors from 'cors';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import bcrypt from 'bcryptjs';
import { PrismaClient, Role, ProductType, OrderStatus } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '10mb' }));

const PgStore = connectPgSimple(session);
app.use(
  session({
    store: new PgStore({ conString: process.env.DATABASE_URL, createTableIfMissing: true }),
    secret: process.env.SESSION_SECRET || 'dev-secret-change-me',
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7, sameSite: 'lax', secure: false }
  })
);

type AuthSession = session.Session & { user?: { id: string; role: Role; email: string } };

const requireAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const s = req.session as AuthSession;
  if (!s.user) return res.status(401).json({ message: 'Unauthorized' });
  next();
};

const requireAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const s = req.session as AuthSession;
  if (!s.user || s.user.role !== Role.ADMIN) return res.status(403).json({ message: 'Admin only' });
  next();
};

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.post('/api/auth/signup', async (req, res) => {
  const { email, password } = req.body;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(400).json({ message: 'Email already registered' });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { email, passwordHash, role: Role.CUSTOMER } });
  (req.session as AuthSession).user = { id: user.id, role: user.role, email: user.email };
  res.json({ user: { id: user.id, email: user.email, role: user.role } });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(400).json({ message: 'Invalid credentials' });
  (req.session as AuthSession).user = { id: user.id, role: user.role, email: user.email };
  res.json({ user: { id: user.id, email: user.email, role: user.role } });
});

app.post('/api/auth/logout', (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

app.get('/api/auth/me', (req, res) => {
  const s = req.session as AuthSession;
  res.json({ user: s.user || null });
});

app.get('/api/products', async (req, res) => {
  const { type, customizable, active = 'true', category, color, style } = req.query;
  const products = await prisma.product.findMany({
    where: {
      active: active === 'true',
      type: type ? (String(type) as ProductType) : undefined,
      customizable: customizable ? customizable === 'true' : undefined,
      category: category ? String(category) : undefined,
      hatStyle: style ? String(style) : undefined,
      colors: color ? { has: String(color) } : undefined
    },
    include: { images: true },
    orderBy: { createdAt: 'desc' }
  });
  res.json(products);
});

app.get('/api/products/:id', async (req, res) => {
  const product = await prisma.product.findUnique({ where: { id: req.params.id }, include: { images: true } });
  if (!product) return res.status(404).json({ message: 'Not found' });
  res.json(product);
});

app.post('/api/admin/products', requireAdmin, async (req, res) => {
  const data = req.body;
  const product = await prisma.product.create({
    data: {
      name: data.name,
      description: data.description,
      price: Number(data.price),
      hatStyle: data.hatStyle,
      colors: data.colors,
      sizes: data.sizes,
      category: data.category,
      stockQty: Number(data.stockQty),
      modelPath: data.modelPath || null,
      active: Boolean(data.active),
      customizable: Boolean(data.customizable),
      type: data.customizable ? ProductType.BLANK : ProductType.READY_MADE,
      images: { create: (data.images || []).map((url: string) => ({ url })) }
    },
    include: { images: true }
  });
  res.json(product);
});

app.put('/api/admin/products/:id', requireAdmin, async (req, res) => {
  const data = req.body;
  await prisma.productImage.deleteMany({ where: { productId: req.params.id } });
  const product = await prisma.product.update({
    where: { id: req.params.id },
    data: {
      name: data.name,
      description: data.description,
      price: Number(data.price),
      hatStyle: data.hatStyle,
      colors: data.colors,
      sizes: data.sizes,
      category: data.category,
      stockQty: Number(data.stockQty),
      modelPath: data.modelPath || null,
      active: Boolean(data.active),
      customizable: Boolean(data.customizable),
      type: data.customizable ? ProductType.BLANK : ProductType.READY_MADE,
      images: { create: (data.images || []).map((url: string) => ({ url })) }
    },
    include: { images: true }
  });
  res.json(product);
});

app.delete('/api/admin/products/:id', requireAdmin, async (req, res) => {
  await prisma.product.delete({ where: { id: req.params.id } });
  res.json({ ok: true });
});

app.get('/api/admin/dashboard', requireAdmin, async (_req, res) => {
  const [products, lowStock, orders, designs] = await Promise.all([
    prisma.product.count(),
    prisma.product.findMany({ where: { stockQty: { lte: 20 }, active: true }, include: { images: true } }),
    prisma.order.findMany({ include: { user: true }, orderBy: { createdAt: 'desc' }, take: 20 }),
    prisma.savedDesign.findMany({ include: { user: true, product: true }, orderBy: { createdAt: 'desc' }, take: 20 })
  ]);
  res.json({ products, lowStock, orders, designs });
});

app.get('/api/admin/orders', requireAdmin, async (_req, res) => {
  const orders = await prisma.order.findMany({ include: { user: true, items: true }, orderBy: { createdAt: 'desc' } });
  res.json(orders);
});

app.patch('/api/admin/orders/:id', requireAdmin, async (req, res) => {
  const order = await prisma.order.update({ where: { id: req.params.id }, data: { status: req.body.status as OrderStatus } });
  res.json(order);
});

app.get('/api/admin/designs', requireAdmin, async (_req, res) => {
  const designs = await prisma.savedDesign.findMany({ include: { user: true, product: true }, orderBy: { createdAt: 'desc' } });
  res.json(designs);
});

app.get('/api/cart', requireAuth, async (req, res) => {
  const user = (req.session as AuthSession).user!;
  let cart = await prisma.cart.findFirst({ where: { userId: user.id }, include: { items: { include: { product: { include: { images: true } }, savedDesign: true } } } });
  if (!cart) cart = await prisma.cart.create({ data: { userId: user.id }, include: { items: true } });
  res.json(cart);
});

app.post('/api/cart/items', requireAuth, async (req, res) => {
  const user = (req.session as AuthSession).user!;
  let cart = await prisma.cart.findFirst({ where: { userId: user.id } });
  if (!cart) cart = await prisma.cart.create({ data: { userId: user.id } });
  const { productId, quantity = 1, savedDesignId } = req.body;
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) return res.status(404).json({ message: 'Product missing' });

  const item = await prisma.cartItem.create({
    data: {
      cartId: cart.id,
      productId,
      quantity: Number(quantity),
      savedDesignId: savedDesignId || null,
      unitPrice: product.price
    }
  });
  res.json(item);
});

app.delete('/api/cart/items/:id', requireAuth, async (req, res) => {
  await prisma.cartItem.delete({ where: { id: req.params.id } });
  res.json({ ok: true });
});

app.post('/api/designs', requireAuth, async (req, res) => {
  const user = (req.session as AuthSession).user!;
  const d = req.body;
  const design = await prisma.savedDesign.create({
    data: {
      userId: user.id,
      productId: d.productId,
      name: d.name,
      customText: d.customText,
      decorationType: d.decorationType,
      placement: d.placement,
      imageUrl: d.imageUrl,
      transform: d.transform,
      previewShot: d.previewShot || null
    }
  });
  res.json(design);
});

app.get('/api/account', requireAuth, async (req, res) => {
  const user = (req.session as AuthSession).user!;
  const [orders, designs] = await Promise.all([
    prisma.order.findMany({ where: { userId: user.id }, include: { items: true }, orderBy: { createdAt: 'desc' } }),
    prisma.savedDesign.findMany({ where: { userId: user.id }, include: { product: true }, orderBy: { createdAt: 'desc' } })
  ]);
  res.json({ orders, designs });
});

app.post('/api/checkout', requireAuth, async (req, res) => {
  const user = (req.session as AuthSession).user!;
  const cart = await prisma.cart.findFirst({ where: { userId: user.id }, include: { items: { include: { product: true, savedDesign: true } } } });
  if (!cart || cart.items.length === 0) return res.status(400).json({ message: 'Cart is empty' });
  const total = cart.items.reduce((sum, i) => sum + Number(i.unitPrice) * i.quantity, 0);
  const order = await prisma.order.create({
    data: {
      userId: user.id,
      total,
      items: {
        create: cart.items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
          savedDesignId: i.savedDesignId,
          snapshotName: i.savedDesign?.name || i.product.name
        }))
      }
    },
    include: { items: true }
  });
  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  res.json({ message: 'Checkout placeholder complete', order });
});

app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
