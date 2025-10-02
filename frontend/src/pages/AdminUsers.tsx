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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { User, Mail, Calendar, TrendingUp, Target, Clock } from "lucide-react";

const AdminUsers = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  // Mock user data
  const users = [
    {
      id: "1",
      name: "Alex Johnson",
      email: "alex.johnson@email.com",
      role: "Student",
      exam: "SAT",
      progress: 68,
      questions_solved: 1247,
      accuracy: 82,
      study_time: 31,
      streak: 18,
      last_active: "2024-01-15",
      created_at: "2024-01-01",
      status: "Active",
    },
    {
      id: "2",
      name: "Maria Santos",
      email: "maria.santos@email.com",
      role: "Student",
      exam: "ENEM",
      progress: 45,
      questions_solved: 892,
      accuracy: 76,
      study_time: 22,
      streak: 7,
      last_active: "2024-01-14",
      created_at: "2024-01-05",
      status: "Active",
    },
    {
      id: "3",
      name: "Dr. Sarah Wilson",
      email: "sarah.wilson@school.edu",
      role: "Teacher",
      exam: "SAT",
      students: 45,
      classes: 3,
      last_active: "2024-01-15",
      created_at: "2023-12-15",
      status: "Active",
    },
    {
      id: "4",
      name: "Emma Davis",
      email: "emma.davis@email.com",
      role: "Student",
      exam: "A-levels",
      progress: 72,
      questions_solved: 1456,
      accuracy: 89,
      study_time: 45,
      streak: 25,
      last_active: "2024-01-15",
      created_at: "2023-11-20",
      status: "Active",
    },
    {
      id: "5",
      name: "Michael Chen",
      email: "michael.chen@email.com",
      role: "Student",
      exam: "SAT",
      progress: 23,
      questions_solved: 234,
      accuracy: 65,
      study_time: 8,
      streak: 3,
      last_active: "2024-01-10",
      created_at: "2024-01-08",
      status: "Inactive",
    },
  ];

  const columns = [
    {
      key: "name",
      label: "User",
      sortable: true,
      render: (value: string, row: any) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
            <User className="h-4 w-4 text-white" />
          </div>
          <div>
            <div className="font-medium">{value}</div>
            <div className="text-sm text-gray-500">{row.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      label: "Role",
      sortable: true,
      render: (value: string) => (
        <Badge
          className={
            value === "Teacher"
              ? "bg-blue-100 text-blue-800"
              : "bg-green-100 text-green-800"
          }
        >
          {value}
        </Badge>
      ),
    },
    {
      key: "exam",
      label: "Exam",
      render: (value: string) => <Badge variant="outline">{value}</Badge>,
    },
    {
      key: "progress",
      label: "Progress",
      sortable: true,
      render: (value: number, row: any) => {
        if (row.role === "Teacher") {
          return (
            <div className="text-sm text-gray-500">{row.students} students</div>
          );
        }
        return (
          <div className="w-20">
            <div className="text-sm font-medium mb-1">{value}%</div>
            <Progress value={value} className="h-1" />
          </div>
        );
      },
    },
    {
      key: "accuracy",
      label: "Accuracy",
      sortable: true,
      render: (value: number, row: any) => {
        if (row.role === "Teacher") {
          return <span className="text-sm text-gray-500">-</span>;
        }
        return (
          <span
            className={`font-medium ${
              value >= 80
                ? "text-green-600"
                : value >= 70
                ? "text-yellow-600"
                : "text-red-600"
            }`}
          >
            {value}%
          </span>
        );
      },
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
              : "bg-gray-100 text-gray-800"
          }
        >
          {value}
        </Badge>
      ),
    },
    {
      key: "last_active",
      label: "Last Active",
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
  ];

  const handleAdd = () => {
    setIsCreateDialogOpen(true);
  };

  const handleEdit = (user: any) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (user: any) => {
    toast({
      title: "User deleted",
      description: `${user.name} has been deleted successfully.`,
    });
  };

  const handleView = (user: any) => {
    setSelectedUser(user);
    setIsViewDialogOpen(true);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "User created",
      description: "New user has been created successfully.",
    });
    setIsCreateDialogOpen(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "User updated",
      description: "User has been updated successfully.",
    });
    setIsEditDialogOpen(false);
  };

  return (
    <AdminLayout
      title="User Management"
      description="Manage student and teacher accounts, view progress, and monitor platform usage."
    >
      <AdminDataTable
        title="All Users"
        description="View and manage all students and teachers on the platform"
        data={users}
        columns={columns}
        searchPlaceholder="Search users..."
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        addButtonText="Add User"
      />

      {/* Create User Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
            <DialogDescription>
              Add a new student or teacher to the platform.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="e.g., John Doe" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john.doe@email.com"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="teacher">Teacher</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="exam">Exam (for students)</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select exam" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sat">SAT</SelectItem>
                    <SelectItem value="enem">ENEM</SelectItem>
                    <SelectItem value="a-levels">A-levels</SelectItem>
                    <SelectItem value="leaving-cert">
                      Leaving Certificate
                    </SelectItem>
                    <SelectItem value="selectividad">Selectividad</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
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
                Create User
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information and settings.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Full Name</Label>
                  <Input
                    id="edit-name"
                    defaultValue={selectedUser.name}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    defaultValue={selectedUser.email}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-role">Role</Label>
                  <Select defaultValue={selectedUser.role.toLowerCase()}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="teacher">Teacher</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select defaultValue={selectedUser.status.toLowerCase()}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-indigo-500 to-purple-600"
                >
                  Update User
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* View User Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              Detailed information and progress for this user.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              {/* User Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span>User Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        Name
                      </Label>
                      <p className="text-lg font-medium">{selectedUser.name}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        Email
                      </Label>
                      <p className="text-lg">{selectedUser.email}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        Role
                      </Label>
                      <Badge
                        className={
                          selectedUser.role === "Teacher"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }
                      >
                        {selectedUser.role}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        Status
                      </Label>
                      <Badge
                        className={
                          selectedUser.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }
                      >
                        {selectedUser.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Progress (for students only) */}
              {selectedUser.role === "Student" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5" />
                      <span>Study Progress</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-indigo-600 mb-1">
                          {selectedUser.progress}%
                        </div>
                        <div className="text-sm text-gray-600">
                          Overall Progress
                        </div>
                        <Progress
                          value={selectedUser.progress}
                          className="mt-2"
                        />
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600 mb-1">
                          {selectedUser.questions_solved?.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">
                          Questions Solved
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600 mb-1">
                          {selectedUser.accuracy}%
                        </div>
                        <div className="text-sm text-gray-600">
                          Accuracy Rate
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600 mb-1">
                          {selectedUser.study_time}h
                        </div>
                        <div className="text-sm text-gray-600">Study Time</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Teacher Info (for teachers only) */}
              {selectedUser.role === "Teacher" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Target className="h-5 w-5" />
                      <span>Teaching Overview</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600 mb-1">
                          {selectedUser.students}
                        </div>
                        <div className="text-sm text-gray-600">Students</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600 mb-1">
                          {selectedUser.classes}
                        </div>
                        <div className="text-sm text-gray-600">Classes</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminUsers;
