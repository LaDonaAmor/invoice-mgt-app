import { useTheme } from "@/context/ThemeContext";
import avatar from "@/assets/img/Oval.png";

export function Sidebar() {
  const { theme, toggle } = useTheme();
  return (
    <aside className="bg-sidebar-bg text-sidebar-fg flex lg:flex-col items-center justify-between lg:fixed lg:inset-y-0 lg:left-0 lg:w-25.75 lg:rounded-r-2xl z-30 h-18 lg:h-screen w-full">
      <a
        href="/.."
        className="relative flex items-center justify-center bg-primary rounded-r-2xl h-full w-18 lg:h-24 lg:w-full overflow-hidden focus-ring"
        aria-label="Invoicely home"
      >
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
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.91783 0C2.20609 0 0 2.20652 0 4.91826C0 7.63 2.20609 9.83652 4.91783 9.83652C7.62913 9.83652 9.83565 7.63043 9.83565 4.91826C9.83565 2.20609 7.62913 0 4.91783 0Z"
                fill="#858BB2"
              />
            </svg>
          ) : (
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19.5016 11.3423C19.2971 11.2912 19.0927 11.3423 18.9137 11.4701C18.2492 12.0324 17.4824 12.4924 16.639 12.7991C15.8466 13.1059 14.9776 13.2592 14.0575 13.2592C11.9872 13.2592 10.0958 12.4158 8.74121 11.0611C7.38658 9.70649 6.54313 7.81512 6.54313 5.74483C6.54313 4.87582 6.69649 4.03237 6.95208 3.26559C7.23323 2.4477 7.64217 1.70649 8.17891 1.06751C8.40895 0.786362 8.35783 0.377416 8.07668 0.147384C7.89776 0.0195887 7.69329 -0.0315295 7.48882 0.0195887C5.31629 0.607448 3.42492 1.91096 2.07029 3.64898C0.766773 5.36144 0 7.48285 0 9.78317C0 12.5691 1.1246 15.0995 2.96486 16.9397C4.80511 18.78 7.3099 19.9046 10.1214 19.9046C12.4728 19.9046 14.6454 19.0867 16.3834 17.732C18.147 16.3519 19.4249 14.3838 19.9617 12.1346C20.0639 11.7768 19.8594 11.419 19.5016 11.3423Z"
                fill="#7E88C3"
              />
            </svg>
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
