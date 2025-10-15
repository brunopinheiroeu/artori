import { useState } from "react";
import { useTranslation } from "react-i18next";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import {
  ArrowLeft,
  Plus,
  BookOpen,
  HelpCircle,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import {
  useAdminExams,
  useCreateAdminExam,
  useUpdateAdminExam,
  useDeleteAdminExam,
  useAdminQuestions,
  useCreateAdminQuestion,
  useUpdateAdminQuestion,
  useDeleteAdminQuestion,
} from "@/hooks/useAdminApi";
import { usePagination } from "@/hooks/usePagination";
import type {
  Exam,
  Subject,
  AdminExamCreate,
  AdminExamUpdate,
  AdminQuestionResponse,
  AdminQuestionCreate,
  AdminQuestionUpdate,
  Option,
  Explanation,
} from "@/lib/api";
import { formatDistanceToNow } from "date-fns";

const AdminExams = () => {
  const { t } = useTranslation("admin");
  const [currentView, setCurrentView] = useState<
    "exams" | "subjects" | "questions"
  >("exams");
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<
    Exam | AdminQuestionResponse | null
  >(null);

  // Questions pagination using reusable hook
  const questionsPagination = usePagination(10);

  // Form states
  const [examForm, setExamForm] = useState<AdminExamCreate>({
    name: "",
    country: "",
    description: "",
    status: "draft",
  });
  const [questionForm, setQuestionForm] = useState<AdminQuestionCreate>({
    question: "",
    question_type: "multiple_choice",
    difficulty: "medium",
    options: [
      { id: "A", text: "" },
      { id: "B", text: "" },
      { id: "C", text: "" },
      { id: "D", text: "" },
    ],
    correct_answer: "",
    explanation: {
      reasoning: [""],
      concept: "",
      sources: [""],
      bias_check: "",
      reflection: "",
    },
    tags: [],
    status: "draft",
  });

  // API hooks
  const {
    data: exams,
    isLoading: examsLoading,
    error: examsError,
  } = useAdminExams();

  const {
    data: questionsResponse,
    isLoading: questionsLoading,
    error: questionsError,
  } = useAdminQuestions(selectedSubject?.id, {
    limit: questionsPagination.pageSize,
    skip: questionsPagination.skip,
  });

  // Extract questions and pagination info from response
  const questions = questionsResponse?.questions || [];
  const totalQuestions = questionsResponse?.total_count || 0;

  const createExamMutation = useCreateAdminExam();
  const updateExamMutation = useUpdateAdminExam();
  const deleteExamMutation = useDeleteAdminExam();
  const createQuestionMutation = useCreateAdminQuestion();
  const updateQuestionMutation = useUpdateAdminQuestion();
  const deleteQuestionMutation = useDeleteAdminQuestion();

  // Exam columns
  const examColumns = [
    {
      key: "flag",
      label: t("exams.flag"),
      render: (value: string) => (
        <span className="text-2xl">{value || "🏳️"}</span>
      ),
    },
    {
      key: "name",
      label: t("exams.examName"),
      sortable: true,
      render: (value: string, row: Exam) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-sm text-gray-500">{row.country}</div>
        </div>
      ),
    },
    {
      key: "description",
      label: t("exams.description"),
      render: (value: string) => (
        <div className="max-w-xs truncate" title={value}>
          {value}
        </div>
      ),
    },
    {
      key: "subjects",
      label: t("exams.subjects"),
      sortable: true,
      render: (value: Subject[], row: Exam) => (
        <Badge variant="secondary">
          {row.subjects?.length || 0} {t("exams.subjectsCount")}
        </Badge>
      ),
    },
    {
      key: "total_questions",
      label: t("exams.questions"),
      sortable: true,
      render: (value: number) => (
        <Badge variant="outline">
          {(value || 0).toLocaleString()} {t("exams.questionsCount")}
        </Badge>
      ),
    },
    {
      key: "status",
      label: t("exams.status"),
      sortable: true,
      render: (value: string) => (
        <Badge
          className={
            value === "active"
              ? "bg-green-100 text-green-800"
              : value === "draft"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-gray-100 text-gray-800"
          }
        >
          {value?.charAt(0).toUpperCase() + value?.slice(1) || "Unknown"}
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
      key: "total_questions",
      label: "Questions",
      sortable: true,
      render: (value: number) => (
        <Badge variant="outline">{value || 0} questions</Badge>
      ),
    },
    {
      key: "duration",
      label: "Duration",
      render: (value: string) => (
        <Badge variant="secondary">{value || "N/A"}</Badge>
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
      key: "question_type",
      label: "Type",
      render: (value: string) => (
        <Badge variant="outline">
          {value?.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase()) ||
            "Multiple Choice"}
        </Badge>
      ),
    },
    {
      key: "difficulty",
      label: "Difficulty",
      sortable: true,
      render: (value: string) => (
        <Badge
          className={
            value === "easy"
              ? "bg-green-100 text-green-800"
              : value === "medium"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          }
        >
          {value?.charAt(0).toUpperCase() + value?.slice(1) || "Medium"}
        </Badge>
      ),
    },
    {
      key: "options",
      label: "Options",
      render: (value: Option[], row: AdminQuestionResponse) =>
        `${row.options?.length || 0} options`,
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
            value === "active"
              ? "bg-green-100 text-green-800"
              : value === "draft"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-gray-100 text-gray-800"
          }
        >
          {value?.charAt(0).toUpperCase() + value?.slice(1) || "Draft"}
        </Badge>
      ),
    },
    {
      key: "created_at",
      label: "Created",
      sortable: true,
      render: (value: string) =>
        formatDistanceToNow(new Date(value), { addSuffix: true }),
    },
  ];

  const handleExamView = (exam: Exam) => {
    setSelectedExam(exam);
    setCurrentView("subjects");
  };

  const handleSubjectView = (subject: Subject) => {
    setSelectedSubject(subject);
    setCurrentView("questions");
    // Reset pagination when switching subjects
    questionsPagination.resetPagination();
  };

  const handleAdd = () => {
    if (currentView === "exams") {
      setExamForm({
        name: "",
        country: "",
        description: "",
        status: "draft",
      });
    } else if (currentView === "questions") {
      setQuestionForm({
        question: "",
        question_type: "multiple_choice",
        difficulty: "medium",
        options: [
          { id: "A", text: "" },
          { id: "B", text: "" },
          { id: "C", text: "" },
          { id: "D", text: "" },
        ],
        correct_answer: "",
        explanation: {
          reasoning: [""],
          concept: "",
          sources: [""],
          bias_check: "",
          reflection: "",
        },
        tags: [],
        status: "draft",
      });
    }
    setIsCreateDialogOpen(true);
  };

  const handleEdit = (item: Exam | AdminQuestionResponse | Subject) => {
    setEditingItem(item as Exam | AdminQuestionResponse);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (item: Exam | AdminQuestionResponse | Subject) => {
    let itemName = "";
    if ("question" in item) {
      itemName = item.question.substring(0, 50) + "...";
    } else if ("name" in item) {
      itemName = item.name;
    }

    if (
      window.confirm(
        `Are you sure you want to delete "${itemName}"? This action cannot be undone.`
      )
    ) {
      if (currentView === "exams" && "name" in item && "country" in item) {
        deleteExamMutation.mutate(item.id);
      } else if (currentView === "questions" && "question" in item) {
        deleteQuestionMutation.mutate(item.id);
      }
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentView === "exams") {
      if (!examForm.name || !examForm.country || !examForm.description) {
        toast.error("Please fill in all required fields");
        return;
      }
      createExamMutation.mutate(examForm, {
        onSuccess: () => {
          setIsCreateDialogOpen(false);
          setExamForm({
            name: "",
            country: "",
            description: "",
            status: "draft",
          });
        },
      });
    } else if (currentView === "questions" && selectedSubject) {
      if (!questionForm.question || !questionForm.correct_answer) {
        toast.error("Please fill in all required fields");
        return;
      }
      createQuestionMutation.mutate(
        { subjectId: selectedSubject.id, questionData: questionForm },
        {
          onSuccess: () => {
            setIsCreateDialogOpen(false);
            setQuestionForm({
              question: "",
              question_type: "multiple_choice",
              difficulty: "medium",
              options: [
                { id: "A", text: "" },
                { id: "B", text: "" },
                { id: "C", text: "" },
                { id: "D", text: "" },
              ],
              correct_answer: "",
              explanation: {
                reasoning: [""],
                concept: "",
                sources: [""],
                bias_check: "",
                reflection: "",
              },
              tags: [],
              status: "draft",
            });
          },
        }
      );
    }
  };

  // Show error state if exams fail to load
  if (examsError) {
    return (
      <AdminLayout
        title="Exam Management"
        description="Create, edit, and manage exams across different countries and educational systems."
      >
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Failed to load exams. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      </AdminLayout>
    );
  }

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
        <>
          {examsLoading ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-4 w-64 mt-2" />
                </div>
                <Skeleton className="h-10 w-24" />
              </div>
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton key={index} className="h-16 w-full" />
                ))}
              </div>
            </div>
          ) : (
            <AdminDataTable
              title="All Exams"
              description="Manage exams, subjects, and questions for your platform"
              data={exams || []}
              columns={examColumns}
              searchPlaceholder="Search exams..."
              onAdd={handleAdd}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onRowClick={handleExamView}
              addButtonText="Create Exam"
            />
          )}
        </>
      )}

      {currentView === "subjects" && selectedExam && (
        <AdminDataTable
          title={`${selectedExam.name} Subjects`}
          description={`Manage subjects for ${selectedExam.name} exam`}
          data={selectedExam.subjects || []}
          columns={subjectColumns}
          searchPlaceholder="Search subjects..."
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onRowClick={handleSubjectView}
          addButtonText="Add Subject"
        />
      )}

      {currentView === "questions" && selectedSubject && (
        <>
          {questionsLoading ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-4 w-64 mt-2" />
                </div>
                <Skeleton className="h-10 w-24" />
              </div>
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton key={index} className="h-16 w-full" />
                ))}
              </div>
            </div>
          ) : questionsError ? (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Failed to load questions. Please try refreshing the page.
              </AlertDescription>
            </Alert>
          ) : (
            <AdminDataTable
              title={`${selectedSubject.name} Questions`}
              description={`Manage questions for ${selectedSubject.name} subject`}
              data={questions}
              columns={questionColumns}
              searchPlaceholder="Search questions..."
              onAdd={handleAdd}
              onEdit={handleEdit}
              onDelete={handleDelete}
              addButtonText="Add Question"
              currentPage={questionsPagination.currentPage}
              onPageChange={questionsPagination.handlePageChange}
              onPageSizeChange={questionsPagination.handlePageSizeChange}
              enableServerSidePagination={true}
              totalCount={totalQuestions}
            />
          )}
        </>
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
                    <Input
                      id="name"
                      placeholder="e.g., SAT"
                      value={examForm.name}
                      onChange={(e) =>
                        setExamForm({ ...examForm, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      placeholder="e.g., USA"
                      value={examForm.country}
                      onChange={(e) =>
                        setExamForm({ ...examForm, country: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Brief description of the exam"
                    value={examForm.description}
                    onChange={(e) =>
                      setExamForm({ ...examForm, description: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="flag">Flag Emoji</Label>
                    <Input
                      id="flag"
                      placeholder="🇺🇸"
                      value={examForm.flag || ""}
                      onChange={(e) =>
                        setExamForm({ ...examForm, flag: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={examForm.status}
                      onValueChange={(value) =>
                        setExamForm({
                          ...examForm,
                          status: value as "active" | "draft" | "archived",
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
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
                    value={questionForm.question}
                    onChange={(e) =>
                      setQuestionForm({
                        ...questionForm,
                        question: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="question-type">Type</Label>
                    <Select
                      value={questionForm.question_type}
                      onValueChange={(value) =>
                        setQuestionForm({
                          ...questionForm,
                          question_type: value as
                            | "multiple_choice"
                            | "true_false"
                            | "short_answer",
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="multiple_choice">
                          Multiple Choice
                        </SelectItem>
                        <SelectItem value="true_false">True/False</SelectItem>
                        <SelectItem value="short_answer">
                          Short Answer
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Difficulty</Label>
                    <Select
                      value={questionForm.difficulty}
                      onValueChange={(value) =>
                        setQuestionForm({
                          ...questionForm,
                          difficulty: value as "easy" | "medium" | "hard",
                        })
                      }
                    >
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

                {/* Options */}
                <div className="space-y-2">
                  <Label>Answer Options</Label>
                  {questionForm.options.map((option, index) => (
                    <div
                      key={option.id}
                      className="flex items-center space-x-2"
                    >
                      <Label className="w-8">{option.id}:</Label>
                      <Input
                        placeholder={`Option ${option.id}`}
                        value={option.text}
                        onChange={(e) => {
                          const newOptions = [...questionForm.options];
                          newOptions[index] = {
                            ...option,
                            text: e.target.value,
                          };
                          setQuestionForm({
                            ...questionForm,
                            options: newOptions,
                          });
                        }}
                        required
                      />
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="correct-answer">Correct Answer</Label>
                  <Select
                    value={questionForm.correct_answer}
                    onValueChange={(value) =>
                      setQuestionForm({
                        ...questionForm,
                        correct_answer: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select correct answer" />
                    </SelectTrigger>
                    <SelectContent>
                      {questionForm.options.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          {option.id} - {option.text || "Empty option"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="explanation-concept">
                    Explanation Concept
                  </Label>
                  <Input
                    id="explanation-concept"
                    placeholder="Main concept being tested"
                    value={questionForm.explanation.concept}
                    onChange={(e) =>
                      setQuestionForm({
                        ...questionForm,
                        explanation: {
                          ...questionForm.explanation,
                          concept: e.target.value,
                        },
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="explanation-reasoning">Reasoning</Label>
                  <Textarea
                    id="explanation-reasoning"
                    placeholder="Explain why this is the correct answer"
                    value={questionForm.explanation.reasoning[0] || ""}
                    onChange={(e) =>
                      setQuestionForm({
                        ...questionForm,
                        explanation: {
                          ...questionForm.explanation,
                          reasoning: [e.target.value],
                        },
                      })
                    }
                  />
                </div>
              </>
            )}

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
                disabled={
                  createExamMutation.isPending ||
                  createQuestionMutation.isPending
                }
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-indigo-500 to-purple-600"
                disabled={
                  createExamMutation.isPending ||
                  createQuestionMutation.isPending
                }
              >
                {(createExamMutation.isPending ||
                  createQuestionMutation.isPending) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
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
