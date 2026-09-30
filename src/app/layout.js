'use client';
import { SessionProvider } from 'next-auth/react';
import Navbar from '@/component/Navbar';
import Footer from '@/component/Footer'
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <Navbar />
          {children}
        </SessionProvider>
        <Footer/>
      </body>
    </html>
  );
}