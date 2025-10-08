import StudentLayout from "@/components/StudentLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  BookOpen,
  Target,
  Award,
  Edit,
  Save,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useApi";

const StudentProfile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  // Mock additional profile data
  const profileData = {
    bio: "Passionate student preparing for college entrance exams. Love mathematics and science!",
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    dateOfBirth: "2005-03-15",
    school: "Lincoln High School",
    grade: "12th Grade",
    targetExam: "SAT",
    targetScore: "1500+",
    studyGoals: [
      "Improve Math score by 100 points",
      "Master essay writing",
      "Complete 1000 practice questions",
    ],
    interests: ["Mathematics", "Physics", "Computer Science", "Chess"],
    achievements: [
      "Honor Roll Student",
      "Math Competition Winner",
      "Science Fair Finalist",
    ],
  };

  return (
    <StudentLayout
      title="Profile"
      description="Manage your personal information and study preferences."
    >
      <div className="space-y-6">
        {/* Profile Header */}
        <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-start space-x-6">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/placeholder.svg" alt={user?.name} />
                  <AvatarFallback className="bg-blue-100 text-blue-600 text-2xl">
                    {user?.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("") || "U"}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 p-0"
                >
                  <Edit className="h-3 w-3" />
                </Button>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {user?.name || "Student"}
                    </h2>
                    <p className="text-gray-600">
                      {profileData.school} • {profileData.grade}
                    </p>
                  </div>
                  <Button
                    variant={isEditing ? "default" : "outline"}
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    ) : (
                      <>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Profile
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-gray-700 mb-4">{profileData.bio}</p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Mail className="h-4 w-4" />
                    <span>{user?.email}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Phone className="h-4 w-4" />
                    <span>{profileData.phone}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{profileData.location}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Personal Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={user?.name || ""}
                    disabled={!isEditing}
                    className="bg-white/40"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={user?.email || ""}
                    disabled={!isEditing}
                    className="bg-white/40"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    disabled={!isEditing}
                    className="bg-white/40"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={profileData.location}
                    disabled={!isEditing}
                    className="bg-white/40"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profileData.bio}
                  disabled={!isEditing}
                  className="bg-white/40"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Academic Information */}
          <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5" />
                <span>Academic Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="school">School</Label>
                  <Input
                    id="school"
                    value={profileData.school}
                    disabled={!isEditing}
                    className="bg-white/40"
                  />
                </div>
                <div>
                  <Label htmlFor="grade">Grade</Label>
                  <Input
                    id="grade"
                    value={profileData.grade}
                    disabled={!isEditing}
                    className="bg-white/40"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="targetExam">Target Exam</Label>
                  <Input
                    id="targetExam"
                    value={profileData.targetExam}
                    disabled={!isEditing}
                    className="bg-white/40"
                  />
                </div>
                <div>
                  <Label htmlFor="targetScore">Target Score</Label>
                  <Input
                    id="targetScore"
                    value={profileData.targetScore}
                    disabled={!isEditing}
                    className="bg-white/40"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Study Goals and Interests */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>Study Goals</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {profileData.studyGoals.map((goal, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-3 bg-white/40 rounded-lg"
                  >
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">{goal}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="h-5 w-5" />
                <span>Achievements</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {profileData.achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-3 bg-white/40 rounded-lg"
                  >
                    <Award className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm">{achievement}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Interests */}
        <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
          <CardHeader>
            <CardTitle>Interests & Subjects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {profileData.interests.map((interest, index) => (
                <Badge key={index} variant="secondary" className="text-sm">
                  {interest}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </StudentLayout>
  );
};

export default StudentProfile;
