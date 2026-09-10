import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 font-display font-bold", className)}>
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M6 4h13a2 2 0 0 1 2 2v3H10v3.2h9.5v4.6H10V20h11v4H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"
          fill="#15233F"
        />
        <path
          d="M13 21.5 22.5 12l-3.6-.4 5.6-6.1-9.2 8.8 3.7.5-5.9 6.1Z"
          fill="url(#ev-arrow)"
        />
        <defs>
          <linearGradient id="ev-arrow" x1="13" y1="21.5" x2="24.5" y2="5.5" gradientUnits="userSpaceOnUse">
            <stop stopColor="#1E7A3B" />
            <stop offset="1" stopColor="#8CC63F" />
          </linearGradient>
        </defs>
      </svg>
      <span className="text-lg leading-none">
        <span className="text-navy">EQUIP</span>
        <span className="bg-gradient-to-r from-green to-green-bright bg-clip-text text-transparent">
          VENTION
        </span>
      </span>
    </span>
  );
}
