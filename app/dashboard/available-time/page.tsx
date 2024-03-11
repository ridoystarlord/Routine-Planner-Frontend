import { ROUTES } from "@/Routes";
import { AvailableTimePage } from "@/components/AvailableTimePage";
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
      <AvailableTimePage token={accessToken ? accessToken : ""} />
    </div>
  );
}
