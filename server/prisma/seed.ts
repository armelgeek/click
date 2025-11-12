import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create test user
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      name: 'Test User',
      password: hashedPassword,
    },
  });

  console.log('✅ Created test user:', user.email);

  // Create addresses
  const addresses = await Promise.all([
    prisma.address.upsert({
      where: { id: 'addr-1' },
      update: {},
      create: {
        id: 'addr-1',
        userId: user.id,
        label: 'Home',
        streetAddress: '123 Main Street',
        city: 'Paris',
        state: 'Île-de-France',
        postalCode: '75001',
        country: 'France',
        latitude: 48.8566,
        longitude: 2.3522,
        isDefault: true,
      },
    }),
    prisma.address.upsert({
      where: { id: 'addr-2' },
      update: {},
      create: {
        id: 'addr-2',
        userId: user.id,
        label: 'Work',
        streetAddress: '456 Business Avenue',
        city: 'Paris',
        state: 'Île-de-France',
        postalCode: '75002',
        country: 'France',
        latitude: 48.8606,
        longitude: 2.3376,
        isDefault: false,
      },
    }),
  ]);

  console.log('✅ Created addresses:', addresses.length);

  // Create payment methods
  const paymentMethods = await Promise.all([
    prisma.paymentMethod.upsert({
      where: { id: 'pm-1' },
      update: {},
      create: {
        id: 'pm-1',
        userId: user.id,
        type: 'card',
        provider: 'Visa',
        token: 'tok_visa_1234',
        last4: '4242',
        cardBrand: 'Visa',
        expiryMonth: 12,
        expiryYear: 2025,
        isDefault: true,
      },
    }),
    prisma.paymentMethod.upsert({
      where: { id: 'pm-2' },
      update: {},
      create: {
        id: 'pm-2',
        userId: user.id,
        type: 'card',
        provider: 'Mastercard',
        token: 'tok_mc_5678',
        last4: '5555',
        cardBrand: 'Mastercard',
        expiryMonth: 6,
        expiryYear: 2026,
        isDefault: false,
      },
    }),
    prisma.paymentMethod.upsert({
      where: { id: 'pm-3' },
      update: {},
      create: {
        id: 'pm-3',
        userId: user.id,
        type: 'paypal',
        provider: 'PayPal',
        token: 'tok_paypal_9999',
        isDefault: false,
      },
    }),
  ]);

  console.log('✅ Created payment methods:', paymentMethods.length);

  // Create sample orders
  const order1 = await prisma.order.create({
    data: {
      userId: user.id,
      addressId: addresses[0].id,
      paymentMethodId: paymentMethods[0].id,
      status: 'delivered',
      totalAmount: 89.99,
      currency: 'EUR',
      items: {
        create: [
          {
            name: 'Premium Vape Kit',
            quantity: 1,
            price: 49.99,
            image: '/products/vape-kit-1.jpg',
          },
          {
            name: 'E-Liquid Berry Mix',
            quantity: 2,
            price: 20.00,
            image: '/products/eliquid-berry.jpg',
          },
        ],
      },
    },
  });

  // Create delivery for order1
  await prisma.delivery.create({
    data: {
      orderId: order1.id,
      status: 'delivered',
      estimatedTimeMinutes: 0,
      driverName: 'Jean Dupont',
      driverPhone: '+33 6 12 34 56 78',
      driverVehicleType: 'scooter',
      driverRating: 4.8,
      destinationLatitude: addresses[0].latitude,
      destinationLongitude: addresses[0].longitude,
      destinationAddress: `${addresses[0].streetAddress}, ${addresses[0].city}`,
      shopLatitude: 48.8566,
      shopLongitude: 2.3522,
      shopAddress: 'ClickNVape Store, Paris',
      currentLatitude: addresses[0].latitude,
      currentLongitude: addresses[0].longitude,
      currentAddress: addresses[0].streetAddress,
      canCall: false,
      canMessage: false,
      timeline: {
        create: [
          {
            status: 'preparing',
            timestamp: new Date(Date.now() - 60 * 60 * 1000),
            description: 'Order received and being prepared',
            location: 'ClickNVape Store',
          },
          {
            status: 'ready',
            timestamp: new Date(Date.now() - 50 * 60 * 1000),
            description: 'Order ready for pickup',
            location: 'ClickNVape Store',
          },
          {
            status: 'picked_up',
            timestamp: new Date(Date.now() - 40 * 60 * 1000),
            description: 'Order picked up by driver',
            location: 'ClickNVape Store',
          },
          {
            status: 'on_the_way',
            timestamp: new Date(Date.now() - 20 * 60 * 1000),
            description: 'On the way to your location',
            location: 'In transit',
          },
          {
            status: 'delivered',
            timestamp: new Date(Date.now() - 10 * 60 * 1000),
            description: 'Order delivered successfully',
            location: addresses[0].streetAddress,
          },
        ],
      },
    },
  });

  // Create rating for order1
  await prisma.orderRating.create({
    data: {
      orderId: order1.id,
      rating: 5,
      comment: 'Great service, fast delivery!',
    },
  });

  console.log('✅ Created sample order 1 with delivery and rating');

  // Create a second order in progress
  const order2 = await prisma.order.create({
    data: {
      userId: user.id,
      addressId: addresses[1].id,
      paymentMethodId: paymentMethods[1].id,
      status: 'in_delivery',
      totalAmount: 34.99,
      currency: 'EUR',
      items: {
        create: [
          {
            name: 'Starter Vape Pen',
            quantity: 1,
            price: 29.99,
            image: '/products/vape-pen-1.jpg',
          },
          {
            name: 'Cleaning Kit',
            quantity: 1,
            price: 5.00,
            image: '/products/cleaning-kit.jpg',
          },
        ],
      },
    },
  });

  // Create delivery for order2
  await prisma.delivery.create({
    data: {
      orderId: order2.id,
      status: 'on_the_way',
      estimatedTimeMinutes: 8,
      driverName: 'Marie Martin',
      driverPhone: '+33 6 23 45 67 89',
      driverVehicleType: 'bike',
      driverRating: 4.9,
      destinationLatitude: addresses[1].latitude,
      destinationLongitude: addresses[1].longitude,
      destinationAddress: `${addresses[1].streetAddress}, ${addresses[1].city}`,
      shopLatitude: 48.8566,
      shopLongitude: 2.3522,
      shopAddress: 'ClickNVape Store, Paris',
      currentLatitude: 48.8586,
      currentLongitude: 2.3450,
      currentAddress: 'Near Rue de Rivoli',
      canCall: true,
      canMessage: true,
      timeline: {
        create: [
          {
            status: 'preparing',
            timestamp: new Date(Date.now() - 30 * 60 * 1000),
            description: 'Order received and being prepared',
            location: 'ClickNVape Store',
          },
          {
            status: 'ready',
            timestamp: new Date(Date.now() - 20 * 60 * 1000),
            description: 'Order ready for pickup',
            location: 'ClickNVape Store',
          },
          {
            status: 'picked_up',
            timestamp: new Date(Date.now() - 15 * 60 * 1000),
            description: 'Order picked up by driver',
            location: 'ClickNVape Store',
          },
          {
            status: 'on_the_way',
            timestamp: new Date(Date.now() - 5 * 60 * 1000),
            description: 'On the way to your location',
            location: 'In transit',
          },
        ],
      },
    },
  });

  console.log('✅ Created sample order 2 with active delivery');

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
