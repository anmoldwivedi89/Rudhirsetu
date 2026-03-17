import { NavLink, useLocation } from "react-router-dom";
import { Home, Activity, Clock, User } from "lucide-react";

const NAV_ITEMS = [
  { to: "/", label: "Home", Icon: Home, activeMatch: (p) => p === "/" },
  {
    to: "/donor/requests",
    label: "Requests",
    Icon: Activity,
    activeMatch: (p) => p.startsWith("/donor/requests"),
  },
  {
    to: "/donor/history",
    label: "History",
    Icon: Clock,
    activeMatch: (p) => p.startsWith("/donor/history"),
  },
  {
    to: "/donor/profile",
    label: "Profile",
    Icon: User,
    activeMatch: (p) => p.startsWith("/donor/profile"),
  },
];

export default function BottomNav() {
  const location = useLocation();
  const pathname = location.pathname || "/";

  if (pathname === "/login" || pathname === "/register") return null;

  return (
    <nav className="md:hidden fixed bottom-4 left-4 right-4 z-50">
      <div className="mx-auto max-w-md rounded-2xl border border-white/[0.08] bg-[rgba(15,15,15,0.6)] backdrop-blur-md shadow-[0_12px_35px_rgba(0,0,0,0.45),0_0_28px_rgba(239,68,68,0.16)]">
        <div className="grid grid-cols-4 gap-1 p-2">
          {NAV_ITEMS.map(({ to, label, Icon, activeMatch }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => {
                const active = isActive || activeMatch(pathname);
                return [
                  "group relative flex flex-col items-center justify-center gap-1 rounded-xl px-2 py-2.5",
                  "transition-all duration-300 ease-in-out select-none",
                  "hover:scale-105 active:scale-95",
                  active
                    ? "bg-white/[0.10] shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_0_22px_rgba(239,68,68,0.22)]"
                    : "opacity-70 hover:opacity-100",
                ].join(" ");
              }}
            >
              {({ isActive }) => {
                const active = isActive || activeMatch(pathname);
                return (
                  <>
                    <Icon
                      size={20}
                      className={[
                        "transition-all duration-300 ease-in-out",
                        active ? "text-[#ef4444]" : "text-gray-300",
                        active ? "scale-105" : "",
                      ].join(" ")}
                    />
                    <span
                      className={[
                        "text-[11px] leading-none transition-all duration-300 ease-in-out",
                        active ? "text-white" : "text-gray-300",
                      ].join(" ")}
                    >
                      {label}
                    </span>

                    {active && (
                      <span className="pointer-events-none absolute -inset-1 rounded-2xl bg-[#ef4444]/10 blur-xl" />
                    )}
                  </>
                );
              }}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}

