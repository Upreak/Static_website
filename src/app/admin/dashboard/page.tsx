"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  LayoutDashboard,
  FileText,
  Settings,
  MessageSquare,
  Users,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Eye,
  TrendingUp,
  BarChart3,
  Activity,
  Bell,
  Download
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState({
    totalPages: 0,
    publishedPages: 0,
    draftPages: 0,
    totalMessages: 0,
    newMessages: 0,
    totalAdmins: 0,
    activeAdmins: 0
  });

  const [recentPages, setRecentPages] = useState<any[]>([]);
  const [recentMessages, setRecentMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<any>({});
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState({ type: "", text: "" });
  const [settingsMessage, setSettingsMessage] = useState({ type: "", text: "" });
  
  // Individual section saving states
  const [isSavingContact, setIsSavingContact] = useState(false);
  const [isSavingFooter, setIsSavingFooter] = useState(false);
  const [isSavingSocial, setIsSavingSocial] = useState(false);
  const [isSavingGeneral, setIsSavingGeneral] = useState(false);
  
  // Individual section error states
  const [contactErrors, setContactErrors] = useState<Record<string, string>>({});
  const [footerErrors, setFooterErrors] = useState<Record<string, string>>({});
  const [socialErrors, setSocialErrors] = useState<Record<string, string>>({});
  const [generalErrors, setGeneralErrors] = useState<Record<string, string>>({});
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [replyText, setReplyText] = useState("");
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [replyMessage, setReplyMessage] = useState({ type: "", text: "" });

  // Check authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const user = localStorage.getItem("adminUser");
    
    if (!token || !user) {
      router.push("/admin/login");
    } else {
      fetchDashboardData();
    }
  }, [router]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // Fetch pages data
      const pagesResponse = await fetch("/api/admin/pages");
      const pagesData = await pagesResponse.json();
      
      if (pagesData.success) {
        const pages = pagesData.pages;
        const publishedPages = pages.filter((page: any) => page.status === "PUBLISHED").length;
        const draftPages = pages.filter((page: any) => page.status === "DRAFT").length;
        
        setRecentPages(pages.slice(0, 5).map((page: any) => ({
          id: page.id,
          title: page.title,
          slug: page.slug,
          status: page.status.toLowerCase(),
          lastModified: new Date(page.updatedAt).toLocaleDateString(),
          author: page.creator?.name || "Unknown"
        })));
        
        setStats(prev => ({
          ...prev,
          totalPages: pages.length,
          publishedPages,
          draftPages
        }));
      }

      // Fetch messages data
      const messagesResponse = await fetch("/api/admin/messages");
      const messagesData = await messagesResponse.json();
      
      if (messagesData.success) {
        const messages = messagesData.messages || [];
        const newMessages = messages.filter((msg: any) => msg.status === "NEW").length;
        
        setRecentMessages(messages.slice(0, 5).map((msg: any) => ({
          id: msg.id,
          name: msg.name,
          email: msg.email,
          message: msg.message,
          status: msg.status.toLowerCase(),
          timestamp: new Date(msg.createdAt).toLocaleString()
        })));
        
        setStats(prev => ({
          ...prev,
          totalMessages: messages.length,
          newMessages
        }));
      }

      // Fetch settings data
      const settingsResponse = await fetch("/api/admin/settings");
      const settingsData = await settingsResponse.json();
      
      if (settingsData.success) {
        setSettings(settingsData.settings || {});
      }

      // Set some default stats for admins
      setStats(prev => ({
        ...prev,
        totalAdmins: 3,
        activeAdmins: 2
      }));

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      // Set default data on error
      setRecentPages([
        { id: "1", title: "Homepage", slug: "home", status: "published", lastModified: "2024-01-15", author: "Admin" },
        { id: "2", title: "About Us", slug: "about", status: "published", lastModified: "2024-01-14", author: "Admin" },
        { id: "3", title: "Services", slug: "services", status: "published", lastModified: "2024-01-13", author: "Admin" }
      ]);
      
      setRecentMessages([
        { id: "1", name: "John Doe", email: "john@example.com", message: "Looking for IT recruitment services", status: "new", timestamp: "2024-01-15 10:30" },
        { id: "2", name: "Jane Smith", email: "jane@company.com", message: "Need healthcare staffing solutions", status: "new", timestamp: "2024-01-15 09:15" }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setIsSavingSettings(true);
    setSettingsMessage({ type: "", text: "" });

    try {
      const user = localStorage.getItem("adminUser");
      const adminUser = user ? JSON.parse(user) : null;
      
      if (!adminUser) {
        setSettingsMessage({ type: "error", text: "User not authenticated" });
        return;
      }

      // Get form values
      const siteTitle = (document.getElementById('site_title') as HTMLInputElement)?.value || settings.site_name?.value || "Upreak";
      const siteDescription = (document.getElementById('site_description') as HTMLTextAreaElement)?.value || settings.site_description?.value || "Talent-Sourcing Solutions Partnering to Deliver Exceptional Talent";
      const contactEmail = (document.getElementById('contact_email') as HTMLInputElement)?.value || settings.contact_email?.value || "";
      const contactPhone = (document.getElementById('contact_phone') as HTMLInputElement)?.value || settings.contact_phone?.value || "";
      const contactAddress = (document.getElementById('contact_address') as HTMLTextAreaElement)?.value || settings.contact_address?.value || "";
      const contactHours = (document.getElementById('contact_hours') as HTMLTextAreaElement)?.value || settings.contact_hours?.value || "";
      const contactDescription = (document.getElementById('contact_description') as HTMLTextAreaElement)?.value || settings.contact_description?.value || "";
      const footerAddress = (document.getElementById('footer_address') as HTMLTextAreaElement)?.value || settings.footer_address?.value || "";
      const getInTouchContent = (document.getElementById('get_in_touch_content') as HTMLTextAreaElement)?.value || settings.footer_get_in_touch?.value || "Get in touch with us for your recruitment needs.";
      const copyrightText = (document.getElementById('copyright_text') as HTMLInputElement)?.value || settings.footer_copyright?.value || "© {year} Upreak. All rights reserved.";
      const facebookUrl = (document.getElementById('facebook_url') as HTMLInputElement)?.value || settings.social_facebook?.value || "";
      const twitterUrl = (document.getElementById('twitter_url') as HTMLInputElement)?.value || settings.social_twitter?.value || "";
      const linkedinUrl = (document.getElementById('linkedin_url') as HTMLInputElement)?.value || settings.social_linkedin?.value || "";
      const instagramUrl = (document.getElementById('instagram_url') as HTMLInputElement)?.value || settings.social_instagram?.value || "";

      const response = await fetch("/api/admin/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          settings: {
            site_name: {
              value: siteTitle,
              type: "STRING"
            },
            site_description: {
              value: siteDescription,
              type: "STRING"
            },
            contact_email: {
              value: contactEmail,
              type: "STRING"
            },
            contact_phone: {
              value: contactPhone,
              type: "STRING"
            },
            contact_address: {
              value: contactAddress,
              type: "STRING"
            },
            contact_hours: {
              value: contactHours,
              type: "STRING"
            },
            contact_description: {
              value: contactDescription,
              type: "STRING"
            },
            footer_address: {
              value: footerAddress,
              type: "STRING"
            },
            footer_get_in_touch: {
              value: getInTouchContent,
              type: "STRING"
            },
            footer_copyright: {
              value: copyrightText,
              type: "STRING"
            },
            social_facebook: {
              value: facebookUrl,
              type: "STRING"
            },
            social_twitter: {
              value: twitterUrl,
              type: "STRING"
            },
            social_linkedin: {
              value: linkedinUrl,
              type: "STRING"
            },
            social_instagram: {
              value: instagramUrl,
              type: "STRING"
            },
            site_logo: {
              value: settings.site_logo?.value || "",
              type: "STRING"
            },
            site_favicon: {
              value: settings.site_favicon?.value || "",
              type: "STRING"
            }
          },
          updatedBy: adminUser.id
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSettingsMessage({ type: "success", text: "Settings saved successfully!" });
        // Refresh settings data
        fetchDashboardData();
      } else {
        setSettingsMessage({ type: "error", text: data.error || "Failed to save settings" });
      }
    } catch (error) {
      setSettingsMessage({ type: "error", text: "An error occurred while saving settings" });
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Individual section save functions
  const handleSaveContact = async () => {
    setIsSavingContact(true);
    setContactErrors({});
    setSettingsMessage({ type: "", text: "" });

    try {
      const user = localStorage.getItem("adminUser");
      const adminUser = user ? JSON.parse(user) : null;
      
      if (!adminUser) {
        setSettingsMessage({ type: "error", text: "User not authenticated" });
        return;
      }

      // Get form values
      const contactEmail = (document.getElementById('contact_email') as HTMLInputElement)?.value || settings.contact_email?.value || "";
      const contactPhone = (document.getElementById('contact_phone') as HTMLInputElement)?.value || settings.contact_phone?.value || "";
      const contactAddress = (document.getElementById('contact_address') as HTMLTextAreaElement)?.value || settings.contact_address?.value || "";
      const contactHours = (document.getElementById('contact_hours') as HTMLTextAreaElement)?.value || settings.contact_hours?.value || "";
      const contactDescription = (document.getElementById('contact_description') as HTMLTextAreaElement)?.value || settings.contact_description?.value || "";

      // Frontend validation
      const errors: Record<string, string> = {};
      
      if (!contactEmail) {
        errors.contact_email = "Contact email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
        errors.contact_email = "Invalid email format";
      }
      
      if (!contactPhone) {
        errors.contact_phone = "Contact phone is required";
      } else if (!/^(\+?\d{1,3}[- ]?)?\d{10,15}$/.test(contactPhone)) {
        errors.contact_phone = "Please enter a valid phone number (+91 format or local numbers)";
      }
      
      if (!contactAddress) {
        errors.contact_address = "Address is required";
      }
      
      if (!contactHours) {
        errors.contact_hours = "Office hours are required";
      } else {
        try {
          const hours = JSON.parse(contactHours);
          if (!Array.isArray(hours) || hours.length === 0) {
            errors.contact_hours = "Office hours must be a non-empty array";
          } else {
            for (let i = 0; i < hours.length; i++) {
              const hour = hours[i];
              if (!hour.day || !hour.hours) {
                errors.contact_hours = `Each item must have 'day' and 'hours' fields (index ${i})`;
                break;
              }
            }
          }
        } catch {
          errors.contact_hours = "Invalid JSON format in Office Hours";
        }
      }
      
      if (!contactDescription) {
        errors.contact_description = "Description is required";
      }

      if (Object.keys(errors).length > 0) {
        setContactErrors(errors);
        return;
      }

      const response = await fetch("/api/admin/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          settings: {
            contact_email: {
              value: contactEmail,
              type: "STRING"
            },
            contact_phone: {
              value: contactPhone,
              type: "STRING"
            },
            contact_address: {
              value: contactAddress,
              type: "STRING"
            },
            contact_hours: {
              value: contactHours,
              type: "STRING"
            },
            contact_description: {
              value: contactDescription,
              type: "STRING"
            }
          },
          updatedBy: adminUser.id
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSettingsMessage({ type: "success", text: "Contact Information saved successfully!" });
        // Refresh settings data
        fetchDashboardData();
      } else {
        if (data.details) {
          const errorMap: Record<string, string> = {};
          data.details.forEach((detail: any) => {
            errorMap[detail.field] = detail.message;
          });
          setContactErrors(errorMap);
        } else {
          setSettingsMessage({ type: "error", text: data.error || "Failed to save contact information" });
        }
      }
    } catch (error) {
      setSettingsMessage({ type: "error", text: "An error occurred while saving contact information" });
    } finally {
      setIsSavingContact(false);
    }
  };

  const handleSaveFooter = async () => {
    setIsSavingFooter(true);
    setFooterErrors({});
    setSettingsMessage({ type: "", text: "" });

    try {
      const user = localStorage.getItem("adminUser");
      const adminUser = user ? JSON.parse(user) : null;
      
      if (!adminUser) {
        setSettingsMessage({ type: "error", text: "User not authenticated" });
        return;
      }

      // Get form values
      const footerAddress = (document.getElementById('footer_address') as HTMLTextAreaElement)?.value || settings.footer_address?.value || "";
      const getInTouchContent = (document.getElementById('get_in_touch_content') as HTMLTextAreaElement)?.value || settings.footer_get_in_touch?.value || "Get in touch with us for your recruitment needs.";
      const copyrightText = (document.getElementById('copyright_text') as HTMLInputElement)?.value || settings.footer_copyright?.value || "© {year} Upreak. All rights reserved.";

      const response = await fetch("/api/admin/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          settings: {
            footer_address: {
              value: footerAddress,
              type: "STRING"
            },
            footer_get_in_touch: {
              value: getInTouchContent,
              type: "STRING"
            },
            footer_copyright: {
              value: copyrightText,
              type: "STRING"
            }
          },
          updatedBy: adminUser.id
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSettingsMessage({ type: "success", text: "Footer Settings saved successfully!" });
        // Refresh settings data
        fetchDashboardData();
      } else {
        if (data.details) {
          const errorMap: Record<string, string> = {};
          data.details.forEach((detail: any) => {
            errorMap[detail.field] = detail.message;
          });
          setFooterErrors(errorMap);
        } else {
          setSettingsMessage({ type: "error", text: data.error || "Failed to save footer settings" });
        }
      }
    } catch (error) {
      setSettingsMessage({ type: "error", text: "An error occurred while saving footer settings" });
    } finally {
      setIsSavingFooter(false);
    }
  };

  const handleSaveSocial = async () => {
    setIsSavingSocial(true);
    setSocialErrors({});
    setSettingsMessage({ type: "", text: "" });

    try {
      const user = localStorage.getItem("adminUser");
      const adminUser = user ? JSON.parse(user) : null;
      
      if (!adminUser) {
        setSettingsMessage({ type: "error", text: "User not authenticated" });
        return;
      }

      // Get form values
      const facebookUrl = (document.getElementById('facebook_url') as HTMLInputElement)?.value || settings.social_facebook?.value || "";
      const twitterUrl = (document.getElementById('twitter_url') as HTMLInputElement)?.value || settings.social_twitter?.value || "";
      const linkedinUrl = (document.getElementById('linkedin_url') as HTMLInputElement)?.value || settings.social_linkedin?.value || "";
      const instagramUrl = (document.getElementById('instagram_url') as HTMLInputElement)?.value || settings.social_instagram?.value || "";

      // Frontend validation
      const errors: Record<string, string> = {};
      
      if (facebookUrl && !/^https?:\/\/(www\.)?facebook\.com\/.+/i.test(facebookUrl)) {
        errors.facebook_url = "Facebook URL must contain facebook.com";
      }
      
      if (twitterUrl && !/^https?:\/\/(www\.)?twitter\.com\/.+/i.test(twitterUrl)) {
        errors.twitter_url = "Twitter URL must contain twitter.com";
      }
      
      if (linkedinUrl && !/^https?:\/\/(www\.)?linkedin\.com\/(company|in|pub)\/.+/i.test(linkedinUrl)) {
        errors.linkedin_url = "LinkedIn URL must contain linkedin.com";
      }
      
      if (instagramUrl && !/^https?:\/\/(www\.)?instagram\.com\/.+/i.test(instagramUrl)) {
        errors.instagram_url = "Instagram URL must contain instagram.com";
      }

      if (Object.keys(errors).length > 0) {
        setSocialErrors(errors);
        return;
      }

      const response = await fetch("/api/admin/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          settings: {
            social_facebook: {
              value: facebookUrl,
              type: "STRING"
            },
            social_twitter: {
              value: twitterUrl,
              type: "STRING"
            },
            social_linkedin: {
              value: linkedinUrl,
              type: "STRING"
            },
            social_instagram: {
              value: instagramUrl,
              type: "STRING"
            }
          },
          updatedBy: adminUser.id
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSettingsMessage({ type: "success", text: "Social Media Links saved successfully!" });
        // Refresh settings data
        fetchDashboardData();
      } else {
        if (data.details) {
          const errorMap: Record<string, string> = {};
          data.details.forEach((detail: any) => {
            errorMap[detail.field] = detail.message;
          });
          setSocialErrors(errorMap);
        } else {
          setSettingsMessage({ type: "error", text: data.error || "Failed to save social media links" });
        }
      }
    } catch (error) {
      setSettingsMessage({ type: "error", text: "An error occurred while saving social media links" });
    } finally {
      setIsSavingSocial(false);
    }
  };

  const handleSaveGeneral = async () => {
    setIsSavingGeneral(true);
    setGeneralErrors({});
    setSettingsMessage({ type: "", text: "" });

    try {
      const user = localStorage.getItem("adminUser");
      const adminUser = user ? JSON.parse(user) : null;
      
      if (!adminUser) {
        setSettingsMessage({ type: "error", text: "User not authenticated" });
        return;
      }

      // Get form values
      const siteTitle = (document.getElementById('site_title') as HTMLInputElement)?.value || settings.site_name?.value || "Upreak";
      const siteDescription = (document.getElementById('site_description') as HTMLTextAreaElement)?.value || settings.site_description?.value || "Talent-Sourcing Solutions Partnering to Deliver Exceptional Talent";
      const contactEmail = (document.getElementById('contact_email') as HTMLInputElement)?.value || settings.contact_email?.value || "";

      const response = await fetch("/api/admin/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          settings: {
            site_name: {
              value: siteTitle,
              type: "STRING"
            },
            site_description: {
              value: siteDescription,
              type: "STRING"
            },
            contact_email: {
              value: contactEmail,
              type: "STRING"
            }
          },
          updatedBy: adminUser.id
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSettingsMessage({ type: "success", text: "General Settings saved successfully!" });
        // Refresh settings data
        fetchDashboardData();
      } else {
        if (data.details) {
          const errorMap: Record<string, string> = {};
          data.details.forEach((detail: any) => {
            errorMap[detail.field] = detail.message;
          });
          setGeneralErrors(errorMap);
        } else {
          setSettingsMessage({ type: "error", text: data.error || "Failed to save general settings" });
        }
      }
    } catch (error) {
      setSettingsMessage({ type: "error", text: "An error occurred while saving general settings" });
    } finally {
      setIsSavingGeneral(false);
    }
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    await handleFileUpload(event, "logo");
  };

  const handleFaviconUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    await handleFileUpload(event, "favicon");
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: "logo" | "favicon") => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log(`[File Upload] Starting ${type} upload:`, file.name, file.type, file.size);

    setIsUploading(true);
    setUploadMessage({ type: "", text: "" });

    try {
      const user = localStorage.getItem("adminUser");
      const adminUser = user ? JSON.parse(user) : null;
      
      if (!adminUser) {
        setUploadMessage({ type: "error", text: "User not authenticated" });
        return;
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);
      formData.append("updatedBy", adminUser.id);

      console.log(`[File Upload] Sending ${type} upload request`);

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        console.log(`[File Upload] ${type} upload successful:`, data);
        setUploadMessage({ type: "success", text: `${type.charAt(0).toUpperCase() + type.slice(1)} uploaded successfully!` });
        
        // Refresh settings to show the new logo/favicon
        fetchDashboardData();
        
        // Reset the file input
        event.target.value = "";
      } else {
        console.error(`[File Upload] ${type} upload failed:`, data.error);
        setUploadMessage({ type: "error", text: data.error || `Failed to upload ${type}` });
      }
    } catch (error) {
      console.error(`[File Upload] Error uploading ${type}:`, error);
      setUploadMessage({ type: "error", text: `An error occurred while uploading ${type}` });
    } finally {
      setIsUploading(false);
    }
  };

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    // Redirect to login page
    router.push("/admin/login");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge className="bg-green-100 text-green-800">Published</Badge>;
      case "draft":
        return <Badge className="bg-yellow-100 text-yellow-800">Draft</Badge>;
      case "new":
        return <Badge className="bg-red-100 text-red-800">New</Badge>;
      case "read":
        return <Badge className="bg-blue-100 text-blue-800">Read</Badge>;
      case "responded":
        return <Badge className="bg-green-100 text-green-800">Responded</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pages</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPages}</div>
            <p className="text-xs text-muted-foreground">
              {stats.publishedPages} published, {stats.draftPages} drafts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMessages}</div>
            <p className="text-xs text-muted-foreground">
              {stats.newMessages} new messages
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admin Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAdmins}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeAdmins} active now
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activity</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              +12% from last week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Pages and Messages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Pages */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Recent Pages</CardTitle>
                <CardDescription>Latest page updates</CardDescription>
              </div>
              <Link href="/admin/pages/create">
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  New Page
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPages.map((page) => (
                <div key={page.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{page.title}</h4>
                    <p className="text-sm text-gray-600">/{page.slug}</p>
                    <p className="text-xs text-gray-500">Modified by {page.author} on {page.lastModified}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(page.status)}
                    <div className="flex space-x-1">
                      <Button size="sm" variant="ghost">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Link href={`/admin/pages/edit/${page.id}`}>
                        <Button size="sm" variant="ghost">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Messages */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Recent Messages</CardTitle>
                <CardDescription>Latest contact form submissions</CardDescription>
              </div>
              <Badge variant="destructive" className="flex items-center space-x-1">
                <Bell className="w-3 h-3" />
                <span>{stats.newMessages} New</span>
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentMessages.map((message) => (
                <div key={message.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{message.name}</h4>
                    <p className="text-sm text-gray-600">{message.email}</p>
                    <p className="text-xs text-gray-500 truncate">{message.message}</p>
                    <p className="text-xs text-gray-400">{message.timestamp}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(message.status)}
                    <Button size="sm" variant="ghost">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderPages = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Pages</h2>
          <p className="text-gray-600">Manage your website content</p>
        </div>
        <Link href="/admin/pages/create">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create New Page
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Pages</CardTitle>
          <CardDescription>List of all pages on your website</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentPages.map((page) => (
              <div key={page.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h3 className="font-semibold">{page.title}</h3>
                  <p className="text-sm text-gray-600">/{page.slug}</p>
                  <p className="text-xs text-gray-500">
                    Last modified: {page.lastModified} by {page.author}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  {getStatusBadge(page.status)}
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Link href={`/admin/pages/edit/${page.id}`}>
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    </Link>
                    <Button size="sm" variant="outline">
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const handleDownloadCSV = async () => {
    try {
      console.log('[Admin Dashboard] Downloading messages as CSV');
      const response = await fetch("/api/admin/messages?download=csv");
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `messages_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        console.log('[Admin Dashboard] CSV download completed');
      } else {
        console.error('[Admin Dashboard] Failed to download CSV');
      }
    } catch (error) {
      console.error('[Admin Dashboard] Error downloading CSV:', error);
    }
  };

  const handleViewMessage = (message: any) => {
    console.log('[Admin Dashboard] Viewing message:', message.id);
    setSelectedMessage(message);
    setReplyText("");
    setReplyMessage({ type: "", text: "" });
    
    // Mark message as read if it's new
    if (message.status === "new") {
      updateMessageStatus(message.id, "READ");
    }
  };

  const handleSendReply = async () => {
    if (!selectedMessage || !replyText.trim()) return;
    
    setIsSendingReply(true);
    setReplyMessage({ type: "", text: "" });
    
    try {
      const user = localStorage.getItem("adminUser");
      const adminUser = user ? JSON.parse(user) : null;
      
      if (!adminUser) {
        setReplyMessage({ type: "error", text: "User not authenticated" });
        return;
      }
      
      console.log('[Admin Dashboard] Sending reply to message:', selectedMessage.id);
      
      const response = await fetch("/api/admin/messages", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: selectedMessage.id,
          status: "RESPONDED",
          reply: replyText,
          repliedBy: adminUser.id
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        console.log('[Admin Dashboard] Reply sent successfully');
        setReplyMessage({ type: "success", text: "Reply sent successfully!" });
        
        // Update the selected message with the reply
        setSelectedMessage({
          ...selectedMessage,
          response: replyText,
          respondedAt: new Date().toISOString(),
          status: "responded",
          handler: { name: adminUser.name }
        });
        
        // Refresh messages list
        fetchDashboardData();
      } else {
        console.error('[Admin Dashboard] Failed to send reply:', data.error);
        setReplyMessage({ type: "error", text: data.error || "Failed to send reply" });
      }
    } catch (error) {
      console.error('[Admin Dashboard] Error sending reply:', error);
      setReplyMessage({ type: "error", text: "An error occurred while sending reply" });
    } finally {
      setIsSendingReply(false);
    }
  };

  const updateMessageStatus = async (messageId: string, status: string) => {
    try {
      console.log(`[Admin Dashboard] Updating message ${messageId} status to ${status}`);
      
      const response = await fetch("/api/admin/messages", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: messageId,
          status
        }),
      });
      
      if (response.ok) {
        console.log(`[Admin Dashboard] Message ${messageId} status updated to ${status}`);
        // Refresh messages list
        fetchDashboardData();
      } else {
        console.error(`[Admin Dashboard] Failed to update message ${messageId} status`);
      }
    } catch (error) {
      console.error(`[Admin Dashboard] Error updating message ${messageId} status:`, error);
    }
  };

  const renderMessages = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Messages</h2>
          <p className="text-gray-600">Manage contact form submissions</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="destructive" className="flex items-center space-x-1">
            <Bell className="w-3 h-3" />
            <span>{stats.newMessages} New</span>
          </Badge>
          <Button variant="outline" onClick={handleDownloadCSV}>
            <Download className="w-4 h-4 mr-2" />
            Download CSV
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>All Messages</CardTitle>
              <CardDescription>Contact form submissions and inquiries</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedMessage?.id === message.id ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"
                    }`}
                    onClick={() => handleViewMessage(message)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-semibold">{message.name}</h3>
                        {getStatusBadge(message.status)}
                      </div>
                      <p className="text-sm text-gray-600">{message.email}</p>
                      <p className="text-sm text-gray-700 mt-2 truncate">{message.message}</p>
                      <p className="text-xs text-gray-500 mt-2">{message.timestamp}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewMessage(message);
                        }}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Message Detail & Reply */}
        <div className="lg:col-span-1">
          {selectedMessage ? (
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle className="text-lg">Message Details</CardTitle>
                <div className="flex items-center space-x-2">
                  {getStatusBadge(selectedMessage.status)}
                  <span className="text-sm text-gray-500">{selectedMessage.timestamp}</span>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900">From:</h4>
                  <p className="text-sm font-medium">{selectedMessage.name}</p>
                  <p className="text-sm text-gray-600">{selectedMessage.email}</p>
                  {selectedMessage.phone && (
                    <p className="text-sm text-gray-600">{selectedMessage.phone}</p>
                  )}
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">Message:</h4>
                  <p className="text-sm text-gray-700 mt-1">{selectedMessage.message}</p>
                </div>

                {selectedMessage.response && (
                  <div>
                    <h4 className="font-medium text-gray-900">Reply:</h4>
                    <p className="text-sm text-gray-700 mt-1">{selectedMessage.response}</p>
                    {selectedMessage.respondedAt && (
                      <p className="text-xs text-gray-500 mt-1">
                        Replied on {new Date(selectedMessage.respondedAt).toLocaleString()}
                        {selectedMessage.handler && ` by ${selectedMessage.handler.name}`}
                      </p>
                    )}
                  </div>
                )}

                <div className="mt-auto pt-4 border-t">
                  <h4 className="font-medium text-gray-900 mb-2">Send Reply:</h4>
                  
                  {replyMessage.text && (
                    <div className={`mb-3 p-3 rounded-lg text-sm ${
                      replyMessage.type === "success"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                      {replyMessage.text}
                    </div>
                  )}
                  
                  <Textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your reply..."
                    rows={4}
                    className="w-full mb-3"
                  />
                  
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={handleSendReply}
                      disabled={!replyText.trim() || isSendingReply}
                      className="flex-1"
                    >
                      {isSendingReply ? "Sending..." : "Send Reply"}
                    </Button>
                    
                    <select
                      value={selectedMessage.status.toUpperCase()}
                      onChange={(e) => updateMessageStatus(selectedMessage.id, e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="NEW">New</option>
                      <option value="READ">Read</option>
                      <option value="RESPONDED">Responded</option>
                      <option value="CLOSED">Closed</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <CardContent className="text-center">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Select a message to view details and reply</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-gray-600">Configure your website settings</p>
      </div>

      {settingsMessage.text && (
        <div className={`p-4 rounded-lg ${settingsMessage.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          {settingsMessage.text}
        </div>
      )}

      {uploadMessage.text && (
        <div className={`p-4 rounded-lg ${uploadMessage.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          {uploadMessage.text}
        </div>
      )}

      {/* Contact Settings */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Contact Information</h3>
          <Button
            onClick={handleSaveContact}
            disabled={isSavingContact}
            size="sm"
          >
            {isSavingContact ? "Saving..." : "Save Contact"}
          </Button>
        </div>
        
        {/* Contact Errors */}
        {Object.keys(contactErrors).length > 0 && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <h4 className="text-sm font-medium text-red-800 mb-2">Please fix the following errors:</h4>
            <ul className="text-sm text-red-700 space-y-1">
              {Object.entries(contactErrors).map(([field, error]) => (
                <li key={field}>• {error}</li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
            <input
              type="tel"
              id="contact_phone"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                contactErrors.contact_phone
                  ? 'border-red-300 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
              placeholder="Enter contact phone"
              defaultValue={settings.contact_phone?.value || ""}
            />
            {contactErrors.contact_phone && (
              <p className="text-xs text-red-600 mt-1">{contactErrors.contact_phone}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
            <input
              type="email"
              id="contact_email"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                contactErrors.contact_email
                  ? 'border-red-300 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
              placeholder="Enter contact email"
              defaultValue={settings.contact_email?.value || ""}
            />
            {contactErrors.contact_email && (
              <p className="text-xs text-red-600 mt-1">{contactErrors.contact_email}</p>
            )}
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Address</label>
            <textarea
              id="contact_address"
              rows={3}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                contactErrors.contact_address
                  ? 'border-red-300 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
              placeholder="Enter contact address"
              defaultValue={settings.contact_address?.value || ""}
            />
            {contactErrors.contact_address && (
              <p className="text-xs text-red-600 mt-1">{contactErrors.contact_address}</p>
            )}
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Office Hours (JSON format)</label>
            <textarea
              id="contact_hours"
              rows={4}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                contactErrors.contact_hours
                  ? 'border-red-300 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              } font-mono text-sm`}
              placeholder='[{"day": "Monday - Friday", "hours": "9:00 AM - 6:00 PM"}, {"day": "Saturday", "hours": "10:00 AM - 4:00 PM"}, {"day": "Sunday", "hours": "Closed"}]'
              defaultValue={settings.contact_hours?.value || ""}
            />
            <p className="text-xs text-gray-500 mt-1">Enter JSON array with day and hours objects</p>
            {contactErrors.contact_hours && (
              <p className="text-xs text-red-600 mt-1">{contactErrors.contact_hours}</p>
            )}
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Description</label>
            <textarea
              id="contact_description"
              rows={3}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                contactErrors.contact_description
                  ? 'border-red-300 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
              placeholder="Enter contact description"
              defaultValue={settings.contact_description?.value || ""}
            />
            {contactErrors.contact_description && (
              <p className="text-xs text-red-600 mt-1">{contactErrors.contact_description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Footer Settings */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Footer Settings</h3>
          <Button
            onClick={handleSaveFooter}
            disabled={isSavingFooter}
            size="sm"
          >
            {isSavingFooter ? "Saving..." : "Save Footer"}
          </Button>
        </div>
        
        {/* Footer Errors */}
        {Object.keys(footerErrors).length > 0 && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <h4 className="text-sm font-medium text-red-800 mb-2">Please fix the following errors:</h4>
            <ul className="text-sm text-red-700 space-y-1">
              {Object.entries(footerErrors).map(([field, error]) => (
                <li key={field}>• {error}</li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company Address</label>
            <textarea
              id="footer_address"
              rows={3}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                footerErrors.footer_address
                  ? 'border-red-300 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
              placeholder="Enter company address"
              defaultValue={settings.footer_address?.value || ""}
            />
            {footerErrors.footer_address && (
              <p className="text-xs text-red-600 mt-1">{footerErrors.footer_address}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Copyright Text</label>
            <input
              type="text"
              id="copyright_text"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                footerErrors.footer_copyright
                  ? 'border-red-300 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
              placeholder="Enter copyright text"
              defaultValue={settings.footer_copyright?.value || ""}
            />
            {footerErrors.footer_copyright && (
              <p className="text-xs text-red-600 mt-1">{footerErrors.footer_copyright}</p>
            )}
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Get in Touch Content</label>
          <textarea
            id="get_in_touch_content"
            rows={3}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              footerErrors.footer_get_in_touch
                ? 'border-red-300 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
            placeholder="Enter get in touch content"
            defaultValue={settings.footer_get_in_touch?.value || ""}
          />
          {footerErrors.footer_get_in_touch && (
            <p className="text-xs text-red-600 mt-1">{footerErrors.footer_get_in_touch}</p>
          )}
        </div>
      </div>

      {/* Social Media Settings */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Social Media Links</h3>
          <Button
            onClick={handleSaveSocial}
            disabled={isSavingSocial}
            size="sm"
          >
            {isSavingSocial ? "Saving..." : "Save Social"}
          </Button>
        </div>
        
        {/* Social Media Errors */}
        {Object.keys(socialErrors).length > 0 && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <h4 className="text-sm font-medium text-red-800 mb-2">Please fix the following errors:</h4>
            <ul className="text-sm text-red-700 space-y-1">
              {Object.entries(socialErrors).map(([field, error]) => (
                <li key={field}>• {error}</li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Facebook URL</label>
            <input
              type="url"
              id="facebook_url"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                socialErrors.facebook_url
                  ? 'border-red-300 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
              placeholder="https://facebook.com/yourpage"
              defaultValue={settings.social_facebook?.value || ""}
            />
            {socialErrors.facebook_url && (
              <p className="text-xs text-red-600 mt-1">{socialErrors.facebook_url}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Twitter URL</label>
            <input
              type="url"
              id="twitter_url"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                socialErrors.twitter_url
                  ? 'border-red-300 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
              placeholder="https://twitter.com/yourpage"
              defaultValue={settings.social_twitter?.value || ""}
            />
            {socialErrors.twitter_url && (
              <p className="text-xs text-red-600 mt-1">{socialErrors.twitter_url}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
            <input
              type="url"
              id="linkedin_url"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                socialErrors.linkedin_url
                  ? 'border-red-300 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
              placeholder="https://linkedin.com/company/yourcompany"
              defaultValue={settings.social_linkedin?.value || ""}
            />
            {socialErrors.linkedin_url && (
              <p className="text-xs text-red-600 mt-1">{socialErrors.linkedin_url}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Instagram URL</label>
            <input
              type="url"
              id="instagram_url"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                socialErrors.instagram_url
                  ? 'border-red-300 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
              placeholder="https://instagram.com/yourpage"
              defaultValue={settings.social_instagram?.value || ""}
            />
            {socialErrors.instagram_url && (
              <p className="text-xs text-red-600 mt-1">{socialErrors.instagram_url}</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>Basic website configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Site Title</label>
              <input
                id="site_title"
                type="text"
                placeholder="Enter site title"
                defaultValue={settings.site_title?.value || "Upreak"}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Site Description</label>
              <textarea
                id="site_description"
                placeholder="Enter site description"
                defaultValue={settings.site_description?.value || "Talent-Sourcing Solutions Partnering to Deliver Exceptional Talent"}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Contact Email</label>
              <input
                id="contact_email"
                type="email"
                placeholder="Enter contact email"
                defaultValue={settings.contact_email?.value || "business@upreak.com"}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Contact Phone</label>
              <input
                id="contact_phone"
                type="tel"
                placeholder="Enter contact phone"
                defaultValue={settings.contact_phone?.value || "+91 79759 30773"}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Button 
              className="w-full" 
              onClick={handleSaveSettings}
              disabled={isSavingSettings}
            >
              {isSavingSettings ? "Saving..." : "Save Changes"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Logo & Branding</CardTitle>
            <CardDescription>Upload and manage your brand assets</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Current Logo</label>
              <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center mb-4 overflow-hidden">
                {settings.site_logo?.value ? (
                  <img
                    src={settings.site_logo.value}
                    alt="Site Logo"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      console.error('[Logo Upload] Error loading logo:', settings.site_logo.value);
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <span className="text-gray-500">No logo uploaded</span>
                )}
              </div>
              <input
                type="file"
                id="logo_upload"
                accept="image/jpeg,image/jpg,image/png,image/svg+xml"
                className="hidden"
                onChange={handleLogoUpload}
              />
              <Button
                variant="outline"
                className="w-full"
                onClick={() => document.getElementById('logo_upload')?.click()}
                disabled={isUploading}
              >
                {isUploading ? "Uploading..." : "Upload New Logo"}
              </Button>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Favicon</label>
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-4 overflow-hidden">
                {settings.site_favicon?.value ? (
                  <img
                    src={settings.site_favicon.value}
                    alt="Site Favicon"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      console.error('[Favicon Upload] Error loading favicon:', settings.site_favicon.value);
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <span className="text-gray-500 text-xs">No favicon</span>
                )}
              </div>
              <input
                type="file"
                id="favicon_upload"
                accept="image/x-icon,image/vnd.microsoft.icon,image/png"
                className="hidden"
                onChange={handleFaviconUpload}
              />
              <Button
                variant="outline"
                className="w-full"
                onClick={() => document.getElementById('favicon_upload')?.click()}
                disabled={isUploading}
              >
                {isUploading ? "Uploading..." : "Upload Favicon"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return renderDashboard();
      case "pages":
        return renderPages();
      case "messages":
        return renderMessages();
      case "settings":
        return renderSettings();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img src="/Text logo.png" alt="Upreak Logo" className="h-6 w-auto mr-2" />
              <span className="text-xl font-bold text-gray-900">Admin</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm h-screen sticky top-0">
          <nav className="p-4 space-y-2">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                activeTab === "dashboard"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab("pages")}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                activeTab === "pages"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <FileText className="w-5 h-5" />
              <span>Pages</span>
            </button>

            <button
              onClick={() => setActiveTab("messages")}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                activeTab === "messages"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <MessageSquare className="w-5 h-5" />
              <span>Messages</span>
              {stats.newMessages > 0 && (
                <Badge variant="destructive" className="ml-auto">
                  {stats.newMessages}
                </Badge>
              )}
            </button>

            <button
              onClick={() => setActiveTab("settings")}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                activeTab === "settings"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {isLoading ? (
            <div className="flex items-center justify-center min-h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading dashboard data...</p>
              </div>
            </div>
          ) : (
            renderContent()
          )}
        </main>
      </div>
    </div>
  );
}