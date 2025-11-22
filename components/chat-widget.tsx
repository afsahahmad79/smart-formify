"use client";

import { useState, useRef, useEffect } from "react";
import { useAction, useConvex } from "convex/react";
import { api } from "../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Bot } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Memory optimization: limit message history
  const maxMessages = 100;

  const convex = useConvex();
  const sendMessage = useAction(api.chat.sendMessage);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages((prev) => {
      const newMessages = [...prev, userMessage];
      // Memory optimization: keep only the last maxMessages
      return newMessages.length > maxMessages ? newMessages.slice(-maxMessages) : newMessages;
    });
    setInput("");
    setIsLoading(true);

    try {
       const response = await sendMessage({ message: input });

       // Validate response to prevent memory issues
       if (!response || !response.response) {
         throw new Error("Invalid response from AI service");
       }

       const assistantMessage: Message = {
         id: (Date.now() + 1).toString(),
         role: "assistant",
         content: response.response,
       };
       setMessages((prev) => {
         const newMessages = [...prev, assistantMessage];
         // Memory optimization: keep only the last maxMessages
         return newMessages.length > maxMessages ? newMessages.slice(-maxMessages) : newMessages;
       });
     } catch (error) {
       console.error("Chat error:", error);

       let errorContent = "Sorry, I encountered an error. Please try again.";

       // Provide specific error messages based on error type
       const errorMsg = error instanceof Error ? error.message : String(error);
       if (errorMsg.includes("GEMINI_API_KEY")) {
         errorContent = "AI service is not configured. Please set up the GEMINI_API_KEY environment variable.";
       } else if (errorMsg.includes("404") || errorMsg.includes("not found")) {
         errorContent = "AI model is currently unavailable. Please try again later.";
       } else if (errorMsg.includes("network") || errorMsg.includes("fetch")) {
         errorContent = "Network error. Please check your connection and try again.";
       }

       const errorMessageObj: Message = {
         id: (Date.now() + 1).toString(),
         role: "assistant",
         content: errorContent,
       };
       setMessages((prev) => [...prev, errorMessageObj]);
     } finally {
       setIsLoading(false);
     }
  };

  return (
    <>
      <Button
        size="icon"
        className="fixed bottom-4 right-4 z-50 rounded-full h-12 w-12 shadow-lg bg-green-600 hover:bg-green-700"
        onClick={() => setIsOpen(true)}
      >
        <Bot className="h-5 w-5" />
      </Button>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild />
        <SheetContent side="right" className="w-[400px] p-0 flex flex-col h-screen">
          <SheetHeader className="p-4 border-b bg-gray-50">
            <SheetTitle className="text-lg font-semibold">AI Assistant</SheetTitle>
            <SheetDescription className="text-sm text-gray-600">How can I help you?</SheetDescription>
          </SheetHeader>
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            {messages.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Start a conversation!</p>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end mb-4" : "justify-start mb-4"}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      msg.role === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-900"
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {msg.role === "assistant" && (
                        <Avatar className="h-6 w-6">
                          <AvatarFallback>AI</AvatarFallback>
                        </Avatar>
                      )}
                      <p className="text-sm">{msg.content}</p>
                      {msg.role === "user" && (
                        <Avatar className="h-6 w-6 ml-2">
                          <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="bg-gray-200 p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                    <p className="text-sm">Typing...</p>
                  </div>
                </div>
              </div>
            )}
          </ScrollArea>
          <div className="p-4 border-t flex space-x-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type your message..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button onClick={handleSend} disabled={!input.trim() || isLoading} size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}