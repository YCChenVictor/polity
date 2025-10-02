import { useEffect, useState } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import AppLayout from "./AppLayout";
import Topic from "./features/Topic";
import SiweLoginButton from "./features/Auth";
import Poll from "./features/Agora";
import Citizen from "./features/Citizen";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <AppLayout />, // header/nav etc.
      children: [
        { path: "citizens", element: <Citizen /> },
        { index: true, element: <>hello</> },
        { path: "topics", element: <Topic /> },
        { path: "polls", element: <Poll /> },
      ],
    },
  ]);

  const [user, setUser] = useState<{ address: string } | null>(null);

  const BACKEND = process.env.REACT_APP_BACKEND_URL;

  async function refreshSession() {
    try {
      const res = await fetch(`${BACKEND}/auth/me`, { credentials: "include" });
      setUser(res.ok ? await res.json() : null);
    } catch {
      setUser(null);
    }
  }

  useEffect(() => {
    refreshSession();
  }, []);

  return !user ? (
    <SiweLoginButton onSuccess={refreshSession} />
  ) : (
    <RouterProvider router={router} />
  );
}

export default App;
