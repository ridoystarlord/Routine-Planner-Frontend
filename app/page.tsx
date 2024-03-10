import { ROUTES } from "@/Routes";
import { Logout } from "@/components/Logout";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function Home() {
  const accessToken = cookies().get("token")?.value;
  if (!accessToken) {
    redirect(ROUTES.LOG_IN("/"));
    return null;
  }
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      I am Account
      <Logout />
    </div>
  );
}
