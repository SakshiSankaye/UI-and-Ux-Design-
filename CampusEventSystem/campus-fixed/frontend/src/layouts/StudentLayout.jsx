/* eslint-disable */
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar   from "../components/Sidebar";
import TopNavbar from "../components/TopNavbar";
import { RegistrationProvider } from "../context/RegistrationContext";

export default function StudentLayout() {
  const [open, setOpen] = useState(false);

  return (
    // RegistrationProvider wraps ALL student pages — this is what fixes the
    // "useRegistrations must be used within RegistrationProvider" error
    <RegistrationProvider>
      <div className="flex h-screen overflow-hidden bg-gray-50">
        <Sidebar open={open} onClose={() => setOpen(false)} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopNavbar onMenuClick={() => setOpen(true)} />
          <main className="flex-1 p-4 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </RegistrationProvider>
  );
}
