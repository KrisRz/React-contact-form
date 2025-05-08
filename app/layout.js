import './globals.css';

export const metadata = {
  title: 'Contact Form',
  description: 'A simple contact form built with Next.js',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
} 