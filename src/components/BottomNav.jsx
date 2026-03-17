import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Activity, Clock, Home, Lock, User } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import Loader from "./Loader.jsx";

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const pathname = location.pathname || "/";
  const [restrictedTab, setRestrictedTab] = useState(null);
  const hideNav = pathname === "/login" || pathname === "/register";

  const role = profile?.role || null;

  const navItems = useMemo(() => {
    const base = [{ to: "/", label: "Home", Icon: Home, activeMatch: (p) => p === "/" }];

    if (role === "hospital") {
      return [
        ...base,
        {
          to: "/hospital/requests",
          label: "Requests",
          Icon: Activity,
          activeMatch: (p) => p.startsWith("/hospital/requests"),
        },
        {
          to: "/hospital/history",
          label: "History",
          Icon: Clock,
          activeMatch: (p) => p.startsWith("/hospital/history"),
        },
        {
          to: "/hospital/profile",
          label: "Profile",
          Icon: User,
          activeMatch: (p) => p.startsWith("/hospital/profile"),
        },
      ];
    }

    // Default: donor-style nav (also used for logged-out users)
    return [
      ...base,
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
  }, [role]);

  const restrictedCopy = useMemo(() => {
    if (!restrictedTab) return null;
    return "You need to sign in to access this feature.";
  }, [restrictedTab]);

  useEffect(() => {
    if (!restrictedTab) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [restrictedTab]);

  const closeModal = () => setRestrictedTab(null);
  const goLogin = () => {
    closeModal();
    navigate("/login");
  };
  const goRegister = () => {
    closeModal();
    navigate("/register");
  };

  return (
    <>
      {hideNav ? (
        <Loader />
      ) : (
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pt-2 pb-[calc(12px+env(safe-area-inset-bottom))]">
        <div className="mx-auto w-full max-w-md rounded-2xl border border-white/[0.08] bg-[rgba(15,15,15,0.70)] backdrop-blur-md shadow-[0_12px_35px_rgba(0,0,0,0.45),0_0_28px_rgba(239,68,68,0.16)]">
          <div className="grid grid-cols-4 gap-1 p-2">
            {navItems.map(({ to, label, Icon, activeMatch }) => {
              const isProtected =
                to !== "/";
              const locked = isProtected && !user;

              return (
                <NavLink
                  key={to}
                  to={to}
                  onClick={(e) => {
                    if (!locked) return;
                    e.preventDefault();
                    setRestrictedTab(to);
                  }}
                  className={({ isActive }) => {
                    const active = isActive || activeMatch(pathname);
                    return [
                      "group relative flex flex-col items-center justify-center gap-1 rounded-xl px-2 py-3 min-h-[44px]",
                      "transition-all duration-300 ease-in-out select-none",
                  locked ? "opacity-60 cursor-pointer" : "opacity-70 hover:opacity-100",
                      locked ? "" : "hover:scale-105 active:scale-95",
                      active
                        ? "bg-white/[0.10] shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_0_22px_rgba(239,68,68,0.22)]"
                        : "",
                    ].join(" ");
                  }}
                >
                  {({ isActive }) => {
                    const active = isActive || activeMatch(pathname);
                    return (
                      <>
                        <div className="relative">
                          <Icon
                            size={20}
                            className={[
                              "transition-all duration-300 ease-in-out",
                              active ? "text-[#ef4444]" : "text-gray-300",
                              active ? "scale-105" : "",
                            ].join(" ")}
                          />
                          {locked && (
                            <span className="absolute -right-2 -top-2 inline-flex h-4 w-4 items-center justify-center rounded-full bg-black/60 ring-1 ring-white/10">
                              <Lock size={10} className="text-white/90" />
                            </span>
                          )}
                        </div>

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
              );
            })}
          </div>
        </div>
      </nav>
      )}

      <AnimatePresence>
        {restrictedTab && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.button
              type="button"
              aria-label="Close modal"
              className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
            />

            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="access-restricted-title"
              className="relative w-full max-w-sm rounded-xl border border-white/10 bg-[rgba(15,15,15,0.70)] p-5 shadow-[0_16px_50px_rgba(0,0,0,0.55),0_0_36px_rgba(239,68,68,0.24)] backdrop-blur-xl"
              initial={{ opacity: 0, y: 14, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 280, damping: 22 }}
            >
              <div className="mb-4">
                <h2
                  id="access-restricted-title"
                  className="text-lg font-semibold text-white"
                >
                  Login Required
                </h2>
                <p className="mt-1 text-sm text-white/75">{restrictedCopy}</p>
              </div>

              <div className="grid grid-cols-1 gap-2">
                <button
                  type="button"
                  onClick={goLogin}
                  className="w-full rounded-xl bg-[#ef4444] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(239,68,68,0.25)] transition-transform duration-200 active:scale-[0.98]"
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={goRegister}
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white/90 transition-colors duration-200 hover:bg-white/10 active:bg-white/15"
                >
                  Create Account
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="w-full rounded-xl px-4 py-2.5 text-sm font-medium text-white/70 hover:text-white"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

