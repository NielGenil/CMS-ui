import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUserAPI, UserListAPI } from "./api/userAPI";

function App() {
  const { isAuthenticated, logout, isTokenValid } = useAuth();
  const navigate = useNavigate();

  const { data } = useQuery({
    queryKey: ["user-data"],
    queryFn: getCurrentUserAPI,
  });
 
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  useEffect(() => {
    if (isTokenValid === false) {
      logout();
      navigate("/login");
    }
  }, [isTokenValid, logout, navigate]);

  if (isTokenValid === null) {
    return <div>Loading token...</div>;
  }

  const logoutSubmit = (e) => {
    e.preventDefault();
    logout();
    navigate("/login");
  };
  return (
    <main className="h-screen w-screen flex">
      {/* sidebar */}
      <section className="w-[230px] flex flex-col bg-slate-950 text-white">
        <div className="bg-white">
          <img
            src="https://southerncalibration.com/image/logo.png"
            alt="logo"
          />
        </div>
        <div className="flex flex-1 flex-col gap-3 p-4 overflow-y-auto">
          <Link to={"/"} className="hover:bg-slate-500 p-2 rounded">
            Dashboard
          </Link>
          <Link to={"/user"} className="hover:bg-slate-500 p-2 rounded">
            User
          </Link>
          <Link to={"/attendance"} className="hover:bg-slate-500 p-2 rounded">
            Attendance
          </Link>
        </div>
        <div className="p-4">
          <div className="flex flex-col h-[40px] border-t-1 ">
            <Link
              className="hover:bg-slate-500 p-2 mt-2 rounded"
              onClick={logoutSubmit}
            >
              Logout {data?.first_name}
            </Link>
          </div>
        </div>
      </section>

      {/* main content */}
      <section className="flex flex-1 w-screen h-screen p-4 gap-4 overflow-y-auto">
        <Outlet />
      </section>
    </main>
  );
}

export default App;
