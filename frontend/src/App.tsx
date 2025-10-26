import { useEffect, useState } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import AppLayout from "./AppLayout";
import Topic from "./features/Topic";
import SiweLoginButton from "./features/Auth";
import Poll from "./features/Agora";
import Citizen from "./features/Citizen";
import Home from "./features/Home";
import Constitution from "./Constitution";

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
  const [initialized, setInitialized] = useState<boolean>(false);

  const BACKEND = process.env.REACT_APP_BACKEND_URL;

  async function refreshSession() {
    try {
      const res = await fetch(`${BACKEND}/auth/me`, { credentials: "include" });
      setUser(res.ok ? await res.json() : null);
    } catch {
      setUser(null);
    }
  }

  async function checkInitialized() {
    try {
      const res = await fetch(`${BACKEND}/events/init`, {
        credentials: "include",
      });
      const data = await res.json();
      setInitialized(data.initialized);
    } catch {
      setInitialized(false);
    }
  }

  useEffect(() => {
    refreshSession();
    checkInitialized();
  }, []);

  if (!user) {
    return <SiweLoginButton onSuccess={refreshSession} />;
  }

  if (!initialized) {
    return <Constitution />;
  }

  return <RouterProvider router={router} />;
}

export default App;
