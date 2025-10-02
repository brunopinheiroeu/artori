import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { Settings, Database, Mail, Shield, Globe, Palette } from "lucide-react";

const AdminSettings = () => {
  const handleSave = (section: string) => {
    toast({
      title: "Settings saved",
      description: `${section} settings have been updated successfully.`,
    });
  };

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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="app-name">Application Name</Label>
                <Input id="app-name" defaultValue="Artori" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="app-version">Version</Label>
                <Input id="app-version" defaultValue="1.0.0" readOnly />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="app-description">Description</Label>
              <Textarea
                id="app-description"
                defaultValue="AI-powered exam preparation platform"
                rows={3}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="maintenance-mode" />
              <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
            </div>
            <Button
              onClick={() => handleSave("General")}
              className="bg-gradient-to-r from-indigo-500 to-purple-600"
            >
              Save General Settings
            </Button>
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="db-host">Database Host</Label>
                <Input id="db-host" defaultValue="localhost" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="db-port">Port</Label>
                <Input id="db-port" defaultValue="5432" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="db-name">Database Name</Label>
              <Input id="db-name" defaultValue="artori_db" />
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="db-ssl" defaultChecked />
              <Label htmlFor="db-ssl">Enable SSL</Label>
            </div>
            <Button
              onClick={() => handleSave("Database")}
              className="bg-gradient-to-r from-indigo-500 to-purple-600"
            >
              Save Database Settings
            </Button>
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="smtp-host">SMTP Host</Label>
                <Input id="smtp-host" placeholder="smtp.gmail.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtp-port">SMTP Port</Label>
                <Input id="smtp-port" defaultValue="587" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="smtp-user">SMTP Username</Label>
                <Input id="smtp-user" placeholder="your-email@gmail.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="from-email">From Email</Label>
                <Input id="from-email" placeholder="noreply@artori.com" />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="email-notifications" defaultChecked />
              <Label htmlFor="email-notifications">
                Enable Email Notifications
              </Label>
            </div>
            <Button
              onClick={() => handleSave("Email")}
              className="bg-gradient-to-r from-indigo-500 to-purple-600"
            >
              Save Email Settings
            </Button>
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="session-timeout">
                  Session Timeout (minutes)
                </Label>
                <Input id="session-timeout" defaultValue="60" type="number" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max-login-attempts">Max Login Attempts</Label>
                <Input id="max-login-attempts" defaultValue="5" type="number" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch id="two-factor" />
                <Label htmlFor="two-factor">
                  Enable Two-Factor Authentication
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="password-complexity" defaultChecked />
                <Label htmlFor="password-complexity">
                  Enforce Password Complexity
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="audit-logging" defaultChecked />
                <Label htmlFor="audit-logging">Enable Audit Logging</Label>
              </div>
            </div>
            <Button
              onClick={() => handleSave("Security")}
              className="bg-gradient-to-r from-indigo-500 to-purple-600"
            >
              Save Security Settings
            </Button>
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="default-language">Default Language</Label>
                <Input id="default-language" defaultValue="English" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Default Timezone</Label>
                <Input id="timezone" defaultValue="UTC" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date-format">Date Format</Label>
                <Input id="date-format" defaultValue="MM/DD/YYYY" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Input id="currency" defaultValue="USD" />
              </div>
            </div>
            <Button
              onClick={() => handleSave("Localization")}
              className="bg-gradient-to-r from-indigo-500 to-purple-600"
            >
              Save Localization Settings
            </Button>
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="primary-color">Primary Color</Label>
                <Input id="primary-color" defaultValue="#6366f1" type="color" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="secondary-color">Secondary Color</Label>
                <Input
                  id="secondary-color"
                  defaultValue="#8b5cf6"
                  type="color"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="dark-mode" />
              <Label htmlFor="dark-mode">Enable Dark Mode by Default</Label>
            </div>
            <Button
              onClick={() => handleSave("Theme")}
              className="bg-gradient-to-r from-indigo-500 to-purple-600"
            >
              Save Theme Settings
            </Button>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
