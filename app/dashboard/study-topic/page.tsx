import { ROUTES } from "@/Routes";
import StudyTopicTable from "@/components/StudyTopicTable/StudyTopicTable";
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
      <StudyTopicTable token={accessToken ? accessToken : ""} />
    </div>
  );
}
