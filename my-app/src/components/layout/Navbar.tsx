"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Briefcase,
  FileText,
  Home,
  LogOut,
  Menu,
  Mic,
  User,
  Settings,
  CreditCard,
  Shield,
  LayoutGrid,
  HelpCircle,
  Layers,
  Package,
  PlusCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TokenBalance } from "@/components/payment/TokenBalance";

export default function Navbar() {
  const pathname = usePathname();

  const router = useRouter();
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [userName, setUserName] = React.useState("John Doe");
  const [userEmail, setUserEmail] = React.useState("john.doe@example.com");
  const [userRole, setUserRole] = React.useState<string>("");
  const [isAdmin, setIsAdmin] = React.useState(false);

  // Deteksi scroll untuk efek glassmorphism
  React.useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    // Load user info dari localStorage
    if (token) {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          setUserName(user.fullName || user.name || "John Doe");
          setUserEmail(user.email || "john.doe@example.com");
          setUserRole(user.role || "");
          setIsAdmin(user.role === "admin");
        } catch (error) {
          console.error("Failed to parse user data:", error);
        }
      }
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const publicNavItems = [
    { name: "Beranda", href: "/dashboard", icon: Home }, // Arahkan ke / untuk umum
    { name: "Loker", href: "/jobs", icon: Briefcase }, // Alias dashboard
  ];

  const privateNavItems = [
    { name: "CV Generator", href: "/cv-generator", icon: FileText },
    { name: "AI Interview", href: "/interview", icon: Mic },
  ];

  const adminNavItems = [
    { name: "Categories", href: "/admin/categories", icon: LayoutGrid },
    { name: "Questions", href: "/admin/questions", icon: HelpCircle },
    { name: "Tiers", href: "/admin/tiers", icon: Layers },
    { name: "Packages", href: "/admin/packages", icon: Package },
    {
      name: "Create Questions",
      href: "/admin/create-questions",
      icon: PlusCircle,
    },
  ];

  // Gabungkan menu jika login (exclude admin from main nav)
  const navItems = isLoggedIn
    ? [...publicNavItems, ...privateNavItems]
    : publicNavItems;

  const handleLogout = () => {
    // Hapus sesi (localStorage/Cookies)
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        isScrolled
          ? "bg-white/80 backdrop-blur-md border-gray-200 shadow-sm"
          : "bg-white border-transparent"
      }`}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* 1. LOGO */}
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="bg-black text-white p-1 rounded-lg">
            {/* Ikon Logo Sederhana */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5"
            >
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900">
            Seekers<span className="text-blue-500">.</span>
          </span>
        </Link>

        {/* 2. DESKTOP MENU (Hidden on Mobile) */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 ${
                  isActive
                    ? "text-black bg-gray-100"
                    : "text-gray-500 hover:text-black"
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* 3. RIGHT SECTION (Profile & Mobile Toggle) */}

        {/* PROFILE DROPDOWN */}
        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            // JIKA LOGIN: Tampilkan TokenBalance dan Profile Dropdown
            <div className="flex items-center gap-3">
              <TokenBalance />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-9 w-9 rounded-full"
                  >
                    <Avatar className="h-9 w-9 border border-gray-200">
                      {/* Ganti src dengan foto user dari backend nanti */}
                      <AvatarImage
                        src="https://github.com/shadcn.png"
                        alt="User"
                      />
                      <AvatarFallback>
                        {userName.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {userName}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {userEmail}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link href="/profile">
                    <DropdownMenuItem className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/payment">
                    <DropdownMenuItem className="cursor-pointer">
                      <CreditCard className="mr-2 h-4 w-4" />
                      <span>Billing</span>
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>Admin Panel</DropdownMenuLabel>
                      {adminNavItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link href={item.href} key={item.href}>
                            <DropdownMenuItem className="cursor-pointer">
                              <Icon className="mr-2 h-4 w-4" />
                              <span>{item.name}</span>
                            </DropdownMenuItem>
                          </Link>
                        );
                      })}
                    </>
                  )}
                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    className="text-red-600 cursor-pointer focus:text-red-600"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            // JIKA BELUM LOGIN: Tampilkan Tombol Login & Register
            <div className="hidden md:flex gap-2">
              <Link href="/login">
                <Button variant="ghost" className="text-gray-600">
                  Masuk
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-black text-white hover:bg-gray-800">
                  Daftar
                </Button>
              </Link>
            </div>
          )}

          {/* MOBILE MENU (SHEET) */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 mt-6">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-black text-white"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        {item.name}
                      </Link>
                    );
                  })}

                  {isAdmin && isLoggedIn && (
                    <>
                      <div className="border-t pt-4 mt-4">
                        <p className="text-sm font-semibold text-gray-900 px-4 mb-2">
                          Admin Panel
                        </p>
                        {adminNavItems.map((item) => {
                          const Icon = item.icon;
                          const isActive = pathname === item.href;
                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                                isActive
                                  ? "bg-black text-white"
                                  : "text-gray-600 hover:bg-gray-100"
                              }`}
                            >
                              <Icon className="w-5 h-5" />
                              {item.name}
                            </Link>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
