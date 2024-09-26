'use client';

import './globals.css';
import { AuthProvider } from '../../context/authContext';

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-screen w-full">
      <body className="min-h-screen w-full">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
