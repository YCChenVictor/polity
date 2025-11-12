import { useEffect, useState } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import AppLayout from "./AppLayout";
import Topic from "./features/Topic";
import SiweLoginButton from "./features/Auth";
import Poll from "./features/Agora";
import Citizen from "./features/Citizen";
import Home from "./features/Home";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <AppLayout />, // header/nav etc.
      children: [
        { path: "citizens", element: <Citizen /> },
        { index: true, element: <Home /> },
        { path: "topics", element: <Topic /> },
        { path: "agoras", element: <Poll /> },
      ],
    },
  ]);

  const [user, setUser] = useState<{ address: string } | null>(null);

  async function refreshSession() {
    try {
      const res = await fetch("/api/me", { credentials: "include" });
      setUser(res.ok ? await res.json() : null);
    } catch {
      setUser(null);
    }
  }

  useEffect(() => {
    refreshSession();
  }, []);

  if (!user) {
    return <SiweLoginButton />;
  }

  return <RouterProvider router={router} />;
}

export default App;
