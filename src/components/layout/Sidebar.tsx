import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import avatar from "@/assets/img/Oval.png";

export function Sidebar() {
  const { theme, toggle } = useTheme();
  return (
    <aside className="bg-sidebar-bg text-sidebar-fg flex lg:flex-col items-center justify-between lg:fixed lg:inset-y-0 lg:left-0 lg:w-25.75 lg:rounded-r-2xl z-30 h-18 lg:h-screen w-full">
      <a
        href="/"
        className="relative flex items-center justify-center bg-primary rounded-r-2xl h-full w-18 lg:w-full lg:h-25.72 overflow-hidden focus-ring"
        aria-label="Invoicely home"
      >
        <span
          className="absolute inset-0 top-1/2 bg-primary-hover rounded-tl-2xl"
          aria-hidden
        />
        <svg
          width="103"
          height="103"
          viewBox="0 0 103 103"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 0H83C94.0457 0 103 8.9543 103 20V83C103 94.0457 94.0457 103 83 103H0V0Z"
            fill="#7C5DFA"
          />
          <mask
            id="mask0_1_154"
            maskUnits="userSpaceOnUse"
            mask-type="luminance"
            x="0"
            y="0"
            width="103"
            height="103"
          >
            <path
              d="M0 0H83C94.0457 0 103 8.9543 103 20V83C103 94.0457 94.0457 103 83 103H0V0Z"
              fill="white"
            />
          </mask>
          <g mask="url(#mask0_1_154)">
            <path
              d="M103 52H20C8.95431 52 0 60.9543 0 72V135C0 146.046 8.95431 155 20 155H103V52Z"
              fill="#9277FF"
            />
          </g>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M42.6942 33.292L52 51.9998L61.3058 33.292C67.6645 36.6406 72 43.3139 72 50.9998C72 62.0454 63.0457 70.9998 52 70.9998C40.9543 70.9998 32 62.0454 32 50.9998C32 43.3139 36.3355 36.6406 42.6942 33.292Z"
            fill="white"
          />
        </svg>
      </a>

      <div className="flex lg:flex-col items-center gap-6 pr-6 lg:pr-0 lg:pb-6">
        <button
          type="button"
          onClick={toggle}
          aria-label={
            theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
          }
          className="text-muted-foreground hover:text-sidebar-fg transition-colors focus-ring rounded-md p-2"
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </button>
        <div className="hidden lg:block w-full h-px bg-border opacity-30" />

        <div
          aria-hidden
          className="h-10 w-10 rounded-full overflow-hidden ring-2 ring-background/40"
        >
          <img
            src={avatar}
            alt="User profile"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </aside>
  );
}
