import StudentLayout from "@/components/StudentLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Calendar,
  Clock,
  Plus,
  BookOpen,
  Video,
  MapPin,
  ChevronLeft,
  ChevronRight,
  User,
  Bell,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";
import { format, addDays, startOfWeek, isSameDay, isToday } from "date-fns";

const StudentSchedule = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Mock schedule data - in a real app, this would come from an API
  const sessions = [
    {
      id: "1",
      tutorName: "Dr. Sarah Johnson",
      tutorAvatar: "/placeholder.svg",
      subject: "Mathematics",
      topic: "Calculus Review",
      date: new Date(),
      startTime: "10:00",
      endTime: "11:00",
      duration: "1 hour",
      type: "online",
      status: "confirmed",
      location: "Zoom Meeting",
      notes: "Bring calculus textbook and practice problems",
      price: 45,
      tutorRating: 4.9,
    },
    {
      id: "2",
      tutorName: "Prof. Michael Chen",
      tutorAvatar: "/placeholder.svg",
      subject: "Physics",
      topic: "Quantum Mechanics",
      date: new Date(),
      startTime: "15:30",
      endTime: "16:30",
      duration: "1 hour",
      type: "online",
      status: "confirmed",
      location: "Google Meet",
      notes: "Focus on wave-particle duality concepts",
      price: 50,
      tutorRating: 4.8,
    },
    {
      id: "3",
      tutorName: "Ms. Emily Rodriguez",
      tutorAvatar: "/placeholder.svg",
      subject: "Chemistry",
      topic: "Organic Chemistry",
      date: addDays(new Date(), 1),
      startTime: "14:00",
      endTime: "15:30",
      duration: "1.5 hours",
      type: "in-person",
      status: "pending",
      location: "University Library, Room 204",
      notes: "Exam preparation session",
      price: 60,
      tutorRating: 4.7,
    },
    {
      id: "4",
      tutorName: "Dr. James Wilson",
      tutorAvatar: "/placeholder.svg",
      subject: "Biology",
      topic: "Cell Biology",
      date: addDays(new Date(), 2),
      startTime: "11:00",
      endTime: "12:00",
      duration: "1 hour",
      type: "online",
      status: "confirmed",
      location: "Zoom Meeting",
      notes: "Mitosis and meiosis deep dive",
      price: 45,
      tutorRating: 4.6,
    },
    {
      id: "5",
      tutorName: "Prof. Lisa Thompson",
      tutorAvatar: "/placeholder.svg",
      subject: "English Literature",
      topic: "Shakespeare Analysis",
      date: addDays(new Date(), 3),
      startTime: "16:00",
      endTime: "17:30",
      duration: "1.5 hours",
      type: "online",
      status: "confirmed",
      location: "Microsoft Teams",
      notes: "Hamlet character analysis",
      price: 55,
      tutorRating: 4.9,
    },
  ];

  // Mock study blocks (personal study time)
  const studyBlocks = [
    {
      id: "s1",
      subject: "Mathematics",
      topic: "Practice Problems",
      date: new Date(),
      startTime: "08:00",
      endTime: "09:30",
      duration: "1.5 hours",
      type: "self-study",
      status: "scheduled",
      location: "Home",
      notes: "Complete chapter 5 exercises",
    },
    {
      id: "s2",
      subject: "Physics",
      topic: "Formula Review",
      date: addDays(new Date(), 1),
      startTime: "09:00",
      endTime: "10:00",
      duration: "1 hour",
      type: "self-study",
      status: "scheduled",
      location: "Library",
      notes: "Review quantum mechanics formulas",
    },
    {
      id: "s3",
      subject: "Chemistry",
      topic: "Lab Report",
      date: addDays(new Date(), 2),
      startTime: "13:00",
      endTime: "15:00",
      duration: "2 hours",
      type: "self-study",
      status: "scheduled",
      location: "Home",
      notes: "Complete organic chemistry lab report",
    },
  ];

  // Get sessions for the selected date
  const selectedDateSessions = sessions
    .filter((session) => isSameDay(session.date, selectedDate))
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const selectedDateStudyBlocks = studyBlocks
    .filter((block) => isSameDay(block.date, selectedDate))
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  // Get upcoming sessions (next 7 days)
  const upcomingSessions = sessions
    .filter(
      (session) =>
        session.date >= new Date() && session.date <= addDays(new Date(), 7)
    )
    .sort(
      (a, b) =>
        a.date.getTime() - b.date.getTime() ||
        a.startTime.localeCompare(b.startTime)
    );

  // Generate week days for calendar view
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday start
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getSessionsForDate = (date: Date) => {
    return sessions.filter((session) => isSameDay(session.date, date));
  };

  const getStudyBlocksForDate = (date: Date) => {
    return studyBlocks.filter((block) => isSameDay(block.date, date));
  };

  const SessionCard = ({ session }: { session: (typeof sessions)[0] }) => (
    <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl mb-3">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={session.tutorAvatar} alt={session.tutorName} />
              <AvatarFallback className="bg-blue-100 text-blue-600">
                {session.tutorName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-semibold text-gray-900">
                {session.tutorName}
              </h4>
              <p className="text-sm text-gray-600">
                {session.subject} • {session.topic}
              </p>
              <div className="flex items-center space-x-2 mt-1">
                <Clock className="h-3 w-3 text-gray-500" />
                <span className="text-xs text-gray-600">
                  {session.startTime} - {session.endTime}
                </span>
                <Badge variant="outline" className="text-xs">
                  {session.duration}
                </Badge>
              </div>
            </div>
          </div>
          <div className="text-right">
            <Badge
              variant={session.status === "confirmed" ? "default" : "secondary"}
              className={
                session.status === "confirmed"
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }
            >
              {session.status}
            </Badge>
            <div className="flex items-center space-x-1 mt-2">
              {session.type === "online" ? (
                <Video className="h-3 w-3 text-blue-500" />
              ) : (
                <MapPin className="h-3 w-3 text-indigo-500" />
              )}
              <span className="text-xs text-gray-600">{session.location}</span>
            </div>
            <div className="text-sm font-semibold text-indigo-600 mt-1">
              ${session.price}
            </div>
          </div>
        </div>
        {session.notes && (
          <p className="text-sm text-gray-600 mt-3 p-2 bg-gray-50 rounded">
            {session.notes}
          </p>
        )}
      </CardContent>
    </Card>
  );

  const StudyBlockCard = ({ block }: { block: (typeof studyBlocks)[0] }) => (
    <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl mb-3">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Self Study</h4>
              <p className="text-sm text-gray-600">
                {block.subject} • {block.topic}
              </p>
              <div className="flex items-center space-x-2 mt-1">
                <Clock className="h-3 w-3 text-gray-500" />
                <span className="text-xs text-gray-600">
                  {block.startTime} - {block.endTime}
                </span>
                <Badge variant="outline" className="text-xs">
                  {block.duration}
                </Badge>
              </div>
            </div>
          </div>
          <div className="text-right">
            <Badge className="bg-purple-100 text-purple-800">
              {block.status}
            </Badge>
            <div className="flex items-center space-x-1 mt-2">
              <MapPin className="h-3 w-3 text-purple-500" />
              <span className="text-xs text-gray-600">{block.location}</span>
            </div>
          </div>
        </div>
        {block.notes && (
          <p className="text-sm text-gray-600 mt-3 p-2 bg-gray-50 rounded">
            {block.notes}
          </p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <StudentLayout
      title="Schedule"
      description="Manage your tutoring sessions and study schedule."
    >
      <div className="space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
            <CardContent className="p-4 text-center">
              <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">
                {selectedDateSessions.length + selectedDateStudyBlocks.length}
              </div>
              <div className="text-sm text-gray-600">Today's Activities</div>
            </CardContent>
          </Card>
          <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
            <CardContent className="p-4 text-center">
              <User className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-indigo-600">
                {upcomingSessions.length}
              </div>
              <div className="text-sm text-gray-600">Tutor Sessions</div>
            </CardContent>
          </Card>
          <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
            <CardContent className="p-4 text-center">
              <BookOpen className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">
                {studyBlocks.length}
              </div>
              <div className="text-sm text-gray-600">Study Blocks</div>
            </CardContent>
          </Card>
          <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
            <CardContent className="p-4 text-center">
              <Clock className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-emerald-600">
                {sessions.reduce((total, s) => {
                  const duration = parseFloat(s.duration.split(" ")[0]);
                  return total + duration;
                }, 0)}
                h
              </div>
              <div className="text-sm text-gray-600">This Week</div>
            </CardContent>
          </Card>
        </div>

        {/* Schedule Tabs */}
        <Tabs defaultValue="week" className="w-full">
          <div className="flex items-center justify-between mb-4">
            <TabsList className="backdrop-blur-sm bg-white/60 border-white/20">
              <TabsTrigger value="week">Week View</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="day">Day View</TabsTrigger>
            </TabsList>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-indigo-500 to-purple-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Activity
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Activity</DialogTitle>
                  <DialogDescription>
                    Schedule a new study session or book a tutor.
                  </DialogDescription>
                </DialogHeader>
                <div className="p-4 text-center text-gray-600">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>Activity scheduling form would go here.</p>
                  <p className="text-sm mt-2">
                    This would include activity type selection, date/time
                    picker, subject, and session details.
                  </p>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <TabsContent value="week">
            <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5" />
                    <span>Week of {format(weekStart, "MMM d, yyyy")}</span>
                  </CardTitle>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentDate(addDays(currentDate, -7))}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentDate(addDays(currentDate, 7))}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2">
                  {weekDays.map((day, index) => {
                    const daySessions = getSessionsForDate(day);
                    const dayStudyBlocks = getStudyBlocksForDate(day);
                    const totalActivities =
                      daySessions.length + dayStudyBlocks.length;

                    return (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          isToday(day)
                            ? "bg-indigo-100 border-indigo-300"
                            : "bg-white/40 border-white/20 hover:bg-white/60"
                        }`}
                        onClick={() => setSelectedDate(day)}
                      >
                        <div className="text-center">
                          <div className="text-xs text-gray-600 mb-1">
                            {format(day, "EEE")}
                          </div>
                          <div
                            className={`text-lg font-semibold ${
                              isToday(day) ? "text-indigo-700" : "text-gray-900"
                            }`}
                          >
                            {format(day, "d")}
                          </div>
                          {totalActivities > 0 && (
                            <div className="mt-2 space-y-1">
                              {daySessions.slice(0, 1).map((session, idx) => (
                                <div
                                  key={idx}
                                  className="text-xs p-1 bg-blue-200 text-blue-800 rounded truncate"
                                >
                                  {session.startTime} Tutor
                                </div>
                              ))}
                              {dayStudyBlocks.slice(0, 1).map((block, idx) => (
                                <div
                                  key={idx}
                                  className="text-xs p-1 bg-purple-200 text-purple-800 rounded truncate"
                                >
                                  {block.startTime} Study
                                </div>
                              ))}
                              {totalActivities > 2 && (
                                <div className="text-xs text-gray-600">
                                  +{totalActivities - 2} more
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="upcoming">
            <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Upcoming Activities</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {upcomingSessions.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingSessions.map((session) => (
                      <div key={session.id}>
                        <div className="text-sm font-medium text-gray-700 mb-2">
                          {format(session.date, "EEEE, MMMM d")}
                        </div>
                        <SessionCard session={session} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No upcoming sessions
                    </h3>
                    <p className="text-gray-600">
                      Book your first tutoring session to get started.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="day">
            <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5" />
                    <span>{format(selectedDate, "EEEE, MMMM d, yyyy")}</span>
                  </CardTitle>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedDate(addDays(selectedDate, -1))}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedDate(addDays(selectedDate, 1))}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {selectedDateSessions.length > 0 ||
                selectedDateStudyBlocks.length > 0 ? (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">
                        Tutor Sessions
                      </h4>
                      {selectedDateSessions.length > 0 ? (
                        selectedDateSessions.map((session) => (
                          <SessionCard key={session.id} session={session} />
                        ))
                      ) : (
                        <p className="text-gray-600 text-sm">
                          No tutor sessions scheduled
                        </p>
                      )}
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">
                        Study Blocks
                      </h4>
                      {selectedDateStudyBlocks.length > 0 ? (
                        selectedDateStudyBlocks.map((block) => (
                          <StudyBlockCard key={block.id} block={block} />
                        ))
                      ) : (
                        <p className="text-gray-600 text-sm">
                          No study blocks scheduled
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No activities scheduled
                    </h3>
                    <p className="text-gray-600">
                      No activities are scheduled for this day.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </StudentLayout>
  );
};

export default StudentSchedule;
