import StudentLayout from "@/components/StudentLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Users,
  Search,
  Star,
  MapPin,
  Clock,
  DollarSign,
  MessageSquare,
  Calendar,
  BookOpen,
  Award,
  Video,
  User,
  Heart,
  Filter,
} from "lucide-react";
import { useState } from "react";

const StudentTutors = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedTutor, setSelectedTutor] = useState<(typeof tutors)[0] | null>(
    null
  );

  // Mock tutor data - in a real app, this would come from an API
  const tutors = [
    {
      id: "1",
      name: "Dr. Sarah Johnson",
      avatar: "/placeholder.svg",
      title: "Mathematics & Physics Expert",
      subjects: ["Mathematics", "Physics", "Calculus"],
      rating: 4.9,
      reviewCount: 127,
      hourlyRate: 45,
      location: "New York, NY",
      experience: "8 years",
      languages: ["English", "Spanish"],
      availability: "Available now",
      description:
        "Experienced mathematics professor with a passion for helping students excel in STEM subjects. Specializes in advanced calculus and physics.",
      education: "PhD in Mathematics, MIT",
      achievements: [
        "Top Rated Tutor",
        "500+ Students Taught",
        "98% Success Rate",
      ],
      sessionTypes: ["Online", "In-person"],
      responseTime: "< 1 hour",
      totalSessions: 1250,
      isOnline: true,
      isFavorite: false,
    },
    {
      id: "2",
      name: "Prof. Michael Chen",
      avatar: "/placeholder.svg",
      title: "Computer Science & Programming",
      subjects: ["Computer Science", "Python", "JavaScript", "Data Structures"],
      rating: 4.8,
      reviewCount: 89,
      hourlyRate: 50,
      location: "San Francisco, CA",
      experience: "6 years",
      languages: ["English", "Mandarin"],
      availability: "Available today",
      description:
        "Software engineer turned educator. Helps students master programming concepts and prepare for technical interviews.",
      education: "MS Computer Science, Stanford",
      achievements: ["Industry Expert", "300+ Students", "Google Certified"],
      sessionTypes: ["Online"],
      responseTime: "< 2 hours",
      totalSessions: 890,
      isOnline: true,
      isFavorite: true,
    },
    {
      id: "3",
      name: "Emma Rodriguez",
      avatar: "/placeholder.svg",
      title: "Chemistry & Biology Specialist",
      subjects: ["Chemistry", "Biology", "Organic Chemistry"],
      rating: 4.7,
      reviewCount: 156,
      hourlyRate: 40,
      location: "Austin, TX",
      experience: "5 years",
      languages: ["English", "Spanish"],
      availability: "Available tomorrow",
      description:
        "Passionate about making science accessible and fun. Specializes in helping students understand complex chemical processes.",
      education: "PhD in Chemistry, UT Austin",
      achievements: [
        "Science Communicator",
        "400+ Students",
        "Published Researcher",
      ],
      sessionTypes: ["Online", "In-person"],
      responseTime: "< 3 hours",
      totalSessions: 670,
      isOnline: false,
      isFavorite: false,
    },
    {
      id: "4",
      name: "James Wilson",
      avatar: "/placeholder.svg",
      title: "English & Literature Expert",
      subjects: ["English", "Literature", "Writing", "Essay Prep"],
      rating: 4.9,
      reviewCount: 203,
      hourlyRate: 35,
      location: "Boston, MA",
      experience: "10 years",
      languages: ["English"],
      availability: "Available now",
      description:
        "Former high school English teacher with extensive experience in test prep and college admissions essays.",
      education: "MA in English Literature, Harvard",
      achievements: ["Master Educator", "600+ Students", "College Prep Expert"],
      sessionTypes: ["Online", "In-person"],
      responseTime: "< 30 minutes",
      totalSessions: 1450,
      isOnline: true,
      isFavorite: false,
    },
    {
      id: "5",
      name: "Dr. Lisa Park",
      avatar: "/placeholder.svg",
      title: "SAT/ACT Test Prep Specialist",
      subjects: ["SAT Prep", "ACT Prep", "Test Strategy", "Mathematics"],
      rating: 5.0,
      reviewCount: 78,
      hourlyRate: 60,
      location: "Los Angeles, CA",
      experience: "12 years",
      languages: ["English", "Korean"],
      availability: "Available this week",
      description:
        "Test prep specialist with proven track record of helping students achieve their target scores. Average score improvement: 200+ points.",
      education: "EdD in Educational Psychology, UCLA",
      achievements: ["Test Prep Master", "200+ Students", "Score Guarantee"],
      sessionTypes: ["Online", "In-person"],
      responseTime: "< 4 hours",
      totalSessions: 980,
      isOnline: false,
      isFavorite: false,
    },
  ];

  const subjects = [
    "all",
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "Computer Science",
    "English",
    "SAT Prep",
    "ACT Prep",
  ];

  const filteredTutors = tutors.filter((tutor) => {
    const matchesSearch =
      tutor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tutor.subjects.some((subject) =>
        subject.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      tutor.title.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSubject =
      selectedSubject === "all" ||
      tutor.subjects.some((subject) =>
        subject.toLowerCase().includes(selectedSubject.toLowerCase())
      );

    return matchesSearch && matchesSubject;
  });

  const favoriteTutors = tutors.filter((tutor) => tutor.isFavorite);
  const onlineTutors = filteredTutors.filter((tutor) => tutor.isOnline);

  const TutorCard = ({ tutor }: { tutor: (typeof tutors)[0] }) => (
    <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className="relative">
            <Avatar className="h-16 w-16">
              <AvatarImage src={tutor.avatar} alt={tutor.name} />
              <AvatarFallback className="bg-blue-100 text-blue-600 text-lg">
                {tutor.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            {tutor.isOnline && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-bold text-lg text-gray-900">
                  {tutor.name}
                </h3>
                <p className="text-sm text-gray-600">{tutor.title}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className={
                    tutor.isFavorite ? "text-red-500" : "text-gray-400"
                  }
                >
                  <Heart
                    className={`h-4 w-4 ${
                      tutor.isFavorite ? "fill-current" : ""
                    }`}
                  />
                </Button>
                <Badge variant="outline" className="text-xs">
                  ${tutor.hourlyRate}/hr
                </Badge>
              </div>
            </div>

            <div className="flex items-center space-x-4 mb-3">
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <span className="text-sm font-medium">{tutor.rating}</span>
                <span className="text-sm text-gray-600">
                  ({tutor.reviewCount})
                </span>
              </div>
              <div className="flex items-center space-x-1 text-sm text-gray-600">
                <MapPin className="h-3 w-3" />
                <span>{tutor.location}</span>
              </div>
              <div className="flex items-center space-x-1 text-sm text-gray-600">
                <Clock className="h-3 w-3" />
                <span>{tutor.experience}</span>
              </div>
            </div>

            <div className="mb-3">
              <div className="flex flex-wrap gap-1">
                {tutor.subjects.slice(0, 3).map((subject, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {subject}
                  </Badge>
                ))}
                {tutor.subjects.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{tutor.subjects.length - 3} more
                  </Badge>
                )}
              </div>
            </div>

            <p className="text-sm text-gray-700 mb-4 line-clamp-2">
              {tutor.description}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-xs text-gray-600">
                <div className="flex items-center space-x-1">
                  <Video className="h-3 w-3" />
                  <span>{tutor.sessionTypes.join(", ")}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageSquare className="h-3 w-3" />
                  <span>Responds {tutor.responseTime}</span>
                </div>
              </div>
              <Badge
                variant={
                  tutor.availability.includes("now") ? "default" : "secondary"
                }
                className={
                  tutor.availability.includes("now")
                    ? "bg-green-100 text-green-800"
                    : ""
                }
              >
                {tutor.availability}
              </Badge>
            </div>

            <div className="flex space-x-2 mt-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setSelectedTutor(tutor)}
                  >
                    <User className="h-3 w-3 mr-1" />
                    View Profile
                  </Button>
                </DialogTrigger>
              </Dialog>
              <Button className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600">
                <MessageSquare className="h-3 w-3 mr-1" />
                Contact
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <StudentLayout
      title="Find Tutors"
      description="Connect with expert tutors to accelerate your learning."
    >
      <div className="space-y-6">
        {/* Search and Filters */}
        <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search tutors by name, subject, or expertise..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/40 border-white/20"
                />
              </div>
              <Select
                value={selectedSubject}
                onValueChange={setSelectedSubject}
              >
                <SelectTrigger className="w-full md:w-48 bg-white/40 border-white/20">
                  <SelectValue placeholder="All Subjects" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject === "all" ? "All Subjects" : subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" className="bg-white/40 border-white/20">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
            <CardContent className="p-4 text-center">
              <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">
                {filteredTutors.length}
              </div>
              <div className="text-sm text-gray-600">Available Tutors</div>
            </CardContent>
          </Card>
          <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
            <CardContent className="p-4 text-center">
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <div className="h-3 w-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="text-2xl font-bold text-green-600">
                {onlineTutors.length}
              </div>
              <div className="text-sm text-gray-600">Online Now</div>
            </CardContent>
          </Card>
          <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
            <CardContent className="p-4 text-center">
              <Star className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-600">4.8</div>
              <div className="text-sm text-gray-600">Avg Rating</div>
            </CardContent>
          </Card>
          <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
            <CardContent className="p-4 text-center">
              <Heart className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-red-600">
                {favoriteTutors.length}
              </div>
              <div className="text-sm text-gray-600">Favorites</div>
            </CardContent>
          </Card>
        </div>

        {/* Tutors Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3 backdrop-blur-sm bg-white/60 border-white/20">
            <TabsTrigger value="all">
              All Tutors ({filteredTutors.length})
            </TabsTrigger>
            <TabsTrigger value="online">
              Online Now ({onlineTutors.length})
            </TabsTrigger>
            <TabsTrigger value="favorites">
              Favorites ({favoriteTutors.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredTutors.map((tutor) => (
                <TutorCard key={tutor.id} tutor={tutor} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="online" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {onlineTutors.map((tutor) => (
                <TutorCard key={tutor.id} tutor={tutor} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="favorites" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {favoriteTutors.length > 0 ? (
                favoriteTutors.map((tutor) => (
                  <TutorCard key={tutor.id} tutor={tutor} />
                ))
              ) : (
                <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl col-span-2">
                  <CardContent className="p-12 text-center">
                    <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No favorite tutors yet
                    </h3>
                    <p className="text-gray-600">
                      Click the heart icon on any tutor to add them to your
                      favorites.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {filteredTutors.length === 0 && (
          <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
            <CardContent className="p-12 text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No tutors found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search terms or filters to find more tutors.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Tutor Profile Modal */}
        <Dialog
          open={!!selectedTutor}
          onOpenChange={() => setSelectedTutor(null)}
        >
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Tutor Profile</DialogTitle>
              <DialogDescription>
                Learn more about this tutor and book a session.
              </DialogDescription>
            </DialogHeader>
            {selectedTutor && (
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="relative">
                    <Avatar className="h-20 w-20">
                      <AvatarImage
                        src={selectedTutor.avatar}
                        alt={selectedTutor.name}
                      />
                      <AvatarFallback className="bg-blue-100 text-blue-600 text-xl">
                        {selectedTutor.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    {selectedTutor.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900">
                      {selectedTutor.name}
                    </h3>
                    <p className="text-gray-600">{selectedTutor.title}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="font-medium">
                          {selectedTutor.rating}
                        </span>
                        <span className="text-gray-600">
                          ({selectedTutor.reviewCount} reviews)
                        </span>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        ${selectedTutor.hourlyRate}/hour
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Experience:</span>
                    <span className="ml-2">{selectedTutor.experience}</span>
                  </div>
                  <div>
                    <span className="font-medium">Location:</span>
                    <span className="ml-2">{selectedTutor.location}</span>
                  </div>
                  <div>
                    <span className="font-medium">Languages:</span>
                    <span className="ml-2">
                      {selectedTutor.languages.join(", ")}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Sessions:</span>
                    <span className="ml-2">{selectedTutor.totalSessions}+</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">About</h4>
                  <p className="text-gray-700">{selectedTutor.description}</p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Education</h4>
                  <p className="text-gray-700">{selectedTutor.education}</p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Subjects</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedTutor.subjects.map((subject, index) => (
                      <Badge key={index} variant="secondary">
                        {subject}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Achievements</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedTutor.achievements.map((achievement, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        <Award className="h-3 w-3 mr-1" />
                        {achievement}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                  <Button className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    Book Session
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </StudentLayout>
  );
};

export default StudentTutors;
