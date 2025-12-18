import { Home, Compass, Image, Upload } from "lucide-react";

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
    icon: "",
    path: "/admin/dashboard",
  },
  {
    id: "02",
    label: "Photo Management",
    icon: "",
    path: "/admin/photo-management",
  },
  {
    id: "03",
    label: "User Management",
    icon: "",
    path: "/admin/user-mangement",
  },
  {
    id: "04",
    label: "Analytics",
    icon: "",
    path: "/admin/analytics",
  },
];
