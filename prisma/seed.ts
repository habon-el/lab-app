import { PrismaClient, Role, ProductType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminPass = await bcrypt.hash('Admin123!', 10);
  const customerPass = await bcrypt.hash('Customer123!', 10);

  await prisma.user.upsert({
    where: { email: 'admin@hatstudio.com' },
    update: {},
    create: { email: 'admin@hatstudio.com', passwordHash: adminPass, role: Role.ADMIN }
  });

  await prisma.user.upsert({
    where: { email: 'customer@hatstudio.com' },
    update: {},
    create: { email: 'customer@hatstudio.com', passwordHash: customerPass, role: Role.CUSTOMER }
  });

  const products = [
    {
      name: 'Classic 6-Panel Blank Cap',
      description: 'Premium cotton twill blank cap for full customization.',
      price: 34.99,
      hatStyle: 'Baseball Cap',
      colors: ['Black', 'Navy', 'Sand'],
      sizes: ['One Size'],
      category: 'Custom Blank',
      stockQty: 120,
      customizable: true,
      type: ProductType.BLANK,
      modelPath: '/models/hat.glb',
      images: ['/images/blank-1.jpg']
    },
    {
      name: 'Urban Trucker Blank',
      description: 'Structured trucker with mesh back and curved brim.',
      price: 29.99,
      hatStyle: 'Trucker',
      colors: ['Olive', 'Black'],
      sizes: ['One Size'],
      category: 'Custom Blank',
      stockQty: 85,
      customizable: true,
      type: ProductType.BLANK,
      modelPath: '/models/hat.glb',
      images: ['/images/blank-2.jpg']
    },
    {
      name: 'Nightline Ready Cap',
      description: 'Ready-made embroidery cap with minimalist branding.',
      price: 44.99,
      hatStyle: 'Dad Cap',
      colors: ['Black'],
      sizes: ['One Size'],
      category: 'Streetwear',
      stockQty: 45,
      customizable: false,
      type: ProductType.READY_MADE,
      modelPath: null,
      images: ['/images/ready-1.jpg']
    }
  ];

  for (const p of products) {
    const existing = await prisma.product.findFirst({ where: { name: p.name } });
    if (!existing) {
      await prisma.product.create({
        data: {
          name: p.name,
          description: p.description,
          price: p.price,
          hatStyle: p.hatStyle,
          colors: p.colors,
          sizes: p.sizes,
          category: p.category,
          stockQty: p.stockQty,
          customizable: p.customizable,
          type: p.type,
          modelPath: p.modelPath,
          images: { create: p.images.map((url) => ({ url })) }
        }
      });
    }
  }
}

main().finally(() => prisma.$disconnect());
