import { Geist } from 'next/font/google';
import './globals.css';
import { ToastContainer } from '../src/components/ui/toast';
import { ModalContainer } from '../src/components/ui/modal-system';

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'Email signature builder',
  description: 'Create and manage your email signatures with ease',
};

// prevent zoom  on IOS after focus on input with font size smaller than 16px
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

const geistSans = Geist({
  display: 'swap',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body>
        {children}
        <ToastContainer />
        <ModalContainer />
      </body>
    </html>
  );
}
