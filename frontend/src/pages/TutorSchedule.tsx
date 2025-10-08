import TutorLayout from "@/components/TutorLayout";
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
  Users,
  BookOpen,
  MapPin,
  Video,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { format, addDays, startOfWeek, isSameDay, isToday } from "date-fns";

const TutorSchedule = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Mock schedule data - in a real app, this would come from an API
  const sessions = [
    {
      id: "1",
      studentName: "Alice Johnson",
      studentAvatar: "/placeholder.svg",
      subject: "Mathematics",
      date: new Date(),
      startTime: "09:00",
      endTime: "10:00",
      duration: "1 hour",
      type: "online",
      status: "confirmed",
      location: "Zoom Meeting",
      notes: "Algebra review session",
    },
    {
      id: "2",
      studentName: "Bob Smith",
      studentAvatar: "/placeholder.svg",
      subject: "Physics",
      date: new Date(),
      startTime: "14:30",
      endTime: "15:15",
      duration: "45 minutes",
      type: "online",
      status: "confirmed",
      location: "Google Meet",
      notes: "Mechanics problems",
    },
    {
      id: "3",
      studentName: "Carol Davis",
      studentAvatar: "/placeholder.svg",
      subject: "Chemistry",
      date: addDays(new Date(), 1),
      startTime: "15:00",
      endTime: "16:30",
      duration: "1.5 hours",
      type: "in-person",
      status: "pending",
      location: "Library Room 204",
      notes: "Organic chemistry exam prep",
    },
    {
      id: "4",
      studentName: "David Wilson",
      studentAvatar: "/placeholder.svg",
      subject: "Mathematics",
      date: addDays(new Date(), 2),
      startTime: "10:00",
      endTime: "11:00",
      duration: "1 hour",
      type: "online",
      status: "confirmed",
      location: "Zoom Meeting",
      notes: "Geometry fundamentals",
    },
    {
      id: "5",
      studentName: "Emma Brown",
      studentAvatar: "/placeholder.svg",
      subject: "English",
      date: addDays(new Date(), 3),
      startTime: "16:00",
      endTime: "17:00",
      duration: "1 hour",
      type: "online",
      status: "confirmed",
      location: "Microsoft Teams",
      notes: "Essay writing techniques",
    },
  ];

  // Get sessions for the selected date
  const selectedDateSessions = sessions
    .filter((session) => isSameDay(session.date, selectedDate))
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

  const SessionCard = ({ session }: { session: (typeof sessions)[0] }) => (
    <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl mb-3">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
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
              <h4 className="font-semibold text-gray-900">
                {session.studentName}
              </h4>
              <p className="text-sm text-gray-600">{session.subject}</p>
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
                <MapPin className="h-3 w-3 text-emerald-500" />
              )}
              <span className="text-xs text-gray-600">{session.location}</span>
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

  return (
    <TutorLayout
      title="Schedule"
      description="Manage your tutoring sessions and availability."
    >
      <div className="space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
            <CardContent className="p-4 text-center">
              <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">
                {selectedDateSessions.length}
              </div>
              <div className="text-sm text-gray-600">Today's Sessions</div>
            </CardContent>
          </Card>
          <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
            <CardContent className="p-4 text-center">
              <Clock className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-emerald-600">
                {upcomingSessions.length}
              </div>
              <div className="text-sm text-gray-600">This Week</div>
            </CardContent>
          </Card>
          <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
            <CardContent className="p-4 text-center">
              <Video className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">
                {sessions.filter((s) => s.type === "online").length}
              </div>
              <div className="text-sm text-gray-600">Online Sessions</div>
            </CardContent>
          </Card>
          <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
            <CardContent className="p-4 text-center">
              <MapPin className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-600">
                {sessions.filter((s) => s.type === "in-person").length}
              </div>
              <div className="text-sm text-gray-600">In-Person</div>
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
                <Button className="bg-gradient-to-r from-emerald-500 to-teal-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule Session
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Schedule New Session</DialogTitle>
                  <DialogDescription>
                    Create a new tutoring session with a student.
                  </DialogDescription>
                </DialogHeader>
                <div className="p-4 text-center text-gray-600">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>Session scheduling form would go here.</p>
                  <p className="text-sm mt-2">
                    This would include student selection, date/time picker,
                    subject, and session details.
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
                    return (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          isToday(day)
                            ? "bg-emerald-100 border-emerald-300"
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
                              isToday(day)
                                ? "text-emerald-700"
                                : "text-gray-900"
                            }`}
                          >
                            {format(day, "d")}
                          </div>
                          {daySessions.length > 0 && (
                            <div className="mt-2 space-y-1">
                              {daySessions.slice(0, 2).map((session, idx) => (
                                <div
                                  key={idx}
                                  className="text-xs p-1 bg-emerald-200 text-emerald-800 rounded truncate"
                                >
                                  {session.startTime} {session.studentName}
                                </div>
                              ))}
                              {daySessions.length > 2 && (
                                <div className="text-xs text-gray-600">
                                  +{daySessions.length - 2} more
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
                  <span>Upcoming Sessions</span>
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
                      Schedule your first session to get started.
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
                {selectedDateSessions.length > 0 ? (
                  <div className="space-y-4">
                    {selectedDateSessions.map((session) => (
                      <SessionCard key={session.id} session={session} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No sessions scheduled
                    </h3>
                    <p className="text-gray-600">
                      No sessions are scheduled for this day.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </TutorLayout>
  );
};

export default TutorSchedule;
