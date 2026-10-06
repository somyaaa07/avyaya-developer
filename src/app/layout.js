'use client';

import { SessionProvider } from 'next-auth/react';
import AutoEnquiryModal from "@/component/EnquiryModal";
import '../app/(website)/globals.css';
import WhatsAppButton from '@/component/WhatsAppButton';
import CallButton from '@/component/CallButton';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          {children}
          <AutoEnquiryModal/>
          <WhatsAppButton/>
          <CallButton/>
        </SessionProvider>
      </body>
    </html>
  );
}