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
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import {
  User,
  Mail,
  Calendar,
  TrendingUp,
  Target,
  Clock,
  AlertTriangle,
  Loader2,
  RotateCcw,
} from "lucide-react";
import {
  useAdminUsers,
  useCreateAdminUser,
  useUpdateAdminUser,
  useDeleteAdminUser,
  useResetAdminUser,
  useUserProgressDetail,
} from "@/hooks/useAdminApi";
import { useExams } from "@/hooks/useApi";
import type {
  AdminUserResponse,
  AdminUserCreate,
  AdminUserUpdate,
  AdminUsersListResponse,
} from "@/lib/api";
import { formatDistanceToNow } from "date-fns";

const AdminUsers = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUserResponse | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Form states
  const [createForm, setCreateForm] = useState<AdminUserCreate>({
    name: "",
    email: "",
    password: "",
    role: "student",
    status: "active",
  });
  const [editForm, setEditForm] = useState<AdminUserUpdate>({});

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  // Calculate skip value for API
  const skip = (currentPage - 1) * pageSize;

  // API hooks
  const {
    data: usersResponse,
    isLoading: usersLoading,
    error: usersError,
  } = useAdminUsers({
    search: searchQuery || undefined,
    role: roleFilter || undefined,
    status: statusFilter || undefined,
    limit: pageSize,
    skip: skip,
  });

  // Extract users array and total count from the response
  const users = usersResponse?.users || [];
  const totalUsers = usersResponse?.total_count || 0;

  const { data: exams } = useExams();
  const createUserMutation = useCreateAdminUser();
  const updateUserMutation = useUpdateAdminUser();
  const deleteUserMutation = useDeleteAdminUser();
  const resetUserMutation = useResetAdminUser();

  const { data: userProgress, isLoading: progressLoading } =
    useUserProgressDetail(selectedUser?.id);

  const columns = [
    {
      key: "name",
      label: "User",
      sortable: true,
      render: (value: string, row: AdminUserResponse) => (
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
            value === "teacher" || value === "admin" || value === "super_admin"
              ? "bg-blue-100 text-blue-800"
              : "bg-green-100 text-green-800"
          }
        >
          {value.charAt(0).toUpperCase() + value.slice(1).replace("_", " ")}
        </Badge>
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
              : value === "suspended"
              ? "bg-red-100 text-red-800"
              : "bg-gray-100 text-gray-800"
          }
        >
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </Badge>
      ),
    },
    {
      key: "login_count",
      label: "Logins",
      sortable: true,
      render: (value: number) => (
        <span className="font-medium">{value.toLocaleString()}</span>
      ),
    },
    {
      key: "last_login",
      label: "Last Login",
      sortable: true,
      render: (value: string | null) =>
        value
          ? formatDistanceToNow(new Date(value), { addSuffix: true })
          : "Never",
    },
    {
      key: "created_at",
      label: "Created",
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
  ];

  const handleAdd = () => {
    setCreateForm({
      name: "",
      email: "",
      password: "",
      role: "student",
      status: "active",
    });
    setIsCreateDialogOpen(true);
  };

  const handleEdit = (user: AdminUserResponse) => {
    setSelectedUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (user: AdminUserResponse) => {
    if (
      window.confirm(
        `Are you sure you want to delete ${user.name}? This action cannot be undone.`
      )
    ) {
      deleteUserMutation.mutate(user.id);
    }
  };

  const handleView = (user: AdminUserResponse) => {
    setSelectedUser(user);
    setIsViewDialogOpen(true);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.name || !createForm.email || !createForm.password) {
      toast.error("Please fill in all required fields");
      return;
    }
    createUserMutation.mutate(createForm, {
      onSuccess: () => {
        setIsCreateDialogOpen(false);
        setCreateForm({
          name: "",
          email: "",
          password: "",
          role: "student",
          status: "active",
        });
      },
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !editForm.name || !editForm.email) {
      toast.error("Please fill in all required fields");
      return;
    }
    updateUserMutation.mutate(
      { userId: selectedUser.id, userData: editForm },
      {
        onSuccess: () => {
          setIsEditDialogOpen(false);
          setEditForm({});
        },
      }
    );
  };

  const handleResetUser = (user: AdminUserResponse) => {
    if (
      window.confirm(
        `Are you sure you want to reset ${user.name}'s progress?\n\nThis will:\n• Clear their selected exam\n• Delete all progress data\n• Reset their statistics\n• Force them to select an exam again\n\nThis action cannot be undone.`
      )
    ) {
      resetUserMutation.mutate(user.id);
    }
  };

  // Show error state if users fail to load
  if (usersError) {
    return (
      <AdminLayout
        title="User Management"
        description="Manage student and teacher accounts, view progress, and monitor platform usage."
      >
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Failed to load users. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="User Management"
      description="Manage student and teacher accounts, view progress, and monitor platform usage."
    >
      {usersLoading ? (
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
          currentPage={currentPage}
          pageSize={pageSize}
          totalCount={totalUsers}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          enableServerSidePagination={true}
          isLoading={usersLoading}
        />
      )}

      {/* Create User Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
            <DialogDescription>
              Add a new student or teacher to the platform.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., John Doe"
                  value={createForm.name}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john.doe@email.com"
                  value={createForm.email}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, email: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={createForm.password}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, password: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={createForm.role}
                  onValueChange={(value) =>
                    setCreateForm({
                      ...createForm,
                      role: value as "student" | "teacher" | "admin",
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="teacher">Teacher</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={createForm.status}
                onValueChange={(value) =>
                  setCreateForm({
                    ...createForm,
                    status: value as "active" | "inactive" | "suspended",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
                disabled={createUserMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-indigo-500 to-purple-600"
                disabled={createUserMutation.isPending}
              >
                {createUserMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create User
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information and settings.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Full Name</Label>
                  <Input
                    id="edit-name"
                    value={editForm.name || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={editForm.email || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, email: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-role">Role</Label>
                  <Select
                    value={editForm.role}
                    onValueChange={(value) =>
                      setEditForm({
                        ...editForm,
                        role: value as "student" | "teacher" | "admin",
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="teacher">Teacher</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select
                    value={editForm.status}
                    onValueChange={(value) =>
                      setEditForm({
                        ...editForm,
                        status: value as "active" | "inactive" | "suspended",
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-between items-center pt-4">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => handleResetUser(selectedUser)}
                  disabled={updateUserMutation.isPending || resetUserMutation.isPending}
                  className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                >
                  {resetUserMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset User
                </Button>
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditDialogOpen(false)}
                    disabled={updateUserMutation.isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-indigo-500 to-purple-600"
                    disabled={updateUserMutation.isPending}
                  >
                    {updateUserMutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Update User
                  </Button>
                </div>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* View User Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              Detailed information and progress for this user.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="flex-1 overflow-y-auto space-y-6 pr-2">
              {/* User Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span>User Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              {selectedUser.role === "student" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5" />
                      <span>Study Progress</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {progressLoading ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        {Array.from({ length: 4 }).map((_, index) => (
                          <div key={index} className="text-center space-y-2">
                            <Skeleton className="h-8 w-16 mx-auto" />
                            <Skeleton className="h-4 w-20 mx-auto" />
                          </div>
                        ))}
                      </div>
                    ) : userProgress && userProgress.length > 0 ? (
                      <div className="space-y-4">
                        {userProgress.map((progress, index) => (
                          <div key={index} className="border rounded-lg p-4">
                            <h4 className="font-medium mb-3">
                              {progress.exam_name}
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                              <div className="text-center">
                                <div className="text-2xl font-bold text-indigo-600 mb-1">
                                  {Math.round(progress.overall_progress)}%
                                </div>
                                <div className="text-sm text-gray-600">
                                  Overall Progress
                                </div>
                                <Progress
                                  value={progress.overall_progress}
                                  className="mt-2"
                                />
                              </div>
                              <div className="text-center">
                                <div className="text-2xl font-bold text-purple-600 mb-1">
                                  {progress.questions_solved.toLocaleString()}
                                </div>
                                <div className="text-sm text-gray-600">
                                  Questions Solved
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="text-2xl font-bold text-green-600 mb-1">
                                  {Math.round(progress.accuracy_rate)}%
                                </div>
                                <div className="text-sm text-gray-600">
                                  Accuracy Rate
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="text-2xl font-bold text-orange-600 mb-1">
                                  {Math.round(progress.study_time_hours)}h
                                </div>
                                <div className="text-sm text-gray-600">
                                  Study Time
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-gray-500">
                        No progress data available
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Additional Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-5 w-5" />
                    <span>Account Details</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        Member Since
                      </Label>
                      <p className="text-lg">
                        {new Date(selectedUser.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        Last Login
                      </Label>
                      <p className="text-lg">
                        {selectedUser.last_login
                          ? formatDistanceToNow(
                              new Date(selectedUser.last_login),
                              { addSuffix: true }
                            )
                          : "Never"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        Total Logins
                      </Label>
                      <p className="text-lg font-medium">
                        {selectedUser.login_count.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        Selected Exam
                      </Label>
                      <p className="text-lg">
                        {selectedUser.selected_exam_id ? "Yes" : "None"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminUsers;
