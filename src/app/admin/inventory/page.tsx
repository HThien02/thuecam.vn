import type { Metadata } from 'next';
import { getAdminRows } from '@/lib/data/admin-server';
import type { Product } from '@/types';
import InventoryManagerClient from './InventoryManagerClient';

export const metadata: Metadata = { title: 'Quản Lý Kho Camera | THUECAM Admin', robots: { index: false, follow: false } };

export default async function AdminInventoryPage() {
  const [series, units, assignments, products, bookings] = await Promise.all([
    getAdminRows('camera_series'),
    getAdminRows('camera_units'),
    getAdminRows('booking_camera_assignments'),
    getAdminRows<Product>('products'),
    getAdminRows('bookings'),
  ]);
  return <InventoryManagerClient initialSeries={series as Record<string, any>[]} initialUnits={units as Record<string, any>[]} initialAssignments={assignments as Record<string, any>[]} products={products} bookings={bookings as Record<string, any>[]} />;
}
