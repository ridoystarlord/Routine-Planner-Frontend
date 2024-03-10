import { ROUTES } from "@/Routes";
import { SchedulesPage } from "@/components/SchedulesPage";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function Home() {
  const accessToken = cookies().get("token")?.value;
  if (!accessToken) {
    redirect(ROUTES.LOG_IN(ROUTES.DASHBOARD.SCHEDULES));

    return null;
  }
  return (
    <div className="container mx-auto py-4">
      <SchedulesPage token={accessToken ? accessToken : ""} />
    </div>
  );
}
