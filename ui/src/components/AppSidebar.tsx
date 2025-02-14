import {
  BrainCircuitIcon,
  Calendar,
  Home,
  Inbox,
  MessageCircle,
  Search,
  Settings,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "@tanstack/react-router";
import { ModeToggleButton } from "./ModeToggleButton";

import Logo from "@/assets/logo.png";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Knowledge",
    url: "/knowledge",
    icon: BrainCircuitIcon,
  },
  {
    title: "Chat",
    url: "/chat",
    icon: MessageCircle,
  },
];

export function AppSidebar() {
  return (
    <Sidebar className="w-[64px]" variant="inset">
      <SidebarHeader>
        <img src={Logo} alt="Docu Chat" className="fill-white" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <Link to={item.url}>
                    {({ isActive }) => {
                      return (
                        <>
                          <SidebarMenuButton
                            className="flex items-center justify-center"
                            tooltip={{
                              children: item.title,
                              hidden: false,
                            }}
                            isActive={isActive}
                            asChild
                          >
                            <item.icon />
                          </SidebarMenuButton>
                        </>
                      );
                    }}
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <ModeToggleButton />
      </SidebarFooter>
    </Sidebar>
  );
}
