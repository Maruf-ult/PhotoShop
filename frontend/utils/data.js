import { Home, Compass, Image, Upload, Settings } from "lucide-react";
import { LayoutDashboard,Users,LogOut } from "lucide-react";


export const SIDE_MENU_DATA_USER = [
  {
    id: "01",
    label: "Home",
    icon: Home, 
    path: "/home",
  },
  {
    id: "02",
    label: "Explore",
    icon: Compass, 
    path: "/user_explore",
  },
  {
    id: "03",
    label: "My Photos",
    icon: Image, 
    path: "/my_photos",
  },
  {
    id: "04",
    label: "Upload",
    icon: Upload, 
    path: "/upload",
  },
];


export const SIDE_MENU_DATA_ADMIN = [
  {
    id: "01",
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/admin/dashboard",
  },
  {
    id: "02",
    label: "Photo Management",
    icon: Image,
    path: "/admin/photo-management",
  },
  {
    id: "03",
    label: "User Management",
    icon: Users,
    path: "/admin/user-mangement",
  },
   {
    id: "04",
    label: "Settings",
    icon: Settings,
    path: "/admin/settings",
  },
  {
    id:"05",
    label:"Logout",
    icon:LogOut,
    path:"/"
  }
  
];
