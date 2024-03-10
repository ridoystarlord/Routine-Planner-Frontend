import { ROUTES } from "@/Routes";
import { RegisterForm } from "@/components/Register";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function Home() {
  const accessToken = cookies().get("token")?.value;
  if (accessToken) {
    redirect(ROUTES.DASHBOARD.HOME as string);
    return null;
  }
  return (
    <div className="h-screen flex items-center justify-center">
      <RegisterForm />
    </div>
  );
}
