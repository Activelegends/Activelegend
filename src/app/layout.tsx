import './globals.css';

export const metadata = {
  title: 'Active Legend',
  description: 'Your gaming community',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body>
        {children}
      </body>
    </html>
  );
} 