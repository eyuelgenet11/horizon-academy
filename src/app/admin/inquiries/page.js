import prisma from '@/lib/prisma';
import InquiriesClient from './InquiriesClient';
import '../admin.css';

export const metadata = { title: 'Admin — Inquiries' };

export default async function AdminInquiriesPage() {
  const inquiries = await prisma.contactInquiry.findMany({
    orderBy: { createdAt: 'desc' },
  });

  // Convert dates and object parameters to JSON serializable objects for Client Component hydration
  const serializedInquiries = inquiries.map(inq => ({
    ...inq,
    createdAt: inq.createdAt.toISOString()
  }));

  return <InquiriesClient initialInquiries={serializedInquiries} />;
}
