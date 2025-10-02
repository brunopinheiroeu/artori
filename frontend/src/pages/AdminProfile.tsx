import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Shield, 
  Key,
  Bell,
  Camera,
  Save
} from "lucide-react";

const AdminProfile = () => {
  const handleSave = (section: string) => {
    toast({
      title: "Profile updated",
      description: `${section} information has been saved successfully.`,
    });
  };

  const adminData = {
    name: "Admin User",
    email: "admin@artori.app",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    role: "Super Admin",
    joinDate: "January 2024",
    lastLogin: "2 hours ago",
    avatar: "/placeholder-avatar.jpg"
  };

  return (
    <AdminLayout
      title="Profile Settings"
      description="Manage your admin account information and preferences."
    >
      <div className="space-y-6">
        {/* Profile Overview Card */}
        <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Profile Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start space-x-6">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={adminData.avatar} alt={adminData.name} />
                  <AvatarFallback className="text-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                    AU
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 p-0"
                  variant="outline"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-2xl font-bold">{adminData.name}</h3>
                  <Badge className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                    {adminData.role}
                  </Badge>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <span>{adminData.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {adminData.joinDate}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4" />
                    <span>Last login: {adminData.lastLogin}</span>
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
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" defaultValue="Admin" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" defaultValue="User" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" defaultValue={adminData.email} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" defaultValue={adminData.phone} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" defaultValue={adminData.location} />
              </div>
              <Button 
                onClick={() => handleSave("Personal")}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Security Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" placeholder="Enter current password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" placeholder="Enter new password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input id="confirmPassword" type="password" placeholder="Confirm new password" />
              </div>
              <Separator />
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="twoFactor">Two-Factor Authentication</Label>
                    <p className="text-sm text-gray-500">Add an extra layer of security</p>
                  </div>
                  <Switch id="twoFactor" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="loginAlerts">Login Alerts</Label>
                    <p className="text-sm text-gray-500">Get notified of new logins</p>
                  </div>
                  <Switch id="loginAlerts" defaultChecked />
                </div>
              </div>
              <Button 
                onClick={() => handleSave("Security")}
                className="w-full bg-gradient-to-r from-red-500 to-pink-600"
              >
                <Key className="h-4 w-4 mr-2" />
                Update Security
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Notification Preferences */}
        <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <span>Notification Preferences</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium">Email Notifications</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>System Alerts</Label>
                      <p className="text-sm text-gray-500">Critical system notifications</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>User Activity</Label>
                      <p className="text-sm text-gray-500">New user registrations and activity</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Weekly Reports</Label>
                      <p className="text-sm text-gray-500">Platform usage summaries</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-medium">Push Notifications</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Emergency Alerts</Label>
                      <p className="text-sm text-gray-500">Urgent system issues</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Maintenance Updates</Label>
                      <p className="text-sm text-gray-500">Scheduled maintenance notifications</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Feature Updates</Label>
                      <p className="text-sm text-gray-500">New feature announcements</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <Button 
                onClick={() => handleSave("Notifications")}
                className="bg-gradient-to-r from-green-500 to-emerald-600"
              >
                <Bell className="h-4 w-4 mr-2" />
                Save Preferences
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminProfile;