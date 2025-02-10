import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Theme, useTheme } from "@/components/ui/theme-provider";
import { CheckIcon, MoonIcon, SunIcon, SunMoonIcon } from "lucide-react";
import { titleCase } from "@/utils";
export function ModeToggleButton() {
  const { setTheme, theme } = useTheme();

  function ThemeMenuItem({
    theme,
    isActive,
    icon,
  }: {
    theme: Theme;
    isActive: boolean;
    icon: React.ReactNode;
  }) {
    return (
      <DropdownMenuItem
        onClick={() => setTheme(theme)}
        className="flex items-center gap-2 justify-between"
      >
        <div className="flex items-center gap-2">
          {icon}
          {titleCase(theme)}
        </div>
        {isActive && <CheckIcon />}
      </DropdownMenuItem>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="hover:cursor-pointer">
          <SunMoonIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="right">
        <ThemeMenuItem
          theme="light"
          isActive={theme === "light"}
          icon={<SunIcon />}
        />
        <ThemeMenuItem
          theme="dark"
          isActive={theme === "dark"}
          icon={<MoonIcon />}
        />
        <ThemeMenuItem
          theme="system"
          isActive={theme === "system"}
          icon={<SunMoonIcon />}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
