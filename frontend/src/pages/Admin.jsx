import Navbar from "../components/Navbar/Navbar";

const Admin = () => {
  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-2">Admin Page</h1>
        <p className="text-sm text-gray-600">
          Only users with the <span className="font-semibold">admin</span> role can see this page.
        </p>
      </div>
    </div>
  );
};

export default Admin;