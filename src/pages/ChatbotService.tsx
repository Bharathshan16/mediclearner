import React, { useState, useRef, useEffect } from "react";
import Layout from "../components/Layout";
import { Bot, Send, AlertCircle } from "lucide-react";
import { streamChat } from "@/utils/chatStream";

const suggestedQuestions = [
  "What causes headaches?",
  "How can I manage stress?",
  "What are symptoms of diabetes?",
  "How much exercise do I need?",
  "What should I eat for better health?",
  "When should I see a doctor for a fever?",
  "How can I improve my sleep?",
];

interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
}

const ChatbotService = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      text: "Hello! I'm MediAssist AI. I can answer your medical questions and provide general health information. You can type your question or click one of the suggested questions below.",
    },
  ]);
  const [chatHistory, setChatHistory] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (text = input) => {
    if (text.trim() === "" || isLoading) return;

    const userMsg: Message = { id: `user-${Date.now()}`, role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    const newHistory = [...chatHistory, { role: "user" as const, content: text }];
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
            i === prev.length - 1 ? { ...m, text: assistantContent } : m
          );
        }
        return [...prev, { id: assistantId, role: "assistant", text: assistantContent }];
      });
    };

    streamChat({
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
    }).catch(() => {
      upsert("Sorry, something went wrong. Please try again.");
      setIsLoading(false);
    });
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-block mb-4 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
            AI Health Assistant
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-4">MediAssist AI</h1>
          <p className="text-gray-500">Get instant AI-powered medical information and guidance</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border mb-6">
          <div className="flex items-center p-4 border-b">
            <Bot className="mr-2 text-blue-600" />
            <h2 className="font-medium">MediAssist AI</h2>
          </div>

          <div className="h-[450px] overflow-y-auto p-4 flex flex-col">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`mb-3 max-w-[80%] p-3 rounded-lg whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-blue-100 text-blue-800 self-end rounded-br-none"
                    : "bg-gray-100 text-gray-800 self-start rounded-bl-none"
                }`}
              >
                {msg.text}
              </div>
            ))}
            {isLoading && messages[messages.length - 1]?.role === "user" && (
              <div className="self-start bg-gray-100 text-gray-800 p-3 rounded-lg rounded-bl-none mb-3">
                <span>Thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 border-t border-b bg-gray-50">
            <p className="text-xs text-gray-500 mb-2">Suggested questions:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleSendMessage(question)}
                  className="text-xs px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
                  disabled={isLoading}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center p-4">
            <input
              type="text"
              className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="Ask about symptoms, conditions, or general health..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && !isLoading && handleSendMessage()}
              disabled={isLoading}
            />
            <button
              className={`ml-2 p-2 rounded-lg transition-colors ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
              onClick={() => handleSendMessage()}
              disabled={isLoading}
            >
              <Send size={18} />
            </button>
          </div>
        </div>

        <div className="bg-yellow-50 rounded-lg p-4 text-sm border border-yellow-200">
          <div className="flex items-start">
            <AlertCircle className="mr-2 mt-0.5 text-yellow-600" size={16} />
            <div>
              <h3 className="font-medium text-yellow-800 mb-1">Medical Disclaimer</h3>
              <p className="text-yellow-700">
                This AI assistant provides general medical information only and is not a substitute for
                professional medical advice, diagnosis, or treatment. Always seek the advice of your
                physician or other qualified health provider with any questions you have regarding a
                medical condition.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ChatbotService;
