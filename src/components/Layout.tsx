
import { ReactNode, useEffect } from "react";
import NavBar from "./NavBar";
import FloatingChatbot from "./FloatingChatbot";
import HistoryTab from "./history";
import { initDatabase, initChatHistory } from "@/utils/database";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  // Initialize the database when the layout mounts
  useEffect(() => {
    const initializeStorage = async () => {
      await initDatabase();
      await initChatHistory();
    };
    
    initializeStorage();
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
      <FloatingChatbot />
      <HistoryTab />
    </div>
  );
};

export default Layout;
