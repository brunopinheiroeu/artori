import { useTranslation } from "react-i18next";
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
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import {
  useAdminProfile,
  useUpdateAdminProfile,
  useChangePassword,
  useAdminPreferences,
  useUpdateAdminPreferences,
} from "@/hooks/useAdminApi";
import { useState, useEffect } from "react";
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
  Save,
  Loader2,
} from "lucide-react";

interface ProfileFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  location?: string;
}

interface PasswordFormData {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

const AdminProfile = () => {
  const { t } = useTranslation("admin");
  const {
    data: profile,
    isLoading: profileLoading,
    error: profileError,
  } = useAdminProfile();
  const updateProfileMutation = useUpdateAdminProfile();
  const changePasswordMutation = useChangePassword();

  const [profileForm, setProfileForm] = useState<ProfileFormData>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    location: "",
  });

  const [passwordForm, setPasswordForm] = useState<PasswordFormData>({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const {
    data: preferences,
    isLoading: preferencesLoading,
    error: preferencesError,
  } = useAdminPreferences();

  const updatePreferencesMutation = useUpdateAdminPreferences();

  const [notificationSettings, setNotificationSettings] = useState({
    system_alerts: true,
    user_activity: true,
    weekly_reports: false,
    emergency_alerts: true,
    maintenance_updates: true,
    feature_updates: false,
    two_factor: false,
    login_alerts: true,
  });

  useEffect(() => {
    if (profile) {
      setProfileForm({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        location: profile.location || "",
      });
    }
  }, [profile]);

  useEffect(() => {
    if (preferences) {
      setNotificationSettings(preferences);
    }
  }, [preferences]);

  const handleProfileSave = async () => {
    try {
      await updateProfileMutation.mutateAsync(profileForm);
      toast({
        title: t("profile.profileUpdated"),
        description: t("profile.profileUpdatedDescription"),
      });
    } catch (error) {
      toast({
        title: t("common.error"),
        description: t("profile.failedToUpdateProfile"),
        variant: "destructive",
      });
    }
  };

  const handlePasswordChange = async () => {
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      toast({
        title: t("common.error"),
        description: t("profile.passwordsDoNotMatch"),
        variant: "destructive",
      });
      return;
    }

    if (passwordForm.new_password.length < 8) {
      toast({
        title: t("common.error"),
        description: t("profile.passwordTooShort"),
        variant: "destructive",
      });
      return;
    }

    try {
      await changePasswordMutation.mutateAsync({
        current_password: passwordForm.current_password,
        new_password: passwordForm.new_password,
      });
      toast({
        title: t("profile.passwordUpdated"),
        description: t("profile.passwordUpdatedDescription"),
      });
      setPasswordForm({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
    } catch (error) {
      toast({
        title: t("common.error"),
        description: t("profile.failedToChangePassword"),
        variant: "destructive",
      });
    }
  };

  const handleNotificationSave = async () => {
    try {
      await updatePreferencesMutation.mutateAsync(notificationSettings);
      toast({
        title: t("profile.preferencesSaved"),
        description: t("profile.preferencesSavedDescription"),
      });
    } catch (error) {
      toast({
        title: t("common.error"),
        description: t("profile.failedToSavePreferences"),
        variant: "destructive",
      });
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  };

  const formatLastLogin = (dateString: string) => {
    const now = new Date();
    const loginDate = new Date(dateString);
    const diffInHours = Math.floor(
      (now.getTime() - loginDate.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };

  if (profileLoading) {
    return (
      <AdminLayout
        title={t("profile.title")}
        description={t("profile.description")}
      >
        <div className="space-y-6">
          <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <div className="flex items-start space-x-6">
                <Skeleton className="h-24 w-24 rounded-full" />
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-8 w-64" />
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-36" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    );
  }

  if (profileError) {
    return (
      <AdminLayout
        title={t("profile.title")}
        description={t("profile.description")}
      >
        <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
          <CardContent className="p-6">
            <p className="text-center text-red-600">
              {t("profile.failedToLoadProfile")}
            </p>
          </CardContent>
        </Card>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title={t("profile.title")}
      description={t("profile.description")}
    >
      <div className="space-y-6">
        {/* Profile Overview Card */}
        <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>{t("profile.profileOverview")}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start space-x-6">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage
                    src={profile?.avatar}
                    alt={`${profile?.first_name} ${profile?.last_name}`}
                  />
                  <AvatarFallback className="text-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                    {profile
                      ? getInitials(
                          profile.first_name || "A",
                          profile.last_name || "U"
                        )
                      : "AU"}
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
                  <h3 className="text-2xl font-bold">
                    {profile?.first_name} {profile?.last_name}
                  </h3>
                  <Badge className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                    {profile?.role || "Admin"}
                  </Badge>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <span>{profile?.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Joined{" "}
                      {profile?.created_at
                        ? formatDate(profile.created_at)
                        : "Unknown"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4" />
                    <span>
                      Last login:{" "}
                      {profile?.last_login
                        ? formatLastLogin(profile.last_login)
                        : "Unknown"}
                    </span>
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
                <span>{t("profile.personalInformation")}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">{t("profile.firstName")}</Label>
                  <Input
                    id="firstName"
                    value={profileForm.first_name}
                    onChange={(e) =>
                      setProfileForm((prev) => ({
                        ...prev,
                        first_name: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">{t("profile.lastName")}</Label>
                  <Input
                    id="lastName"
                    value={profileForm.last_name}
                    onChange={(e) =>
                      setProfileForm((prev) => ({
                        ...prev,
                        last_name: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t("profile.emailAddress")}</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileForm.email}
                  onChange={(e) =>
                    setProfileForm((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">{t("profile.phoneNumber")}</Label>
                <Input
                  id="phone"
                  value={profileForm.phone || ""}
                  onChange={(e) =>
                    setProfileForm((prev) => ({
                      ...prev,
                      phone: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">{t("profile.location")}</Label>
                <Input
                  id="location"
                  value={profileForm.location || ""}
                  onChange={(e) =>
                    setProfileForm((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                />
              </div>
              <Button
                onClick={handleProfileSave}
                disabled={updateProfileMutation.isPending}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600"
              >
                {updateProfileMutation.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {t("profile.saveChanges")}
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
                <Input
                  id="currentPassword"
                  type="password"
                  placeholder="Enter current password"
                  value={passwordForm.current_password}
                  onChange={(e) =>
                    setPasswordForm((prev) => ({
                      ...prev,
                      current_password: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Enter new password"
                  value={passwordForm.new_password}
                  onChange={(e) =>
                    setPasswordForm((prev) => ({
                      ...prev,
                      new_password: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  value={passwordForm.confirm_password}
                  onChange={(e) =>
                    setPasswordForm((prev) => ({
                      ...prev,
                      confirm_password: e.target.value,
                    }))
                  }
                />
              </div>
              <Separator />
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="twoFactor">Two-Factor Authentication</Label>
                    <p className="text-sm text-gray-500">
                      Add an extra layer of security
                    </p>
                  </div>
                  <Switch
                    id="twoFactor"
                    checked={notificationSettings.two_factor}
                    onCheckedChange={(checked) =>
                      setNotificationSettings((prev) => ({
                        ...prev,
                        two_factor: checked,
                      }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="loginAlerts">Login Alerts</Label>
                    <p className="text-sm text-gray-500">
                      Get notified of new logins
                    </p>
                  </div>
                  <Switch
                    id="loginAlerts"
                    checked={notificationSettings.login_alerts}
                    onCheckedChange={(checked) =>
                      setNotificationSettings((prev) => ({
                        ...prev,
                        login_alerts: checked,
                      }))
                    }
                  />
                </div>
              </div>
              <Button
                onClick={handlePasswordChange}
                disabled={changePasswordMutation.isPending}
                className="w-full bg-gradient-to-r from-red-500 to-pink-600"
              >
                {changePasswordMutation.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Key className="h-4 w-4 mr-2" />
                )}
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
                      <p className="text-sm text-gray-500">
                        Critical system notifications
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.system_alerts}
                      onCheckedChange={(checked) =>
                        setNotificationSettings((prev) => ({
                          ...prev,
                          system_alerts: checked,
                        }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>User Activity</Label>
                      <p className="text-sm text-gray-500">
                        New user registrations and activity
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.user_activity}
                      onCheckedChange={(checked) =>
                        setNotificationSettings((prev) => ({
                          ...prev,
                          user_activity: checked,
                        }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Weekly Reports</Label>
                      <p className="text-sm text-gray-500">
                        Platform usage summaries
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.weekly_reports}
                      onCheckedChange={(checked) =>
                        setNotificationSettings((prev) => ({
                          ...prev,
                          weekly_reports: checked,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-medium">Push Notifications</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Emergency Alerts</Label>
                      <p className="text-sm text-gray-500">
                        Urgent system issues
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.emergency_alerts}
                      onCheckedChange={(checked) =>
                        setNotificationSettings((prev) => ({
                          ...prev,
                          emergency_alerts: checked,
                        }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Maintenance Updates</Label>
                      <p className="text-sm text-gray-500">
                        Scheduled maintenance notifications
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.maintenance_updates}
                      onCheckedChange={(checked) =>
                        setNotificationSettings((prev) => ({
                          ...prev,
                          maintenance_updates: checked,
                        }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Feature Updates</Label>
                      <p className="text-sm text-gray-500">
                        New feature announcements
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.feature_updates}
                      onCheckedChange={(checked) =>
                        setNotificationSettings((prev) => ({
                          ...prev,
                          feature_updates: checked,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <Button
                onClick={handleNotificationSave}
                disabled={updatePreferencesMutation.isPending}
                className="bg-gradient-to-r from-green-500 to-emerald-600"
              >
                {updatePreferencesMutation.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Bell className="h-4 w-4 mr-2" />
                )}
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
