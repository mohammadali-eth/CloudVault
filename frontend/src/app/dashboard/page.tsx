"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  File, 
  Upload, 
  HardDrive, 
  Clock, 
  Plus,
  LogOut,
  User
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user.name || user.email}</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your files and secure storage.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button className="gap-2">
            <Plus className="w-4 h-4" /> Upload File
          </Button>
          <Button variant="outline" size="icon" onClick={handleLogout} title="Logout">
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard 
          icon={<HardDrive className="w-5 h-5 text-blue-500" />}
          title="Total Storage"
          value="1.2 GB"
          description="of 10 GB used"
        />
        <StatCard 
          icon={<File className="w-5 h-5 text-green-500" />}
          title="Total Files"
          value="128"
          description="+12 this week"
        />
        <StatCard 
          icon={<Clock className="w-5 h-5 text-purple-500" />}
          title="Recent Activity"
          value="4 mins ago"
          description="Last upload"
        />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Files</CardTitle>
            <CardDescription>A list of your most recently uploaded documents.</CardDescription>
          </div>
          <Button variant="ghost" size="sm">View all</Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <FileRow name="Project_Proposal.pdf" size="2.4 MB" date="Today" />
            <FileRow name="Vacation_Photos.zip" size="450 MB" date="Yesterday" />
            <FileRow name="Budget_Q1_2024.xlsx" size="1.2 MB" date="2 days ago" />
            <FileRow name="Resume_v2.docx" size="124 KB" date="5 days ago" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ icon, title, value, description }: { icon: React.ReactNode, title: string, value: string, description: string }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );
}

function FileRow({ name, size, date }: { name: string, size: string, date: string }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors border">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-md bg-primary/10 text-primary">
          <File className="w-4 h-4" />
        </div>
        <div>
          <div className="text-sm font-medium">{name}</div>
          <div className="text-xs text-muted-foreground">{size}</div>
        </div>
      </div>
      <div className="text-xs text-muted-foreground">{date}</div>
    </div>
  );
}
