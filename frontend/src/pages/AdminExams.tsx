import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import AdminDataTable from "@/components/AdminDataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Plus, BookOpen, HelpCircle } from "lucide-react";

const AdminExams = () => {
  const [currentView, setCurrentView] = useState<
    "exams" | "subjects" | "questions"
  >("exams");
  const [selectedExam, setSelectedExam] = useState<any>(null);
  const [selectedSubject, setSelectedSubject] = useState<any>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Mock exam data
  const exams = [
    {
      id: "1",
      name: "SAT",
      country: "USA",
      description: "Scholastic Assessment Test",
      subjects: 4,
      questions: 1247,
      status: "Active",
      created_at: "2024-01-15",
      flag: "🇺🇸",
    },
    {
      id: "2",
      name: "ENEM",
      country: "Brazil",
      description: "Exame Nacional do Ensino Médio",
      subjects: 5,
      questions: 892,
      status: "Active",
      created_at: "2024-01-20",
      flag: "🇧🇷",
    },
    {
      id: "3",
      name: "A-levels",
      country: "UK",
      description: "Advanced Level Qualifications",
      subjects: 6,
      questions: 1456,
      status: "Draft",
      created_at: "2024-02-01",
      flag: "🇬🇧",
    },
  ];

  // Mock subjects data
  const subjects = [
    {
      id: "1",
      name: "Evidence-Based Reading",
      description: "Reading comprehension and vocabulary",
      questions: 312,
      duration: "65 minutes",
      status: "Active",
    },
    {
      id: "2",
      name: "Writing and Language",
      description: "Grammar, usage, and rhetoric",
      questions: 278,
      duration: "35 minutes",
      status: "Active",
    },
    {
      id: "3",
      name: "Math (No Calculator)",
      description: "Algebra and advanced math without calculator",
      questions: 156,
      duration: "25 minutes",
      status: "Active",
    },
    {
      id: "4",
      name: "Math (Calculator)",
      description: "Problem solving and data analysis",
      questions: 501,
      duration: "55 minutes",
      status: "Active",
    },
  ];

  // Mock questions data
  const questions = [
    {
      id: "1",
      question: "Which choice best describes the main purpose of the passage?",
      type: "Multiple Choice",
      difficulty: "Medium",
      options: 4,
      correct_answer: "B",
      status: "Active",
      created_at: "2024-01-15",
    },
    {
      id: "2",
      question: "The author uses the phrase 'turning point' primarily to...",
      type: "Multiple Choice",
      difficulty: "Hard",
      options: 4,
      correct_answer: "C",
      status: "Active",
      created_at: "2024-01-16",
    },
    {
      id: "3",
      question:
        "Based on the passage, the relationship between X and Y can best be described as...",
      type: "Multiple Choice",
      difficulty: "Easy",
      options: 4,
      correct_answer: "A",
      status: "Draft",
      created_at: "2024-01-17",
    },
  ];

  // Exam columns
  const examColumns = [
    {
      key: "flag",
      label: "Flag",
      render: (value: string) => <span className="text-2xl">{value}</span>,
    },
    {
      key: "name",
      label: "Exam Name",
      sortable: true,
      render: (value: string, row: any) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-sm text-gray-500">{row.country}</div>
        </div>
      ),
    },
    {
      key: "description",
      label: "Description",
      render: (value: string) => (
        <div className="max-w-xs truncate" title={value}>
          {value}
        </div>
      ),
    },
    {
      key: "subjects",
      label: "Subjects",
      sortable: true,
      render: (value: number) => (
        <Badge variant="secondary">{value} subjects</Badge>
      ),
    },
    {
      key: "questions",
      label: "Questions",
      sortable: true,
      render: (value: number) => (
        <Badge variant="outline">{value.toLocaleString()} questions</Badge>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (value: string) => (
        <Badge
          className={
            value === "Active"
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }
        >
          {value}
        </Badge>
      ),
    },
  ];

  // Subject columns
  const subjectColumns = [
    {
      key: "name",
      label: "Subject Name",
      sortable: true,
      render: (value: string) => <div className="font-medium">{value}</div>,
    },
    {
      key: "description",
      label: "Description",
      render: (value: string) => (
        <div className="max-w-xs truncate" title={value}>
          {value}
        </div>
      ),
    },
    {
      key: "questions",
      label: "Questions",
      sortable: true,
      render: (value: number) => (
        <Badge variant="outline">{value} questions</Badge>
      ),
    },
    {
      key: "duration",
      label: "Duration",
      render: (value: string) => <Badge variant="secondary">{value}</Badge>,
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (value: string) => (
        <Badge
          className={
            value === "Active"
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }
        >
          {value}
        </Badge>
      ),
    },
  ];

  // Question columns
  const questionColumns = [
    {
      key: "question",
      label: "Question",
      render: (value: string) => (
        <div className="max-w-md truncate" title={value}>
          {value}
        </div>
      ),
    },
    {
      key: "type",
      label: "Type",
      render: (value: string) => <Badge variant="outline">{value}</Badge>,
    },
    {
      key: "difficulty",
      label: "Difficulty",
      sortable: true,
      render: (value: string) => (
        <Badge
          className={
            value === "Easy"
              ? "bg-green-100 text-green-800"
              : value === "Medium"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          }
        >
          {value}
        </Badge>
      ),
    },
    {
      key: "options",
      label: "Options",
      render: (value: number) => `${value} options`,
    },
    {
      key: "correct_answer",
      label: "Answer",
      render: (value: string) => (
        <Badge className="bg-blue-100 text-blue-800">{value}</Badge>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (value: string) => (
        <Badge
          className={
            value === "Active"
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }
        >
          {value}
        </Badge>
      ),
    },
  ];

  const handleExamView = (exam: any) => {
    setSelectedExam(exam);
    setCurrentView("subjects");
  };

  const handleSubjectView = (subject: any) => {
    setSelectedSubject(subject);
    setCurrentView("questions");
  };

  const handleAdd = () => {
    setIsCreateDialogOpen(true);
  };

  const handleEdit = (item: any) => {
    setIsEditDialogOpen(true);
  };

  const handleDelete = (item: any) => {
    toast({
      title: `${currentView.slice(0, -1)} deleted`,
      description: `${
        item.name || item.question
      } has been deleted successfully.`,
    });
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: `${currentView.slice(0, -1)} created`,
      description: `New ${currentView.slice(
        0,
        -1
      )} has been created successfully.`,
    });
    setIsCreateDialogOpen(false);
  };

  const renderBreadcrumb = () => (
    <div className="flex items-center space-x-2 mb-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          if (currentView === "questions") {
            setCurrentView("subjects");
            setSelectedSubject(null);
          } else if (currentView === "subjects") {
            setCurrentView("exams");
            setSelectedExam(null);
          }
        }}
        className="flex items-center space-x-1"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back</span>
      </Button>
      <span className="text-gray-400">/</span>
      <span className="text-gray-600">
        {currentView === "exams" && "All Exams"}
        {currentView === "subjects" && `${selectedExam?.name} Subjects`}
        {currentView === "questions" && `${selectedSubject?.name} Questions`}
      </span>
    </div>
  );

  const getTitle = () => {
    switch (currentView) {
      case "exams":
        return "Exam Management";
      case "subjects":
        return `${selectedExam?.name} Subjects`;
      case "questions":
        return `${selectedSubject?.name} Questions`;
      default:
        return "Exam Management";
    }
  };

  const getDescription = () => {
    switch (currentView) {
      case "exams":
        return "Create, edit, and manage exams across different countries and educational systems.";
      case "subjects":
        return `Manage subjects and topics for ${selectedExam?.name} exam.`;
      case "questions":
        return `Manage questions for ${selectedSubject?.name} subject.`;
      default:
        return "";
    }
  };

  return (
    <AdminLayout title={getTitle()} description={getDescription()}>
      {currentView !== "exams" && renderBreadcrumb()}

      {currentView === "exams" && (
        <AdminDataTable
          title="All Exams"
          description="Manage exams, subjects, and questions for your platform"
          data={exams}
          columns={examColumns}
          searchPlaceholder="Search exams..."
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleExamView}
          addButtonText="Create Exam"
        />
      )}

      {currentView === "subjects" && (
        <AdminDataTable
          title={`${selectedExam?.name} Subjects`}
          description={`Manage subjects for ${selectedExam?.name} exam`}
          data={subjects}
          columns={subjectColumns}
          searchPlaceholder="Search subjects..."
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleSubjectView}
          addButtonText="Add Subject"
        />
      )}

      {currentView === "questions" && (
        <AdminDataTable
          title={`${selectedSubject?.name} Questions`}
          description={`Manage questions for ${selectedSubject?.name} subject`}
          data={questions}
          columns={questionColumns}
          searchPlaceholder="Search questions..."
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          addButtonText="Add Question"
        />
      )}

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Create New{" "}
              {currentView === "exams"
                ? "Exam"
                : currentView === "subjects"
                ? "Subject"
                : "Question"}
            </DialogTitle>
            <DialogDescription>
              Add a new {currentView.slice(0, -1)} to the platform.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            {currentView === "exams" && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Exam Name</Label>
                    <Input id="name" placeholder="e.g., SAT" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input id="country" placeholder="e.g., USA" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Brief description of the exam"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="flag">Flag Emoji</Label>
                    <Input id="flag" placeholder="🇺🇸" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </>
            )}

            {currentView === "subjects" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="subject-name">Subject Name</Label>
                  <Input
                    id="subject-name"
                    placeholder="e.g., Mathematics"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject-description">Description</Label>
                  <Textarea
                    id="subject-description"
                    placeholder="Brief description of the subject"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration</Label>
                    <Input id="duration" placeholder="e.g., 60 minutes" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject-status">Status</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </>
            )}

            {currentView === "questions" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="question-text">Question</Label>
                  <Textarea
                    id="question-text"
                    placeholder="Enter the question text"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="question-type">Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="multiple-choice">
                          Multiple Choice
                        </SelectItem>
                        <SelectItem value="true-false">True/False</SelectItem>
                        <SelectItem value="short-answer">
                          Short Answer
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Difficulty</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="correct-answer">Correct Answer</Label>
                  <Input id="correct-answer" placeholder="e.g., A" required />
                </div>
              </>
            )}

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-indigo-500 to-purple-600"
              >
                Create{" "}
                {currentView === "exams"
                  ? "Exam"
                  : currentView === "subjects"
                  ? "Subject"
                  : "Question"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminExams;
