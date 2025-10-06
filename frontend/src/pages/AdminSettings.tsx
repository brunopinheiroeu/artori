import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import {
  Settings,
  Database,
  Mail,
  Shield,
  Globe,
  Palette,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import {
  useAdminSettings,
  useUpdateAdminSettingsCategory,
} from "@/hooks/useAdminApi";

interface SettingsState {
  general: {
    app_name: string;
    app_version: string;
    app_description: string;
    maintenance_mode: boolean;
  };
  database: {
    host: string;
    port: string;
    name: string;
    ssl_enabled: boolean;
  };
  email: {
    smtp_host: string;
    smtp_port: string;
    smtp_user: string;
    from_email: string;
    notifications_enabled: boolean;
  };
  security: {
    session_timeout: number;
    max_login_attempts: number;
    two_factor_enabled: boolean;
    password_complexity: boolean;
    audit_logging: boolean;
  };
  localization: {
    default_language: string;
    timezone: string;
    date_format: string;
    currency: string;
  };
  theme: {
    primary_color: string;
    secondary_color: string;
    dark_mode_default: boolean;
  };
}

const AdminSettings = () => {
  const [settings, setSettings] = useState<SettingsState>({
    general: {
      app_name: "Artori",
      app_version: "1.0.0",
      app_description: "AI-powered exam preparation platform",
      maintenance_mode: false,
    },
    database: {
      host: "localhost",
      port: "27017",
      name: "artori",
      ssl_enabled: true,
    },
    email: {
      smtp_host: "",
      smtp_port: "587",
      smtp_user: "",
      from_email: "noreply@artori.com",
      notifications_enabled: true,
    },
    security: {
      session_timeout: 60,
      max_login_attempts: 5,
      two_factor_enabled: false,
      password_complexity: true,
      audit_logging: true,
    },
    localization: {
      default_language: "English",
      timezone: "UTC",
      date_format: "MM/DD/YYYY",
      currency: "USD",
    },
    theme: {
      primary_color: "#6366f1",
      secondary_color: "#8b5cf6",
      dark_mode_default: false,
    },
  });

  // Load settings for each category
  const {
    data: generalSettings,
    isLoading: generalLoading,
    error: generalError,
  } = useAdminSettings("general");

  const {
    data: databaseSettings,
    isLoading: databaseLoading,
    error: databaseError,
  } = useAdminSettings("database");

  const {
    data: emailSettings,
    isLoading: emailLoading,
    error: emailError,
  } = useAdminSettings("email");

  const {
    data: securitySettings,
    isLoading: securityLoading,
    error: securityError,
  } = useAdminSettings("security");

  const {
    data: localizationSettings,
    isLoading: localizationLoading,
    error: localizationError,
  } = useAdminSettings("localization");

  const {
    data: themeSettings,
    isLoading: themeLoading,
    error: themeError,
  } = useAdminSettings("theme");

  const updateSettingsMutation = useUpdateAdminSettingsCategory();

  // Load settings from API when available
  useEffect(() => {
    if (generalSettings) {
      setSettings((prev) => ({
        ...prev,
        general: { ...prev.general, ...generalSettings },
      }));
    }
  }, [generalSettings]);

  useEffect(() => {
    if (databaseSettings) {
      setSettings((prev) => ({
        ...prev,
        database: { ...prev.database, ...databaseSettings },
      }));
    }
  }, [databaseSettings]);

  useEffect(() => {
    if (emailSettings) {
      setSettings((prev) => ({
        ...prev,
        email: { ...prev.email, ...emailSettings },
      }));
    }
  }, [emailSettings]);

  useEffect(() => {
    if (securitySettings) {
      setSettings((prev) => ({
        ...prev,
        security: { ...prev.security, ...securitySettings },
      }));
    }
  }, [securitySettings]);

  useEffect(() => {
    if (localizationSettings) {
      setSettings((prev) => ({
        ...prev,
        localization: { ...prev.localization, ...localizationSettings },
      }));
    }
  }, [localizationSettings]);

  useEffect(() => {
    if (themeSettings) {
      setSettings((prev) => ({
        ...prev,
        theme: { ...prev.theme, ...themeSettings },
      }));
    }
  }, [themeSettings]);

  const handleSave = (category: keyof SettingsState) => {
    const categorySettings = settings[category];
    updateSettingsMutation.mutate(
      { category, settings: categorySettings },
      {
        onSuccess: () => {
          toast.success(
            `${
              category.charAt(0).toUpperCase() + category.slice(1)
            } settings saved successfully`
          );
        },
        onError: (error) => {
          toast.error(`Failed to save ${category} settings: ${error.message}`);
        },
      }
    );
  };

  const updateSetting = (
    category: keyof SettingsState,
    key: string,
    value: unknown
  ) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
  };

  const settingsLoading =
    generalLoading ||
    databaseLoading ||
    emailLoading ||
    securityLoading ||
    localizationLoading ||
    themeLoading;
  const settingsError =
    generalError ||
    databaseError ||
    emailError ||
    securityError ||
    localizationError ||
    themeError;

  if (settingsError) {
    return (
      <AdminLayout
        title="Settings"
        description="Configure application settings and preferences."
      >
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Failed to load system settings. Using default values.
          </AlertDescription>
        </Alert>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Settings"
      description="Configure application settings and preferences."
    >
      <div className="space-y-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>General Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {settingsLoading ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-10 w-40" />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="app-name">Application Name</Label>
                    <Input
                      id="app-name"
                      value={settings.general.app_name}
                      onChange={(e) =>
                        updateSetting("general", "app_name", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="app-version">Version</Label>
                    <Input
                      id="app-version"
                      value={settings.general.app_version}
                      readOnly
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="app-description">Description</Label>
                  <Textarea
                    id="app-description"
                    value={settings.general.app_description}
                    onChange={(e) =>
                      updateSetting(
                        "general",
                        "app_description",
                        e.target.value
                      )
                    }
                    rows={3}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="maintenance-mode"
                    checked={settings.general.maintenance_mode}
                    onCheckedChange={(checked) =>
                      updateSetting("general", "maintenance_mode", checked)
                    }
                  />
                  <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
                </div>
                <Button
                  onClick={() => handleSave("general")}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600"
                  disabled={updateSettingsMutation.isPending}
                >
                  {updateSettingsMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Save General Settings
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Database Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5" />
              <span>Database Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {settingsLoading ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-10 w-40" />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="db-host">Database Host</Label>
                    <Input
                      id="db-host"
                      value={settings.database.host}
                      onChange={(e) =>
                        updateSetting("database", "host", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="db-port">Port</Label>
                    <Input
                      id="db-port"
                      value={settings.database.port}
                      onChange={(e) =>
                        updateSetting("database", "port", e.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="db-name">Database Name</Label>
                  <Input
                    id="db-name"
                    value={settings.database.name}
                    onChange={(e) =>
                      updateSetting("database", "name", e.target.value)
                    }
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="db-ssl"
                    checked={settings.database.ssl_enabled}
                    onCheckedChange={(checked) =>
                      updateSetting("database", "ssl_enabled", checked)
                    }
                  />
                  <Label htmlFor="db-ssl">Enable SSL</Label>
                </div>
                <Button
                  onClick={() => handleSave("database")}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600"
                  disabled={updateSettingsMutation.isPending}
                >
                  {updateSettingsMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Save Database Settings
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Email Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Mail className="h-5 w-5" />
              <span>Email Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {emailLoading ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-10 w-40" />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="smtp-host">SMTP Host</Label>
                    <Input
                      id="smtp-host"
                      value={settings.email.smtp_host}
                      onChange={(e) =>
                        updateSetting("email", "smtp_host", e.target.value)
                      }
                      placeholder="smtp.gmail.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtp-port">SMTP Port</Label>
                    <Input
                      id="smtp-port"
                      value={settings.email.smtp_port}
                      onChange={(e) =>
                        updateSetting("email", "smtp_port", e.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="smtp-user">SMTP Username</Label>
                    <Input
                      id="smtp-user"
                      value={settings.email.smtp_user}
                      onChange={(e) =>
                        updateSetting("email", "smtp_user", e.target.value)
                      }
                      placeholder="your-email@gmail.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="from-email">From Email</Label>
                    <Input
                      id="from-email"
                      value={settings.email.from_email}
                      onChange={(e) =>
                        updateSetting("email", "from_email", e.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="email-notifications"
                    checked={settings.email.notifications_enabled}
                    onCheckedChange={(checked) =>
                      updateSetting("email", "notifications_enabled", checked)
                    }
                  />
                  <Label htmlFor="email-notifications">
                    Enable Email Notifications
                  </Label>
                </div>
                <Button
                  onClick={() => handleSave("email")}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600"
                  disabled={updateSettingsMutation.isPending}
                >
                  {updateSettingsMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Save Email Settings
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Security Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {securityLoading ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-4">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-6 w-32" />
                </div>
                <Skeleton className="h-10 w-40" />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="session-timeout">
                      Session Timeout (minutes)
                    </Label>
                    <Input
                      id="session-timeout"
                      value={settings.security.session_timeout}
                      onChange={(e) =>
                        updateSetting(
                          "security",
                          "session_timeout",
                          parseInt(e.target.value) || 60
                        )
                      }
                      type="number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max-login-attempts">
                      Max Login Attempts
                    </Label>
                    <Input
                      id="max-login-attempts"
                      value={settings.security.max_login_attempts}
                      onChange={(e) =>
                        updateSetting(
                          "security",
                          "max_login_attempts",
                          parseInt(e.target.value) || 5
                        )
                      }
                      type="number"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="two-factor"
                      checked={settings.security.two_factor_enabled}
                      onCheckedChange={(checked) =>
                        updateSetting("security", "two_factor_enabled", checked)
                      }
                    />
                    <Label htmlFor="two-factor">
                      Enable Two-Factor Authentication
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="password-complexity"
                      checked={settings.security.password_complexity}
                      onCheckedChange={(checked) =>
                        updateSetting(
                          "security",
                          "password_complexity",
                          checked
                        )
                      }
                    />
                    <Label htmlFor="password-complexity">
                      Enforce Password Complexity
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="audit-logging"
                      checked={settings.security.audit_logging}
                      onCheckedChange={(checked) =>
                        updateSetting("security", "audit_logging", checked)
                      }
                    />
                    <Label htmlFor="audit-logging">Enable Audit Logging</Label>
                  </div>
                </div>
                <Button
                  onClick={() => handleSave("security")}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600"
                  disabled={updateSettingsMutation.isPending}
                >
                  {updateSettingsMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Save Security Settings
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Localization Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="h-5 w-5" />
              <span>Localization Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {localizationLoading ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <Skeleton className="h-10 w-40" />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="default-language">Default Language</Label>
                    <Input
                      id="default-language"
                      value={settings.localization.default_language}
                      onChange={(e) =>
                        updateSetting(
                          "localization",
                          "default_language",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Default Timezone</Label>
                    <Input
                      id="timezone"
                      value={settings.localization.timezone}
                      onChange={(e) =>
                        updateSetting(
                          "localization",
                          "timezone",
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date-format">Date Format</Label>
                    <Input
                      id="date-format"
                      value={settings.localization.date_format}
                      onChange={(e) =>
                        updateSetting(
                          "localization",
                          "date_format",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Input
                      id="currency"
                      value={settings.localization.currency}
                      onChange={(e) =>
                        updateSetting(
                          "localization",
                          "currency",
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>
                <Button
                  onClick={() => handleSave("localization")}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600"
                  disabled={updateSettingsMutation.isPending}
                >
                  {updateSettingsMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Save Localization Settings
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Theme Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Palette className="h-5 w-5" />
              <span>Theme Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {themeLoading ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-10 w-40" />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="primary-color">Primary Color</Label>
                    <Input
                      id="primary-color"
                      value={settings.theme.primary_color}
                      onChange={(e) =>
                        updateSetting("theme", "primary_color", e.target.value)
                      }
                      type="color"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="secondary-color">Secondary Color</Label>
                    <Input
                      id="secondary-color"
                      value={settings.theme.secondary_color}
                      onChange={(e) =>
                        updateSetting(
                          "theme",
                          "secondary_color",
                          e.target.value
                        )
                      }
                      type="color"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="dark-mode"
                    checked={settings.theme.dark_mode_default}
                    onCheckedChange={(checked) =>
                      updateSetting("theme", "dark_mode_default", checked)
                    }
                  />
                  <Label htmlFor="dark-mode">Enable Dark Mode by Default</Label>
                </div>
                <Button
                  onClick={() => handleSave("theme")}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600"
                  disabled={updateSettingsMutation.isPending}
                >
                  {updateSettingsMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Save Theme Settings
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
