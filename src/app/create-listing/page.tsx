"use client";

import AppLayout from '@/components/layout/app-layout';
import { CreateListingForm } from '@/components/listing/create-listing-form';

export default function CreateListingPage() {
  return (
    <AppLayout>
      <div className="flex-1 space-y-4">
        <CreateListingForm />
      </div>
    </AppLayout>
  );
}
