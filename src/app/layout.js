'use client';

import { SessionProvider } from 'next-auth/react';
import AutoEnquiryModal from "@/component/EnquiryModal";
import '../app/(website)/globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          {children}
          <AutoEnquiryModal/>
        </SessionProvider>
      </body>
    </html>
  );
}