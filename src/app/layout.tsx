import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import './layout.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-heading' });

export const metadata: Metadata = {
  title: 'All The Beans - Premium Coffee',
  description: 'Browse and order premium coffee beans from around the world',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="layout-body">

        <header className="site-header">
          <div className="header-container">
            <div className="header-inner">
              <a href="/" className="site-logo">
                All The Beans
              </a>
              <nav className="site-nav">
                <a href="/#beans" className="nav-link">
                  Browse
                </a>
                <a href="/orders" className="nav-link">
                  Orders
                </a>
              </nav>
            </div>
          </div>
        </header>

        <main className="site-main">
          {children}
        </main>

        <footer className="site-footer">
          <div className="footer-container">
            <p>&copy; {new Date().getFullYear()} All The Beans</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
