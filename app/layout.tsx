import './globals.css';
import { Work_Sans } from 'next/font/google';
import ClientGlobalStyles from '../components/ClientGlobalStyles'; // ← Import
import { LanguageProvider } from '@/contexts/LanguageContext';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '../contexts/ThemeContext';
import { UserProvider } from '../contexts/UserContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const workSans = Work_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-work-sans',
});
const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
        />
      </head>
      <body className={`${workSans.variable} font-display min-h-screen bg-background-light text-text-color dark:bg-background-dark`}>
        
        <UserProvider>
          <ThemeProvider>
            <LanguageProvider>
              {children}
              <ToastContainer />
            </LanguageProvider>
          </ThemeProvider>
        </UserProvider>
        {/* Tailwind CDN + Config */}
        <script
          src="https://cdn.tailwindcss.com?plugins=forms,container-queries"
          suppressHydrationWarning
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              tailwind.config = {
                darkMode: "class",
                theme: {
                  extend: {
                    colors: {
                      primary: "#1A365D",
                      secondary: "#4FD1C5",
                      accent: "#D69E2E",
                      "background-light": "#F7FAFC",
                      "background-dark": "#101c22",
                      "text-color": "#2D3748",
                      "neutral-light": "#EDF2F7",
                    },
                    fontFamily: { display: ["Work Sans"] },
                    borderRadius: { DEFAULT: "0.25rem", lg: "0.5rem", xl: "0.75rem", full: "9999px" },
                  },
                },
              };
            `,
          }}
        />
        <ClientGlobalStyles />
      </body>
    </html>
  );
}