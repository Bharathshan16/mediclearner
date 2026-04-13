import { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { streamChat } from "@/utils/chatStream";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatHistory, setChatHistory] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: "Hello! I'm MediAssist AI. How can I help you with your health questions today?",
          timestamp: new Date(),
        },
      ]);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    const newHistory = [...chatHistory, { role: "user" as const, content: input }];
    setChatHistory(newHistory);
    setInput("");
    setIsLoading(true);

    let assistantContent = "";
    const assistantId = `assistant-${Date.now()}`;

    const upsert = (chunk: string) => {
      assistantContent += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.id === assistantId) {
          return prev.map((m, i) =>
            i === prev.length - 1 ? { ...m, content: assistantContent } : m
          );
        }
        return [
          ...prev,
          { id: assistantId, role: "assistant", content: assistantContent, timestamp: new Date() },
        ];
      });
    };

    try {
      await streamChat({
        messages: newHistory,
        onDelta: upsert,
        onDone: () => {
          setChatHistory((prev) => [...prev, { role: "assistant", content: assistantContent }]);
          setIsLoading(false);
        },
        onError: (err) => {
          upsert(`Sorry, I encountered an error: ${err}`);
          setIsLoading(false);
        },
      });
    } catch {
      upsert("Sorry, something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  const renderMessages = () =>
    messages.map((message) => (
      <div
        key={message.id}
        className={`mb-4 ${message.role === "user" ? "ml-auto" : "mr-auto"}`}
      >
        <div
          className={`max-w-xs md:max-w-md px-4 py-2 rounded-lg whitespace-pre-wrap ${
            message.role === "user"
              ? "bg-primary text-primary-foreground ml-auto"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {message.content}
        </div>
        <div
          className={`text-xs text-muted-foreground mt-1 ${
            message.role === "user" ? "text-right" : "text-left"
          }`}
        >
          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>
    ));

  const renderChatContent = () => (
    <>
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Start a conversation
          </div>
        ) : (
          <>
            {renderMessages()}
            {isLoading && messages[messages.length - 1]?.role === "user" && (
              <div className="flex justify-center my-4">
                <div className="animate-pulse text-muted-foreground">Thinking...</div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type your message..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button onClick={sendMessage} disabled={isLoading || !input.trim()} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">Powered by MediAssist AI</p>
      </div>
    </>
  );

  if (isMobile) {
    return (
      <div className="fixed bottom-6 left-6 z-50">
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerTrigger asChild>
            <Button variant="default" size="icon" className="h-12 w-12 rounded-full bg-medical-600 hover:bg-medical-700 shadow-lg">
              <MessageCircle className="h-6 w-6" />
            </Button>
          </DrawerTrigger>
          <DrawerContent className="h-[80vh] flex flex-col">
            <DrawerHeader className="border-b">
              <DrawerTitle>MediAssist AI</DrawerTitle>
            </DrawerHeader>
            <div className="flex-1 overflow-hidden flex flex-col">{renderChatContent()}</div>
          </DrawerContent>
        </Drawer>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="default" size="icon" className="h-12 w-12 rounded-full bg-medical-600 hover:bg-medical-700 shadow-lg">
            <MessageCircle className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[400px] sm:w-[540px] p-0 flex flex-col">
          <SheetHeader className="p-4 border-b">
            <SheetTitle>MediAssist AI</SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-hidden flex flex-col">{renderChatContent()}</div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default FloatingChatbot;
