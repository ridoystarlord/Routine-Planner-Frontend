import { ROUTES } from "@/Routes";
import { Logout } from "@/components/Logout";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Routine Planner Dashboard",
  description: "A Dashboard for student",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <section>
        <div style={{ position: "fixed", width: "100%", zIndex: 999 }}>
          <nav className="sticky top-0 z-30  bg-slate-800">
            <div className="flex h-[96px] items-center px-4">
              <Link
                passHref
                href={ROUTES.DASHBOARD.HOME}
                className="w-[180px] text-white"
              >
                Routine Planner
              </Link>
            </div>
          </nav>
        </div>
        <div className="w-100 h-full">
          <div className="flex">
            <div>
              <div style={{ position: "sticky", top: "80px" }}>
                <aside
                  id="sidebar"
                  className="flex w-[180px] overflow-y-auto bg-slate-800 h-[94vh] text-white"
                  aria-label="Sidebar"
                >
                  <div className="w-full pt-10">
                    <div className="flex-1">
                      <ul className="px-4 space-y-4">
                        <li>
                          <Link
                            passHref
                            href={ROUTES.DASHBOARD.HOME}
                            // className={`${
                            //   path === ROUTES.DASHBOARD.HOME ? "active" : null
                            // }`}
                          >
                            <span>Dashboard</span>
                          </Link>
                        </li>

                        <li>
                          <Link
                            passHref
                            href={ROUTES.DASHBOARD.STUDY_TOPIC}
                            // className={`${
                            //   path.includes(ROUTES.DASHBOARD.ORDERS.HOME)
                            //     ? "active"
                            //     : null
                            // }`}
                          >
                            <span>Study Topic</span>
                          </Link>
                        </li>

                        <li>
                          <Logout />
                        </li>
                      </ul>
                    </div>
                  </div>
                </aside>
              </div>
            </div>
            <div
              className="w-full overflow-y-auto pt-[96px]"
              style={{ minHeight: "100vh" }}
            >
              {children}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
