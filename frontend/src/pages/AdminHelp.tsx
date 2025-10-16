import { useTranslation } from "react-i18next";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "@/hooks/use-toast";
import {
  HelpCircle,
  Search,
  BookOpen,
  MessageSquare,
  Phone,
  Mail,
  ExternalLink,
  FileText,
  Video,
  Users,
  Zap,
  Shield,
  Settings,
  Send,
} from "lucide-react";

const AdminHelp = () => {
  const { t } = useTranslation("admin");
  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: t("help.ticketSubmitted"),
      description: t("help.ticketSubmittedDescription"),
    });
  };

  const faqItems = [
    {
      question: "How do I add new exam types to the platform?",
      answer:
        "Navigate to Admin > Exams and click 'Create Exam'. Fill in the exam details including name, country, description, and subjects. You can then add questions to each subject.",
    },
    {
      question: "How can I monitor user activity and engagement?",
      answer:
        "Use the Analytics dashboard to view detailed metrics on user engagement, session times, and exam performance. You can also access individual user profiles from the Users section.",
    },
    {
      question: "What should I do if the system is running slowly?",
      answer:
        "Check the System Performance metrics in the main dashboard. If issues persist, contact support immediately. Common causes include high user load or database performance issues.",
    },
    {
      question: "How do I manage user permissions and roles?",
      answer:
        "In the Users section, you can edit individual user profiles to change their roles between Student, Teacher, and Admin. Each role has different access levels and capabilities.",
    },
    {
      question: "Can I export user data and analytics?",
      answer:
        "Yes, most data tables include export functionality. Look for the 'Export' button in the Analytics section and individual data tables to download CSV or PDF reports.",
    },
    {
      question: "How do I configure email notifications?",
      answer:
        "Go to Settings > Email Settings to configure SMTP settings and notification preferences. You can also manage individual notification settings in your Profile.",
    },
  ];

  const resources = [
    {
      title: "Admin User Guide",
      description: "Complete guide for platform administration",
      icon: BookOpen,
      type: "PDF",
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Video Tutorials",
      description: "Step-by-step video walkthroughs",
      icon: Video,
      type: "Video",
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "API Documentation",
      description: "Technical documentation for developers",
      icon: FileText,
      type: "Docs",
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Best Practices",
      description: "Recommended practices for optimal performance",
      icon: Zap,
      type: "Guide",
      color: "bg-orange-100 text-orange-600",
    },
    {
      title: "Security Guidelines",
      description: "Security best practices and compliance",
      icon: Shield,
      type: "PDF",
      color: "bg-red-100 text-red-600",
    },
    {
      title: "System Requirements",
      description: "Technical requirements and specifications",
      icon: Settings,
      type: "Docs",
      color: "bg-gray-100 text-gray-600",
    },
  ];

  const contactOptions = [
    {
      title: "Live Chat",
      description: "Get instant help from our support team",
      icon: MessageSquare,
      action: "Start Chat",
      available: true,
      color: "bg-green-500",
    },
    {
      title: "Phone Support",
      description: "Call us for urgent issues",
      icon: Phone,
      action: "+1 (555) 123-4567",
      available: true,
      color: "bg-blue-500",
    },
    {
      title: "Email Support",
      description: "Send us a detailed message",
      icon: Mail,
      action: "support@artori.app",
      available: true,
      color: "bg-purple-500",
    },
    {
      title: "Community Forum",
      description: "Connect with other admins",
      icon: Users,
      action: "Visit Forum",
      available: true,
      color: "bg-orange-500",
    },
  ];

  return (
    <AdminLayout title={t("help.title")} description={t("help.description")}>
      <div className="space-y-6">
        {/* Quick Search */}
        <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder={t("help.searchPlaceholder")}
                className="pl-12 h-12 text-lg bg-white/50 backdrop-blur-sm border-white/20"
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactOptions.map((option, index) => (
            <Card
              key={index}
              className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl hover:shadow-2xl transition-all cursor-pointer"
            >
              <CardContent className="p-6 text-center">
                <div
                  className={`w-12 h-12 mx-auto mb-4 rounded-full ${option.color} flex items-center justify-center`}
                >
                  <option.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">{option.title}</h3>
                <p className="text-sm text-gray-600 mb-4">
                  {option.description}
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  {option.action}
                </Button>
                {option.available && (
                  <Badge className="mt-2 bg-green-100 text-green-800">
                    {t("help.available247")}
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* FAQ Section */}
          <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <HelpCircle className="h-5 w-5" />
                <span>{t("help.faq")}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqItems.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {/* Submit Support Ticket */}
          <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5" />
                <span>{t("help.submitTicket")}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitTicket} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {t("help.subject")}
                  </label>
                  <Input placeholder={t("help.subjectPlaceholder")} required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {t("help.priority")}
                  </label>
                  <select className="w-full p-2 border rounded-md bg-white/50">
                    <option value="low">{t("help.priorityLow")}</option>
                    <option value="medium">{t("help.priorityMedium")}</option>
                    <option value="high">{t("help.priorityHigh")}</option>
                    <option value="urgent">{t("help.priorityUrgent")}</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {t("help.description")}
                  </label>
                  <Textarea
                    placeholder={t("help.descriptionPlaceholder")}
                    rows={4}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-600"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {t("help.submitTicketButton")}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Resources */}
        <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5" />
              <span>{t("help.resourcesDocumentation")}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {resources.map((resource, index) => (
                <div
                  key={index}
                  className="p-4 bg-white/40 rounded-lg border border-white/20 hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${resource.color}`}>
                      <resource.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium">{resource.title}</h4>
                        <Badge variant="outline" className="text-xs">
                          {resource.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {resource.description}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-0 h-auto text-indigo-600"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Open
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminHelp;
