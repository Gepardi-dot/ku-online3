import { collection, writeBatch, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

const sampleProducts = [
  {
    name: 'Vintage Kurdish Kilim Rug',
    price: 180000,
    category: 'Home & Garden',
    condition: 'Used - Good',
    location: 'Erbil',
    description: 'A beautiful, hand-woven vintage Kilim rug with traditional geometric patterns. Adds a rustic charm to any room. 100% wool. Dimensions: 150cm x 200cm.',
    imageUrl: 'https://picsum.photos/seed/kilimrug/800/600',
    imageHint: 'kilim rug',
    seller: { name: 'Erbil Heritage', avatarUrl: 'https://picsum.photos/seed/sellerA/40/40', rating: 4.9 },
    sellerId: 'sampleSeller1',
  },
  {
    name: 'Modern Smartphone - Latest Model',
    price: 950000,
    category: 'Electronics',
    condition: 'New',
    location: 'Sulaymaniyah',
    description: 'Brand new smartphone with a stunning 6.7-inch display, 128GB storage, and a pro-grade camera system. Unlocked and ready for any carrier. Includes charger and case.',
    imageUrl: 'https://picsum.photos/seed/smartphone/800/600',
    imageHint: 'smartphone',
    seller: { name: 'Suli Tech', avatarUrl: 'https://picsum.photos/seed/sellerB/40/40', rating: 4.7 },
    sellerId: 'sampleSeller2',
  },
  {
    name: 'Handmade Leather Wallet',
    price: 45000,
    category: 'Fashion',
    condition: 'New',
    location: 'Duhok',
    description: 'A finely crafted men\'s wallet made from genuine leather. Features multiple card slots, a bill compartment, and a sleek, minimalist design.',
    imageUrl: 'https://picsum.photos/seed/leatherwallet/800/600',
    imageHint: 'leather wallet',
    seller: { name: 'Duhok Craftsmen', avatarUrl: 'https://picsum.photos/seed/sellerC/40/40', rating: 4.8 },
    sellerId: 'sampleSeller3',
  },
   {
    name: 'Professional Espresso Machine',
    price: 350000,
    category: 'Home & Garden',
    condition: 'Used - Like New',
    location: 'Erbil',
    description: 'Cafe-quality espresso machine for your home. Barely used. Includes all original accessories like portafilter, tamper, and milk frothing pitcher.',
    imageUrl: 'https://picsum.photos/seed/espresso/800/600',
    imageHint: 'espresso machine',
    seller: { name: 'Suli Tech', avatarUrl: 'https://picsum.photos/seed/sellerB/40/40', rating: 4.7 },
    sellerId: 'sampleSeller2',
  },
];

const sampleNotifications = [
    {
        userId: 'defaultUser',
        message: 'Welcome to KU-ONLINE! Your journey starts here.',
        href: '/',
        isRead: false,
    },
    {
        userId: 'defaultUser',
        message: 'A new "Vintage Kurdish Kilim Rug" has been listed in your area!',
        href: '#', // In a real app, this would be the product ID
        isRead: false,
    },
     {
        userId: 'defaultUser',
        message: 'Your order for "Handmade Leather Wallet" has shipped.',
        href: '#',
        isRead: true,
    }
];

export async function seedSampleData() {
  const batch = writeBatch(db);

  // Seed Products
  const productsRef = collection(db, 'products');
  sampleProducts.forEach((product) => {
    const docRef = collection(db, 'products').doc(); // Auto-generate ID
    batch.set(docRef, { ...product, currency: 'IQD', createdAt: serverTimestamp() });
  });

  // Seed Notifications
  const notificationsRef = collection(db, 'notifications');
   sampleNotifications.forEach((notif) => {
    const docRef = collection(db, 'notifications').doc(); // Auto-generate ID
    // In a real app, you'd associate this with the logged-in user's ID
    const finalNotif = { ...notif, createdAt: serverTimestamp() };
    if (finalNotif.href === '#') {
        finalNotif.href = `/products/${(productsRef.doc() as any).id}`; // Fake link for now
    }
    batch.set(docRef, finalNotif);
  });


  try {
    await batch.commit();
    console.log('Sample data has been seeded successfully.');
  } catch (error) {
    console.error('Error seeding data: ', error);
  }
}
