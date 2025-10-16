import { useState } from "react";
import { useTranslation } from "react-i18next";
import TutorLayout from "@/components/TutorLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  User,
  Mail,
  GraduationCap,
  BookOpen,
  Globe,
  DollarSign,
  Calendar,
  Star,
  Save,
  Plus,
  X,
  AlertTriangle,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient, User as UserType, TutorProfileUpdate } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

const TutorProfile = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [newSubject, setNewSubject] = useState("");
  const [newQualification, setNewQualification] = useState("");
  const [newLanguage, setNewLanguage] = useState("");

  const {
    data: profile,
    isLoading: profileLoading,
    error: profileError,
  } = useQuery<UserType>({
    queryKey: ["tutorProfile"],
    queryFn: () => apiClient.getTutorProfile(),
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data: TutorProfileUpdate) =>
      apiClient.updateTutorProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tutorProfile"] });
      toast({
        title: t("tutor:profile.profileUpdated"),
        description: t("tutor:profile.profileUpdatedDescription"),
      });
      setIsEditing(false);
    },
    onError: (error: Error) => {
      toast({
        title: t("tutor:profile.updateFailed"),
        description:
          error.message || t("tutor:profile.updateFailedDescription"),
        variant: "destructive",
      });
    },
  });

  const [formData, setFormData] = useState<TutorProfileUpdate>({
    subjects: [],
    qualifications: [],
    bio: "",
    availability: {},
    hourly_rate: 0,
    experience_years: 0,
    languages: [],
  });

  // Initialize form data when profile loads
  useState(() => {
    if (profile?.tutor_data) {
      setFormData({
        subjects: profile.tutor_data.subjects || [],
        qualifications: profile.tutor_data.qualifications || [],
        bio: profile.tutor_data.bio || "",
        availability: profile.tutor_data.availability || {},
        hourly_rate: profile.tutor_data.hourly_rate || 0,
        experience_years: profile.tutor_data.experience_years || 0,
        languages: profile.tutor_data.languages || [],
      });
    }
  });

  const handleSave = () => {
    updateProfileMutation.mutate(formData);
  };

  const addSubject = () => {
    if (newSubject.trim() && !formData.subjects?.includes(newSubject.trim())) {
      setFormData({
        ...formData,
        subjects: [...(formData.subjects || []), newSubject.trim()],
      });
      setNewSubject("");
    }
  };

  const removeSubject = (subject: string) => {
    setFormData({
      ...formData,
      subjects: formData.subjects?.filter((s) => s !== subject) || [],
    });
  };

  const addQualification = () => {
    if (
      newQualification.trim() &&
      !formData.qualifications?.includes(newQualification.trim())
    ) {
      setFormData({
        ...formData,
        qualifications: [
          ...(formData.qualifications || []),
          newQualification.trim(),
        ],
      });
      setNewQualification("");
    }
  };

  const removeQualification = (qualification: string) => {
    setFormData({
      ...formData,
      qualifications:
        formData.qualifications?.filter((q) => q !== qualification) || [],
    });
  };

  const addLanguage = () => {
    if (
      newLanguage.trim() &&
      !formData.languages?.includes(newLanguage.trim())
    ) {
      setFormData({
        ...formData,
        languages: [...(formData.languages || []), newLanguage.trim()],
      });
      setNewLanguage("");
    }
  };

  const removeLanguage = (language: string) => {
    setFormData({
      ...formData,
      languages: formData.languages?.filter((l) => l !== language) || [],
    });
  };

  if (profileError) {
    return (
      <TutorLayout
        title={t("tutor:profile.title")}
        description={t("tutor:profile.description")}
      >
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{t("tutor:profile.failedToLoad")}</AlertDescription>
        </Alert>
      </TutorLayout>
    );
  }

  return (
    <TutorLayout
      title={t("tutor:profile.title")}
      description={t("tutor:profile.description")}
    >
      <div className="space-y-6">
        {/* Profile Header */}
        <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
          <CardContent className="p-6">
            {profileLoading ? (
              <div className="flex items-center space-x-4">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-64" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-4 rounded-full bg-emerald-100">
                    <User className="h-8 w-8 text-emerald-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {profile?.name}
                    </h2>
                    <p className="text-gray-600 flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      {profile?.email}
                    </p>
                    {profile?.tutor_data?.rating && (
                      <p className="text-gray-600 flex items-center mt-1">
                        <Star className="h-4 w-4 mr-2 text-yellow-500" />
                        {profile.tutor_data.rating.toFixed(1)} rating •{" "}
                        {profile.tutor_data.total_sessions} sessions
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  variant={isEditing ? "outline" : "default"}
                  className={
                    isEditing
                      ? ""
                      : "bg-gradient-to-r from-emerald-500 to-teal-600"
                  }
                >
                  {isEditing
                    ? t("tutor:profile.cancel")
                    : t("tutor:profile.editProfile")}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>{t("tutor:profile.basicInformation")}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {profileLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : (
                <>
                  <div>
                    <Label htmlFor="bio">{t("tutor:profile.bio")}</Label>
                    <Textarea
                      id="bio"
                      placeholder={t("tutor:profile.bioPlaceholder")}
                      value={
                        isEditing
                          ? formData.bio
                          : profile?.tutor_data?.bio || ""
                      }
                      onChange={(e) =>
                        setFormData({ ...formData, bio: e.target.value })
                      }
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="experience">
                        {t("tutor:profile.experienceYears")}
                      </Label>
                      <Input
                        id="experience"
                        type="number"
                        value={
                          isEditing
                            ? formData.experience_years
                            : profile?.tutor_data?.experience_years || 0
                        }
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            experience_years: parseInt(e.target.value) || 0,
                          })
                        }
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="rate">
                        {t("tutor:profile.hourlyRate")}
                      </Label>
                      <Input
                        id="rate"
                        type="number"
                        value={
                          isEditing
                            ? formData.hourly_rate
                            : profile?.tutor_data?.hourly_rate || 0
                        }
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            hourly_rate: parseFloat(e.target.value) || 0,
                          })
                        }
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Subjects */}
          <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5" />
                <span>{t("tutor:profile.subjects")}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {profileLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-6 w-28" />
                </div>
              ) : (
                <>
                  <div className="flex flex-wrap gap-2">
                    {(isEditing
                      ? formData.subjects
                      : profile?.tutor_data?.subjects || []
                    ).map((subject) => (
                      <Badge
                        key={subject}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {subject}
                        {isEditing && (
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => removeSubject(subject)}
                          />
                        )}
                      </Badge>
                    ))}
                  </div>
                  {isEditing && (
                    <div className="flex gap-2">
                      <Input
                        placeholder={t("tutor:profile.addSubjectPlaceholder")}
                        value={newSubject}
                        onChange={(e) => setNewSubject(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && addSubject()}
                      />
                      <Button onClick={addSubject} size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Qualifications */}
          <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <GraduationCap className="h-5 w-5" />
                <span>{t("tutor:profile.qualifications")}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {profileLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    {(isEditing
                      ? formData.qualifications
                      : profile?.tutor_data?.qualifications || []
                    ).map((qualification, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-white/40 rounded border border-white/20"
                      >
                        <span className="text-sm">{qualification}</span>
                        {isEditing && (
                          <X
                            className="h-4 w-4 cursor-pointer text-red-500"
                            onClick={() => removeQualification(qualification)}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                  {isEditing && (
                    <div className="flex gap-2">
                      <Input
                        placeholder={t(
                          "tutor:profile.addQualificationPlaceholder"
                        )}
                        value={newQualification}
                        onChange={(e) => setNewQualification(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === "Enter" && addQualification()
                        }
                      />
                      <Button onClick={addQualification} size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Languages */}
          <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="h-5 w-5" />
                <span>{t("tutor:profile.languages")}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {profileLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-24" />
                </div>
              ) : (
                <>
                  <div className="flex flex-wrap gap-2">
                    {(isEditing
                      ? formData.languages
                      : profile?.tutor_data?.languages || []
                    ).map((language) => (
                      <Badge
                        key={language}
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        {language}
                        {isEditing && (
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => removeLanguage(language)}
                          />
                        )}
                      </Badge>
                    ))}
                  </div>
                  {isEditing && (
                    <div className="flex gap-2">
                      <Input
                        placeholder={t("tutor:profile.addLanguagePlaceholder")}
                        value={newLanguage}
                        onChange={(e) => setNewLanguage(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && addLanguage()}
                      />
                      <Button onClick={addLanguage} size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Save Button */}
        {isEditing && (
          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              disabled={updateProfileMutation.isPending}
              className="bg-gradient-to-r from-emerald-500 to-teal-600"
            >
              <Save className="h-4 w-4 mr-2" />
              {updateProfileMutation.isPending
                ? t("tutor:profile.saving")
                : t("tutor:profile.saveChanges")}
            </Button>
          </div>
        )}
      </div>
    </TutorLayout>
  );
};

export default TutorProfile;
