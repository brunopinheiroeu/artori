import TutorLayout from "@/components/TutorLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  BookOpen,
  Search,
  MoreVertical,
  Clock,
  Calendar,
  Star,
  Video,
  MapPin,
  FileText,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";
import { format, subDays, addDays } from "date-fns";

const TutorSessions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSession, setSelectedSession] = useState<
    (typeof sessions)[0] | null
  >(null);

  // Mock session data - in a real app, this would come from an API
  const sessions = [
    {
      id: "1",
      studentName: "Alice Johnson",
      studentAvatar: "/placeholder.svg",
      subject: "Mathematics",
      topic: "Quadratic Equations",
      date: new Date(),
      startTime: "09:00",
      endTime: "10:00",
      duration: "1 hour",
      type: "online",
      status: "completed",
      location: "Zoom Meeting",
      rating: 5,
      feedback: "Excellent session! Alice understood the concepts very well.",
      notes:
        "Covered quadratic formula and factoring methods. Student showed good progress.",
      materials: ["Quadratic_Equations_Worksheet.pdf", "Practice_Problems.pdf"],
      earnings: 45,
    },
    {
      id: "2",
      studentName: "Bob Smith",
      studentAvatar: "/placeholder.svg",
      subject: "Physics",
      topic: "Newton's Laws",
      date: subDays(new Date(), 1),
      startTime: "14:30",
      endTime: "15:15",
      duration: "45 minutes",
      type: "online",
      status: "completed",
      location: "Google Meet",
      rating: 4,
      feedback: "Good session, but need more practice with problem-solving.",
      notes:
        "Reviewed all three laws with examples. Student needs more practice problems.",
      materials: ["Newtons_Laws_Notes.pdf"],
      earnings: 35,
    },
    {
      id: "3",
      studentName: "Carol Davis",
      studentAvatar: "/placeholder.svg",
      subject: "Chemistry",
      topic: "Organic Reactions",
      date: addDays(new Date(), 1),
      startTime: "15:00",
      endTime: "16:30",
      duration: "1.5 hours",
      type: "in-person",
      status: "scheduled",
      location: "Library Room 204",
      rating: null,
      feedback: null,
      notes: "Exam preparation session for organic chemistry midterm.",
      materials: [],
      earnings: 65,
    },
    {
      id: "4",
      studentName: "David Wilson",
      studentAvatar: "/placeholder.svg",
      subject: "Mathematics",
      topic: "Geometry Proofs",
      date: subDays(new Date(), 3),
      startTime: "10:00",
      endTime: "11:00",
      duration: "1 hour",
      type: "online",
      status: "cancelled",
      location: "Zoom Meeting",
      rating: null,
      feedback: null,
      notes: "Student cancelled due to illness.",
      materials: [],
      earnings: 0,
    },
    {
      id: "5",
      studentName: "Emma Brown",
      studentAvatar: "/placeholder.svg",
      subject: "English",
      topic: "Essay Writing",
      date: subDays(new Date(), 2),
      startTime: "16:00",
      endTime: "17:00",
      duration: "1 hour",
      type: "online",
      status: "completed",
      location: "Microsoft Teams",
      rating: 5,
      feedback: "Amazing help with essay structure and argumentation!",
      notes:
        "Worked on thesis development and paragraph structure. Great improvement shown.",
      materials: ["Essay_Structure_Guide.pdf", "Sample_Essays.pdf"],
      earnings: 50,
    },
    {
      id: "6",
      studentName: "Frank Miller",
      studentAvatar: "/placeholder.svg",
      subject: "Biology",
      topic: "Cell Division",
      date: new Date(),
      startTime: "11:00",
      endTime: "12:00",
      duration: "1 hour",
      type: "online",
      status: "in-progress",
      location: "Zoom Meeting",
      rating: null,
      feedback: null,
      notes: "Currently discussing mitosis and meiosis processes.",
      materials: ["Cell_Division_Diagrams.pdf"],
      earnings: 45,
    },
  ];

  const filteredSessions = sessions.filter(
    (session) =>
      session.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.topic.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const completedSessions = filteredSessions.filter(
    (s) => s.status === "completed"
  );
  const scheduledSessions = filteredSessions.filter(
    (s) => s.status === "scheduled"
  );
  const cancelledSessions = filteredSessions.filter(
    (s) => s.status === "cancelled"
  );
  const inProgressSessions = filteredSessions.filter(
    (s) => s.status === "in-progress"
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "scheduled":
        return <Clock className="h-4 w-4 text-blue-600" />;
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "in-progress":
        return <AlertCircle className="h-4 w-4 text-orange-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "in-progress":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const SessionCard = ({ session }: { session: (typeof sessions)[0] }) => (
    <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={session.studentAvatar}
                alt={session.studentName}
              />
              <AvatarFallback className="bg-emerald-100 text-emerald-600">
                {session.studentName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-gray-900">
                {session.studentName}
              </h3>
              <p className="text-sm text-gray-600">
                {session.subject} • {session.topic}
              </p>
              <div className="flex items-center space-x-2 mt-1">
                <Calendar className="h-3 w-3 text-gray-500" />
                <span className="text-xs text-gray-600">
                  {format(session.date, "MMM d, yyyy")} • {session.startTime} -{" "}
                  {session.endTime}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={getStatusColor(session.status)}>
              {getStatusIcon(session.status)}
              <span className="ml-1">{session.status}</span>
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSelectedSession(session)}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                {session.materials.length > 0 && (
                  <DropdownMenuItem>
                    <Download className="h-4 w-4 mr-2" />
                    Download Materials
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem>
                  <FileText className="h-4 w-4 mr-2" />
                  Session Report
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              {session.type === "online" ? (
                <Video className="h-4 w-4 text-blue-500" />
              ) : (
                <MapPin className="h-4 w-4 text-emerald-500" />
              )}
              <span className="text-gray-600">{session.location}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">{session.duration}</span>
            </div>
          </div>

          {session.rating && (
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < session.rating!
                        ? "text-yellow-500 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                ({session.rating}/5)
              </span>
            </div>
          )}

          {session.notes && (
            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
              {session.notes}
            </p>
          )}

          {session.materials.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                Materials:
              </p>
              <div className="flex flex-wrap gap-2">
                {session.materials.map((material, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    <FileText className="h-3 w-3 mr-1" />
                    {material}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-gray-200">
            <span className="text-sm text-gray-600">Earnings:</span>
            <span className="font-semibold text-emerald-600">
              ${session.earnings}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <TutorLayout
      title="Sessions"
      description="View and manage your tutoring sessions."
    >
      <div className="space-y-6">
        {/* Search and Stats */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search sessions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 backdrop-blur-sm bg-white/60 border-white/20"
            />
          </div>
          <div className="flex space-x-4 text-sm">
            <div className="text-center">
              <div className="font-semibold text-green-600">
                {completedSessions.length}
              </div>
              <div className="text-gray-600">Completed</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-blue-600">
                {scheduledSessions.length}
              </div>
              <div className="text-gray-600">Scheduled</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-orange-600">
                {inProgressSessions.length}
              </div>
              <div className="text-gray-600">In Progress</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-emerald-600">
                ${sessions.reduce((sum, s) => sum + s.earnings, 0)}
              </div>
              <div className="text-gray-600">Total Earnings</div>
            </div>
          </div>
        </div>

        {/* Sessions Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-5 backdrop-blur-sm bg-white/60 border-white/20">
            <TabsTrigger value="all">
              All ({filteredSessions.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({completedSessions.length})
            </TabsTrigger>
            <TabsTrigger value="scheduled">
              Scheduled ({scheduledSessions.length})
            </TabsTrigger>
            <TabsTrigger value="in-progress">
              In Progress ({inProgressSessions.length})
            </TabsTrigger>
            <TabsTrigger value="cancelled">
              Cancelled ({cancelledSessions.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredSessions.map((session) => (
                <SessionCard key={session.id} session={session} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="completed" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {completedSessions.map((session) => (
                <SessionCard key={session.id} session={session} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="scheduled" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {scheduledSessions.map((session) => (
                <SessionCard key={session.id} session={session} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="in-progress" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {inProgressSessions.map((session) => (
                <SessionCard key={session.id} session={session} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="cancelled" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {cancelledSessions.map((session) => (
                <SessionCard key={session.id} session={session} />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {filteredSessions.length === 0 && (
          <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
            <CardContent className="p-12 text-center">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No sessions found
              </h3>
              <p className="text-gray-600">
                {searchTerm
                  ? "Try adjusting your search terms."
                  : "You haven't conducted any sessions yet."}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Session Details Modal */}
        <Dialog
          open={!!selectedSession}
          onOpenChange={() => setSelectedSession(null)}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Session Details</DialogTitle>
              <DialogDescription>
                Detailed information about the tutoring session.
              </DialogDescription>
            </DialogHeader>
            {selectedSession && (
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={selectedSession.studentAvatar}
                      alt={selectedSession.studentName}
                    />
                    <AvatarFallback className="bg-emerald-100 text-emerald-600">
                      {selectedSession.studentName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">
                      {selectedSession.studentName}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {selectedSession.subject} • {selectedSession.topic}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Date:</span>
                    <span className="ml-2">
                      {format(selectedSession.date, "MMM d, yyyy")}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Time:</span>
                    <span className="ml-2">
                      {selectedSession.startTime} - {selectedSession.endTime}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Duration:</span>
                    <span className="ml-2">{selectedSession.duration}</span>
                  </div>
                  <div>
                    <span className="font-medium">Type:</span>
                    <span className="ml-2 capitalize">
                      {selectedSession.type}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Location:</span>
                    <span className="ml-2">{selectedSession.location}</span>
                  </div>
                  <div>
                    <span className="font-medium">Earnings:</span>
                    <span className="ml-2 text-emerald-600 font-semibold">
                      ${selectedSession.earnings}
                    </span>
                  </div>
                </div>

                {selectedSession.rating && (
                  <div>
                    <span className="font-medium text-sm">Rating:</span>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < selectedSession.rating!
                                ? "text-yellow-500 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        ({selectedSession.rating}/5)
                      </span>
                    </div>
                  </div>
                )}

                {selectedSession.feedback && (
                  <div>
                    <span className="font-medium text-sm">
                      Student Feedback:
                    </span>
                    <p className="text-sm text-gray-700 mt-1 p-3 bg-gray-50 rounded-lg">
                      {selectedSession.feedback}
                    </p>
                  </div>
                )}

                {selectedSession.notes && (
                  <div>
                    <span className="font-medium text-sm">Session Notes:</span>
                    <p className="text-sm text-gray-700 mt-1 p-3 bg-gray-50 rounded-lg">
                      {selectedSession.notes}
                    </p>
                  </div>
                )}

                {selectedSession.materials.length > 0 && (
                  <div>
                    <span className="font-medium text-sm">Materials:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedSession.materials.map((material, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
                          <FileText className="h-3 w-3 mr-1" />
                          {material}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </TutorLayout>
  );
};

export default TutorSessions;
