import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User } from "lucide-react";
import { useChatMessage } from "@/hooks/useApi";
import { toast } from "@/hooks/use-toast";
import type { ChatMessage } from "@/lib/api";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface AITutorChatProps {
  isOpen: boolean;
  onClose: () => void;
  question: {
    id: string;
    question: string;
    options: Array<{ id: string; text: string }>;
    correct_answer: string;
  };
  selectedAnswer: string | null;
}

export const AITutorChat = ({
  isOpen,
  onClose,
  question,
  selectedAnswer,
}: AITutorChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const chatMutation = useChatMessage();

  // Initialize chat with context when opened
  useEffect(() => {
    if (isOpen && !isInitialized) {
      initializeChat();
      setIsInitialized(true);
    }
  }, [isOpen, isInitialized]);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const initializeChat = async () => {
    // Add initial context message
    const selectedOption = question.options.find(
      (opt) => opt.id === selectedAnswer
    );
    const isCorrect = selectedAnswer === question.correct_answer;
    const correctOption = question.options.find(
      (opt) => opt.id === question.correct_answer
    );

    const contextMessage: Message = {
      id: Date.now().toString(),
      role: "assistant",
      content: `Hi! I'm your AI Tutor

I can see you just answered this question:
**"${question.question}"**

Your answer: **${selectedOption?.text || "No answer selected"}** ${
        isCorrect ? "✅" : "❌"
      }
${
  !isCorrect
    ? `Correct answer: **${correctOption?.text}**`
    : "Great job! You got it right!"
}

${
  isCorrect
    ? "Since you got this right, I can help explain why this answer is correct or dive deeper into the concept. What would you like to explore?"
    : "I can help you understand why this answer is correct and where you might have gone wrong. What specific part would you like me to explain?"
}

Feel free to ask me anything about this question!`,
      timestamp: new Date(),
    };

    setMessages([contextMessage]);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputMessage.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      // Convert messages to ChatMessage format for API
      const chatMessages: ChatMessage[] = messages.map((msg) => ({
        role: msg.role === "user" ? "user" : "assistant",
        content: msg.content,
      }));

      // Add the new user message to the conversation history
      chatMessages.push({
        role: "user",
        content: inputMessage.trim(),
      });

      const response = await chatMutation.mutateAsync({
        questionId: question.id,
        messages: chatMessages,
      });

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get response from AI Tutor. Please try again.",
        variant: "destructive",
      });

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "I'm sorry, I'm having trouble responding right now. Please try asking your question again.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClose = () => {
    setMessages([]);
    setInputMessage("");
    setIsInitialized(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl h-[600px] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Bot className="h-5 w-5 text-blue-600" />
            <span>AI Tutor Chat</span>
          </DialogTitle>
          <DialogDescription>
            Ask me anything about this question and I'll help you understand!
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 flex flex-col min-h-0">
          <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {message.role === "assistant" && (
                        <Bot className="h-4 w-4 mt-0.5 text-blue-600" />
                      )}
                      {message.role === "user" && (
                        <User className="h-4 w-4 mt-0.5 text-white" />
                      )}
                      <div className="flex-1">
                        <div className="whitespace-pre-wrap text-sm">
                          {message.content}
                        </div>
                        <div
                          className={`text-xs mt-1 ${
                            message.role === "user"
                              ? "text-blue-100"
                              : "text-gray-500"
                          }`}
                        >
                          {message.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                    <div className="flex items-center space-x-2">
                      <Bot className="h-4 w-4 text-blue-600" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="flex items-center space-x-2 pt-4 border-t">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about this question..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
