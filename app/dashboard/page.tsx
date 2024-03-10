import { ROUTES } from "@/Routes";
import { StudyPlanPage } from "@/components/StudyPlanPage";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function Home() {
  const accessToken = cookies().get("token")?.value;
  if (!accessToken) {
    redirect(ROUTES.LOG_IN(ROUTES.DASHBOARD.STUDY_TOPIC));
    return null;
  }
  return (
    <div className="container mx-auto py-4">
      <StudyPlanPage token={accessToken ? accessToken : ""} />
    </div>
  );
}
