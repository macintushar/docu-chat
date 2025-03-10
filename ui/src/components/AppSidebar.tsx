import { BrainCircuitIcon, MessageCircle } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "@tanstack/react-router";
import { ModeToggleButton } from "./ModeToggleButton";

// @ts-ignore
import Logo from "@/assets/logo.png";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: MessageCircle,
  },
  {
    title: "Knowledge",
    url: "/knowledge",
    icon: BrainCircuitIcon,
  },
];

export function AppSidebar() {
  return (
    <Sidebar className="w-[64px]" variant="inset">
      <SidebarHeader className="justify-center items-center">
        <img src={Logo} alt="Docu Chat" className="h-8 w-8" />
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
