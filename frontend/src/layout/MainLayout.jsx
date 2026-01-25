import Navbar from "../components/Navbar";

export default function MainLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-black text-white">
      <Navbar />

      <div className="flex-1">
        {/* NAVBAR HEIGHT OFFSET */}
        <div className="pt-20 px-6">
          {children}
        </div>
      </div>
    </div>
  );
}
