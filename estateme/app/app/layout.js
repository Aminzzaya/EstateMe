import ".././globals.css";
import { AuthProvider } from ".././Provider";
import Sidebar from "@/components/Sidebar";

export const metadata = {
  title: "EstateMe",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <div className="flex flex-col">
      <AuthProvider>
        <div className="h-screen top-0 left-0 fixed">
          <Sidebar />
        </div>
        <div className="pl-[290px]">{children}</div>
      </AuthProvider>
    </div>
  );
}
