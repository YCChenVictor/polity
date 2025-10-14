// AppLayout.tsx
import React from "react";
import { Outlet, Link } from "react-router-dom";

const AppLayout: React.FC = () => (
  <div>
    <header style={{ padding: "1rem", borderBottom: "1px solid #ccc" }}>
      <nav>
        <Link to="/">Home</Link>
        {" | "}
        <Link to="/topics">Topics</Link>
        {" | "}
        <Link to="/agoras">Agoras</Link>
        {" | "}
        <Link to="/citizens">Citizens</Link>
      </nav>
    </header>

    <main style={{ padding: "1rem" }}>
      <Outlet />
    </main>

    <footer style={{ padding: "1rem", borderTop: "1px solid #ccc" }}>
      © {new Date().getFullYear()}
    </footer>
  </div>
);

export default AppLayout;
