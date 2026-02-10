import Navbar from "../components/Navbar/Navbar";
import Counter from "../components/examples/Counter";

const User = () => {
  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-2">User Page</h1>
        <p className="text-sm text-gray-600 mb-4">
          Only users with the <span className="font-semibold">user</span> role can see this page.
        </p>
        <Counter />
      </div>
    </div>
  );
};

export default User;