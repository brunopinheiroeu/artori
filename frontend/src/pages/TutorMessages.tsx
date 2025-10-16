import { useTranslation } from "react-i18next";
import TutorLayout from "@/components/TutorLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  MessageSquare,
  Search,
  Send,
  Plus,
  Clock,
  CheckCheck,
  Check,
  Paperclip,
  Phone,
  Video,
  MoreVertical,
} from "lucide-react";
import { useState } from "react";
import {
  format,
  isToday,
  isYesterday,
  subDays,
  subHours,
  subMinutes,
} from "date-fns";

const TutorMessages = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >("1");
  const [newMessage, setNewMessage] = useState("");

  // Mock conversations data - in a real app, this would come from an API
  const conversations = [
    {
      id: "1",
      studentName: "Alice Johnson",
      studentAvatar: "/placeholder.svg",
      lastMessage:
        "Thank you for the great session today! I finally understand quadratic equations.",
      lastMessageTime: new Date(),
      unreadCount: 0,
      isOnline: true,
      subject: "Mathematics",
    },
    {
      id: "2",
      studentName: "Bob Smith",
      studentAvatar: "/placeholder.svg",
      lastMessage: "Can we reschedule tomorrow's session to 3 PM instead?",
      lastMessageTime: subHours(new Date(), 2), // 2 hours ago
      unreadCount: 2,
      isOnline: false,
      subject: "Physics",
    },
    {
      id: "3",
      studentName: "Carol Davis",
      studentAvatar: "/placeholder.svg",
      lastMessage: "I've uploaded the chemistry homework you requested.",
      lastMessageTime: subDays(new Date(), 1),
      unreadCount: 1,
      isOnline: true,
      subject: "Chemistry",
    },
    {
      id: "4",
      studentName: "David Wilson",
      studentAvatar: "/placeholder.svg",
      lastMessage: "Thanks for the geometry help! See you next week.",
      lastMessageTime: subDays(new Date(), 2),
      unreadCount: 0,
      isOnline: false,
      subject: "Mathematics",
    },
    {
      id: "5",
      studentName: "Emma Brown",
      studentAvatar: "/placeholder.svg",
      lastMessage: "Could you send me the essay examples we discussed?",
      lastMessageTime: subDays(new Date(), 3),
      unreadCount: 3,
      isOnline: true,
      subject: "English",
    },
  ];

  // Mock messages for selected conversation
  const messages = [
    {
      id: "1",
      senderId: "student",
      senderName: "Alice Johnson",
      content: "Hi! I'm having trouble with the quadratic equations homework.",
      timestamp: subHours(new Date(), 3), // 3 hours ago
      status: "read",
    },
    {
      id: "2",
      senderId: "tutor",
      senderName: "You",
      content:
        "Hi Alice! I'd be happy to help. Which specific problems are you struggling with?",
      timestamp: subMinutes(new Date(), 150), // 2.5 hours ago
      status: "read",
    },
    {
      id: "3",
      senderId: "student",
      senderName: "Alice Johnson",
      content:
        "Problems 5-8 in chapter 3. I don't understand how to factor them.",
      timestamp: subHours(new Date(), 2), // 2 hours ago
      status: "read",
    },
    {
      id: "4",
      senderId: "tutor",
      senderName: "You",
      content:
        "Let's break it down step by step. For problem 5: x² + 5x + 6, we need to find two numbers that multiply to 6 and add to 5. Can you think of what those numbers might be?",
      timestamp: subMinutes(new Date(), 90), // 1.5 hours ago
      status: "read",
    },
    {
      id: "5",
      senderId: "student",
      senderName: "Alice Johnson",
      content: "Oh! Is it 2 and 3? Because 2 × 3 = 6 and 2 + 3 = 5?",
      timestamp: subHours(new Date(), 1), // 1 hour ago
      status: "read",
    },
    {
      id: "6",
      senderId: "tutor",
      senderName: "You",
      content:
        "Exactly! So the factored form would be (x + 2)(x + 3). Great job! 🎉",
      timestamp: subMinutes(new Date(), 30), // 30 minutes ago
      status: "read",
    },
    {
      id: "7",
      senderId: "student",
      senderName: "Alice Johnson",
      content:
        "Thank you for the great session today! I finally understand quadratic equations.",
      timestamp: new Date(),
      status: "delivered",
    },
  ];

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedConv = conversations.find((c) => c.id === selectedConversation);

  const formatMessageTime = (date: Date) => {
    if (isToday(date)) {
      return format(date, "HH:mm");
    } else if (isYesterday(date)) {
      return "Yesterday";
    } else {
      return format(date, "MMM d");
    }
  };

  const getMessageStatus = (status: string) => {
    switch (status) {
      case "sent":
        return <Check className="h-3 w-3 text-gray-400" />;
      case "delivered":
        return <CheckCheck className="h-3 w-3 text-gray-400" />;
      case "read":
        return <CheckCheck className="h-3 w-3 text-blue-500" />;
      default:
        return <Clock className="h-3 w-3 text-gray-400" />;
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // In a real app, this would send the message via API
      console.log("Sending message:", newMessage);
      setNewMessage("");
    }
  };

  return (
    <TutorLayout
      title={t("tutor:messages.title")}
      description={t("tutor:messages.description")}
    >
      <div className="h-[calc(100vh-200px)] flex gap-6">
        {/* Conversations List */}
        <Card className="w-1/3 backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5" />
                <span>{t("tutor:messages.title")}</span>
              </CardTitle>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-emerald-500 to-teal-600"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t("tutor:messages.newMessage")}</DialogTitle>
                    <DialogDescription>
                      {t("tutor:messages.startConversation")}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="p-4 text-center text-gray-600">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p>
                      Student selection and message composition form would go
                      here.
                    </p>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder={t("tutor:messages.searchConversations")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/40 border-white/20"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[500px]">
              <div className="space-y-1 p-3">
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedConversation === conversation.id
                        ? "bg-emerald-100 border border-emerald-200"
                        : "hover:bg-white/40"
                    }`}
                    onClick={() => setSelectedConversation(conversation.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={conversation.studentAvatar}
                            alt={conversation.studentName}
                          />
                          <AvatarFallback className="bg-emerald-100 text-emerald-600">
                            {conversation.studentName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        {conversation.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900 truncate">
                            {conversation.studentName}
                          </h4>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500">
                              {formatMessageTime(conversation.lastMessageTime)}
                            </span>
                            {conversation.unreadCount > 0 && (
                              <Badge className="bg-emerald-500 text-white text-xs min-w-[20px] h-5 flex items-center justify-center">
                                {conversation.unreadCount}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 truncate mt-1">
                          {conversation.lastMessage}
                        </p>
                        <Badge variant="outline" className="text-xs mt-1">
                          {conversation.subject}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="flex-1 backdrop-blur-sm bg-white/60 border-white/20 shadow-xl flex flex-col">
          {selectedConv ? (
            <>
              {/* Chat Header */}
              <CardHeader className="pb-3 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={selectedConv.studentAvatar}
                          alt={selectedConv.studentName}
                        />
                        <AvatarFallback className="bg-emerald-100 text-emerald-600">
                          {selectedConv.studentName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      {selectedConv.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {selectedConv.studentName}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {selectedConv.isOnline
                          ? t("tutor:messages.online")
                          : t("tutor:messages.lastSeenRecently")}{" "}
                        • {selectedConv.subject}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 p-0">
                <ScrollArea className="h-[400px] p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.senderId === "tutor"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[70%] p-3 rounded-lg ${
                            message.senderId === "tutor"
                              ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white"
                              : "bg-white border border-gray-200"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <div
                            className={`flex items-center justify-end space-x-1 mt-2 ${
                              message.senderId === "tutor"
                                ? "text-emerald-100"
                                : "text-gray-500"
                            }`}
                          >
                            <span className="text-xs">
                              {format(message.timestamp, "HH:mm")}
                            </span>
                            {message.senderId === "tutor" &&
                              getMessageStatus(message.status)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-end space-x-2">
                  <Button variant="outline" size="sm">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <div className="flex-1">
                    <Textarea
                      placeholder={t("tutor:messages.typeMessage")}
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="min-h-[40px] max-h-[120px] resize-none bg-white/40 border-white/20"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="bg-gradient-to-r from-emerald-500 to-teal-600"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <CardContent className="flex-1 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {t("tutor:messages.noConversations")}
                </h3>
                <p>{t("tutor:messages.startConversation")}</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
          <CardContent className="p-4 text-center">
            <MessageSquare className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">
              {conversations.length}
            </div>
            <div className="text-sm text-gray-600">
              {t("tutor:messages.totalConversations")}
            </div>
          </CardContent>
        </Card>
        <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
          <CardContent className="p-4 text-center">
            <Badge className="h-8 w-8 text-emerald-600 mx-auto mb-2 bg-emerald-100 flex items-center justify-center">
              {conversations.reduce((sum, c) => sum + c.unreadCount, 0)}
            </Badge>
            <div className="text-2xl font-bold text-emerald-600">
              {conversations.reduce((sum, c) => sum + c.unreadCount, 0)}
            </div>
            <div className="text-sm text-gray-600">
              {t("tutor:messages.unreadMessages")}
            </div>
          </CardContent>
        </Card>
        <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
          <CardContent className="p-4 text-center">
            <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <div className="h-3 w-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="text-2xl font-bold text-green-600">
              {conversations.filter((c) => c.isOnline).length}
            </div>
            <div className="text-sm text-gray-600">
              {t("tutor:messages.studentsOnline")}
            </div>
          </CardContent>
        </Card>
        <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-600">
              {conversations.filter((c) => isToday(c.lastMessageTime)).length}
            </div>
            <div className="text-sm text-gray-600">
              {t("tutor:messages.messagesToday")}
            </div>
          </CardContent>
        </Card>
      </div>
    </TutorLayout>
  );
};

export default TutorMessages;
