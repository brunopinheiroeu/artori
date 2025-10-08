import StudentLayout from "@/components/StudentLayout";
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
  Star,
  Calendar,
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

const StudentMessages = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >("1");
  const [newMessage, setNewMessage] = useState("");

  // Mock conversations data - in a real app, this would come from an API
  const conversations = [
    {
      id: "1",
      tutorName: "Dr. Sarah Johnson",
      tutorAvatar: "/placeholder.svg",
      lastMessage:
        "Great progress on the calculus problems! Let's focus on integration techniques in our next session.",
      lastMessageTime: new Date(),
      unreadCount: 0,
      isOnline: true,
      subject: "Mathematics",
      rating: 4.9,
      hourlyRate: 45,
    },
    {
      id: "2",
      tutorName: "Prof. Michael Chen",
      tutorAvatar: "/placeholder.svg",
      lastMessage: "Can we reschedule tomorrow's physics session to 4 PM?",
      lastMessageTime: subHours(new Date(), 2), // 2 hours ago
      unreadCount: 1,
      isOnline: false,
      subject: "Physics",
      rating: 4.8,
      hourlyRate: 50,
    },
    {
      id: "3",
      tutorName: "Ms. Emily Rodriguez",
      tutorAvatar: "/placeholder.svg",
      lastMessage:
        "I've prepared some extra practice problems for organic chemistry. Check your email!",
      lastMessageTime: subDays(new Date(), 1),
      unreadCount: 2,
      isOnline: true,
      subject: "Chemistry",
      rating: 4.7,
      hourlyRate: 55,
    },
    {
      id: "4",
      tutorName: "Dr. James Wilson",
      tutorAvatar: "/placeholder.svg",
      lastMessage:
        "The cell biology diagrams you requested are attached. Review them before our session.",
      lastMessageTime: subDays(new Date(), 2),
      unreadCount: 0,
      isOnline: false,
      subject: "Biology",
      rating: 4.6,
      hourlyRate: 45,
    },
    {
      id: "5",
      tutorName: "Prof. Lisa Thompson",
      tutorAvatar: "/placeholder.svg",
      lastMessage:
        "Your essay analysis was excellent! You're really improving your critical thinking skills.",
      lastMessageTime: subDays(new Date(), 3),
      unreadCount: 0,
      isOnline: true,
      subject: "English Literature",
      rating: 4.9,
      hourlyRate: 55,
    },
  ];

  // Mock messages for selected conversation
  const messages = [
    {
      id: "1",
      senderId: "student",
      senderName: "You",
      content:
        "Hi Dr. Johnson! I'm struggling with the integration by parts problems from chapter 7.",
      timestamp: subHours(new Date(), 3), // 3 hours ago
      status: "read",
    },
    {
      id: "2",
      senderId: "tutor",
      senderName: "Dr. Sarah Johnson",
      content:
        "Hi! I'd be happy to help you with integration by parts. Which specific problems are giving you trouble?",
      timestamp: subMinutes(new Date(), 150), // 2.5 hours ago
      status: "read",
    },
    {
      id: "3",
      senderId: "student",
      senderName: "You",
      content:
        "Problems 15-18 are really confusing me. I don't know how to choose u and dv correctly.",
      timestamp: subHours(new Date(), 2), // 2 hours ago
      status: "read",
    },
    {
      id: "4",
      senderId: "tutor",
      senderName: "Dr. Sarah Johnson",
      content:
        "Great question! Remember the LIATE rule: Logarithmic, Inverse trig, Algebraic, Trigonometric, Exponential. Choose u in that order of preference. For problem 15: ∫x·ln(x)dx, we'd choose u = ln(x) and dv = x dx. Does that help?",
      timestamp: subMinutes(new Date(), 90), // 1.5 hours ago
      status: "read",
    },
    {
      id: "5",
      senderId: "student",
      senderName: "You",
      content:
        "Oh wow, that makes so much more sense! So for ∫x²·e^x dx, I should choose u = x² and dv = e^x dx?",
      timestamp: subHours(new Date(), 1), // 1 hour ago
      status: "read",
    },
    {
      id: "6",
      senderId: "tutor",
      senderName: "Dr. Sarah Johnson",
      content:
        "Exactly! You've got it. You'll need to apply integration by parts twice for that one since u = x² will give you du = 2x dx. Keep practicing and you'll master this technique! 🎉",
      timestamp: subMinutes(new Date(), 30), // 30 minutes ago
      status: "read",
    },
    {
      id: "7",
      senderId: "student",
      senderName: "You",
      content:
        "Thank you so much! This really helps. I'll work through the rest of the problems and let you know if I get stuck.",
      timestamp: new Date(),
      status: "delivered",
    },
  ];

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.tutorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
    <StudentLayout
      title="Messages"
      description="Chat with your tutors and get help with your studies."
    >
      <div className="h-[calc(100vh-200px)] flex gap-6">
        {/* Conversations List */}
        <Card className="w-1/3 backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5" />
                <span>Messages</span>
              </CardTitle>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-indigo-500 to-purple-600"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Find a Tutor</DialogTitle>
                    <DialogDescription>
                      Search for tutors to start a conversation.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="p-4 text-center text-gray-600">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p>Tutor search and messaging form would go here.</p>
                    <p className="text-sm mt-2">
                      This would connect to the Find Tutors page functionality.
                    </p>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search conversations..."
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
                        ? "bg-indigo-100 border border-indigo-200"
                        : "hover:bg-white/40"
                    }`}
                    onClick={() => setSelectedConversation(conversation.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={conversation.tutorAvatar}
                            alt={conversation.tutorName}
                          />
                          <AvatarFallback className="bg-indigo-100 text-indigo-600">
                            {conversation.tutorName
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
                            {conversation.tutorName}
                          </h4>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500">
                              {formatMessageTime(conversation.lastMessageTime)}
                            </span>
                            {conversation.unreadCount > 0 && (
                              <Badge className="bg-indigo-500 text-white text-xs min-w-[20px] h-5 flex items-center justify-center">
                                {conversation.unreadCount}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 truncate mt-1">
                          {conversation.lastMessage}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <Badge variant="outline" className="text-xs">
                            {conversation.subject}
                          </Badge>
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 text-yellow-500 fill-current" />
                            <span className="text-xs text-gray-600">
                              {conversation.rating}
                            </span>
                          </div>
                        </div>
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
                          src={selectedConv.tutorAvatar}
                          alt={selectedConv.tutorName}
                        />
                        <AvatarFallback className="bg-indigo-100 text-indigo-600">
                          {selectedConv.tutorName
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
                        {selectedConv.tutorName}
                      </h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span>
                          {selectedConv.isOnline
                            ? "Online"
                            : "Last seen recently"}
                        </span>
                        <span>•</span>
                        <span>{selectedConv.subject}</span>
                        <span>•</span>
                        <span>${selectedConv.hourlyRate}/hr</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Calendar className="h-4 w-4" />
                    </Button>
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
                          message.senderId === "student"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[70%] p-3 rounded-lg ${
                            message.senderId === "student"
                              ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                              : "bg-white border border-gray-200"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <div
                            className={`flex items-center justify-end space-x-1 mt-2 ${
                              message.senderId === "student"
                                ? "text-indigo-100"
                                : "text-gray-500"
                            }`}
                          >
                            <span className="text-xs">
                              {format(message.timestamp, "HH:mm")}
                            </span>
                            {message.senderId === "student" &&
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
                      placeholder="Type your message..."
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
                    className="bg-gradient-to-r from-indigo-500 to-purple-600"
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
                  No conversation selected
                </h3>
                <p>Choose a conversation from the list to start messaging.</p>
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
            <div className="text-sm text-gray-600">Active Tutors</div>
          </CardContent>
        </Card>
        <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
          <CardContent className="p-4 text-center">
            <Badge className="h-8 w-8 text-indigo-600 mx-auto mb-2 bg-indigo-100 flex items-center justify-center">
              {conversations.reduce((sum, c) => sum + c.unreadCount, 0)}
            </Badge>
            <div className="text-2xl font-bold text-indigo-600">
              {conversations.reduce((sum, c) => sum + c.unreadCount, 0)}
            </div>
            <div className="text-sm text-gray-600">Unread Messages</div>
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
            <div className="text-sm text-gray-600">Tutors Online</div>
          </CardContent>
        </Card>
        <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
          <CardContent className="p-4 text-center">
            <Star className="h-8 w-8 text-yellow-600 mx-auto mb-2 fill-current" />
            <div className="text-2xl font-bold text-yellow-600">
              {(
                conversations.reduce((sum, c) => sum + c.rating, 0) /
                conversations.length
              ).toFixed(1)}
            </div>
            <div className="text-sm text-gray-600">Avg Rating</div>
          </CardContent>
        </Card>
      </div>
    </StudentLayout>
  );
};

export default StudentMessages;
