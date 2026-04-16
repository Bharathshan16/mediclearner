
import { ReactNode, Suspense, lazy, useEffect, useState } from "react";
import NavBar from "./NavBar";
import { initDatabase, initChatHistory } from "@/utils/database";

const FloatingChatbot = lazy(() => import("./FloatingChatbot"));
const HistoryTab = lazy(() => import("./history"));

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [showDeferredUi, setShowDeferredUi] = useState(false);

  useEffect(() => {
    const storageTimer = window.setTimeout(() => {
      void initDatabase();
      void initChatHistory();
    }, 0);

    const deferredUiTimer = window.setTimeout(() => {
      setShowDeferredUi(true);
    }, 400);

    return () => {
      window.clearTimeout(storageTimer);
      window.clearTimeout(deferredUiTimer);
    };
  }, []);
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <NavBar />
      <main className="flex-grow animate-fade-in">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
      <footer className="py-6 border-t border-border/40">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Amrita Vishwa Vidyapeetham.
          </p>
        </div>
      </footer>
      {showDeferredUi ? (
        <Suspense fallback={null}>
          <FloatingChatbot />
          <HistoryTab />
        </Suspense>
      ) : null}
    </div>
  );
};

export default Layout;
