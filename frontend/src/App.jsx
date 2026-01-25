import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Playlists from "./pages/Playlists";
import AdminUpload from "./pages/AdminUpload";
import Liked from "./pages/Liked";
import Recent from "./pages/Recent";
import Profile from "./pages/Profile";

import Player from "./components/Player";
import AdminRoute from "./routes/AdminRoute";
import MainLayout from "./layout/MainLayout";

export default function App() {
  return (
    <>
      <Routes>
        {/* AUTH */}
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* APP */}
        <Route path="/home" element={<MainLayout><Home /></MainLayout>} />
        <Route path="/liked" element={<MainLayout><Liked /></MainLayout>} />
        <Route path="/recent" element={<MainLayout><Recent /></MainLayout>} />
        <Route path="/playlists" element={<MainLayout><Playlists /></MainLayout>} />
        <Route path="/profile" element={<MainLayout><Profile /></MainLayout>} />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <MainLayout>
                <AdminUpload />
              </MainLayout>
            </AdminRoute>
          }
        />
      </Routes>

      {/* PLAYER (SAFE HERE) */}
      <Player />
    </>
  );
}
