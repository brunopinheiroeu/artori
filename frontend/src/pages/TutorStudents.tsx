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
  Users,
  Search,
  MoreVertical,
  MessageSquare,
  Calendar,
  BookOpen,
  TrendingUp,
  Clock,
  Star,
  Mail,
  Phone,
} from "lucide-react";
import { useState } from "react";

const TutorStudents = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock student data - in a real app, this would come from an API
  const students = [
    {
      id: "1",
      name: "Alice Johnson",
      email: "alice.johnson@email.com",
      phone: "+1 (555) 123-4567",
      avatar: "/placeholder.svg",
      subjects: ["Mathematics", "Physics"],
      level: "High School",
      sessionsCompleted: 24,
      nextSession: "Tomorrow, 2:00 PM",
      progress: 85,
      rating: 4.8,
      status: "active",
      joinedDate: "2024-01-15",
      lastSession: "2024-03-10",
    },
    {
      id: "2",
      name: "Bob Smith",
      email: "bob.smith@email.com",
      phone: "+1 (555) 234-5678",
      avatar: "/placeholder.svg",
      subjects: ["Chemistry", "Biology"],
      level: "College",
      sessionsCompleted: 18,
      nextSession: "Friday, 4:30 PM",
      progress: 72,
      rating: 4.6,
      status: "active",
      joinedDate: "2024-02-01",
      lastSession: "2024-03-08",
    },
    {
      id: "3",
      name: "Carol Davis",
      email: "carol.davis@email.com",
      phone: "+1 (555) 345-6789",
      avatar: "/placeholder.svg",
      subjects: ["English Literature"],
      level: "High School",
      sessionsCompleted: 12,
      nextSession: "Next Monday, 3:00 PM",
      progress: 60,
      rating: 4.9,
      status: "active",
      joinedDate: "2024-02-20",
      lastSession: "2024-03-09",
    },
    {
      id: "4",
      name: "David Wilson",
      email: "david.wilson@email.com",
      phone: "+1 (555) 456-7890",
      avatar: "/placeholder.svg",
      subjects: ["Mathematics"],
      level: "Middle School",
      sessionsCompleted: 8,
      nextSession: "No upcoming sessions",
      progress: 45,
      rating: 4.3,
      status: "inactive",
      joinedDate: "2024-03-01",
      lastSession: "2024-03-05",
    },
  ];

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.subjects.some((subject) =>
        subject.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const activeStudents = filteredStudents.filter((s) => s.status === "active");
  const inactiveStudents = filteredStudents.filter(
    (s) => s.status === "inactive"
  );

  const StudentCard = ({ student }: { student: (typeof students)[0] }) => (
    <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={student.avatar} alt={student.name} />
              <AvatarFallback className="bg-emerald-100 text-emerald-600">
                {student.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-gray-900">{student.name}</h3>
              <p className="text-sm text-gray-600">{student.level}</p>
              <div className="flex items-center space-x-1 mt-1">
                <Star className="h-3 w-3 text-yellow-500 fill-current" />
                <span className="text-xs text-gray-600">{student.rating}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge
              variant={student.status === "active" ? "default" : "secondary"}
              className={
                student.status === "active" ? "bg-green-100 text-green-800" : ""
              }
            >
              {student.status}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send Message
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Session
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <BookOpen className="h-4 w-4 mr-2" />
                  View Progress
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Subjects</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {student.subjects.map((subject, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {subject}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Progress</span>
              <span className="text-gray-900">{student.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-600 h-2 rounded-full"
                style={{ width: `${student.progress}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Sessions:</span>
              <span className="ml-1 font-medium">
                {student.sessionsCompleted}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Next:</span>
              <span className="ml-1 font-medium text-emerald-600">
                {student.nextSession}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Mail className="h-3 w-3" />
            <span>{student.email}</span>
          </div>
        </div>

        <div className="flex space-x-2 mt-4">
          <Button
            size="sm"
            className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600"
          >
            <MessageSquare className="h-3 w-3 mr-1" />
            Message
          </Button>
          <Button size="sm" variant="outline" className="flex-1">
            <Calendar className="h-3 w-3 mr-1" />
            Schedule
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <TutorLayout
      title="My Students"
      description="Manage your students and track their progress."
    >
      <div className="space-y-6">
        {/* Search and Stats */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search students or subjects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 backdrop-blur-sm bg-white/60 border-white/20"
            />
          </div>
          <div className="flex space-x-4 text-sm">
            <div className="text-center">
              <div className="font-semibold text-emerald-600">
                {activeStudents.length}
              </div>
              <div className="text-gray-600">Active</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-gray-600">
                {inactiveStudents.length}
              </div>
              <div className="text-gray-600">Inactive</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-blue-600">
                {students.reduce((sum, s) => sum + s.sessionsCompleted, 0)}
              </div>
              <div className="text-gray-600">Total Sessions</div>
            </div>
          </div>
        </div>

        {/* Students Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3 backdrop-blur-sm bg-white/60 border-white/20">
            <TabsTrigger value="all">
              All Students ({filteredStudents.length})
            </TabsTrigger>
            <TabsTrigger value="active">
              Active ({activeStudents.length})
            </TabsTrigger>
            <TabsTrigger value="inactive">
              Inactive ({inactiveStudents.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStudents.map((student) => (
                <StudentCard key={student.id} student={student} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="active" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeStudents.map((student) => (
                <StudentCard key={student.id} student={student} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="inactive" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {inactiveStudents.map((student) => (
                <StudentCard key={student.id} student={student} />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {filteredStudents.length === 0 && (
          <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
            <CardContent className="p-12 text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No students found
              </h3>
              <p className="text-gray-600">
                {searchTerm
                  ? "Try adjusting your search terms."
                  : "You haven't added any students yet."}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </TutorLayout>
  );
};

export default TutorStudents;
