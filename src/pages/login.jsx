import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useAuth } from "../hooks/useAuth";
import { LoginAPI } from "../api/userAPI";

export default function LoginPage() {
  const loginRef = useRef(null);
  const navigate = useNavigate();
  const [errorShow, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  const { mutate: login, isLoading } = useMutation({
    mutationFn: LoginAPI,
    onSuccess: (data) => {
      Cookies.set("access", data.access, { secure: true, sameSite: "strict" });
      Cookies.set("refresh", data.refresh, {
        secure: true,
        sameSite: "strict",
      });

      // Delay redirect so the "Loading..." button can be seen
      setTimeout(() => {
        navigate("/");
      }, 1000); // 1 second delay
    },

    onError: (error) => {
      console.log(error.detail);
      setError(error.detail);
    },
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, []);

  if (isAuthenticated) {
    return null;
  }

  const loginSubmit = (e) => {
    e.preventDefault();
    const loginData = new FormData(loginRef.current);
    login(loginData);
  };
  return (
    <main className="w-screen h-screen flex justify-center items-center ">
      <section className="mx-auto">
        <form
          ref={loginRef}
          onSubmit={loginSubmit}
          className="border-1 flex flex-col p-4 gap-4 w-[400px] rounded-md"
          action=""
        >
          <h1 className="font-semibold">Login</h1>
          <label>Email</label>
          <input
            name="username"
            className="border-1 p-2 rounded-md"
            type="text"
          />
          <label>Password</label>
          <input
            name="password"
            className="border-1 p-2 rounded-md"
            type="password"
          />
          {errorShow && (
            <p className="p-4 bg-red-300 text-red-500 text-sm rounded-md">
              {errorShow}.
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`bg-slate-950 hover:bg-slate-700 text-white rounded-md p-2 w-full ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Loading..." : "Login"}
          </button>
        </form>
      </section>
    </main>
  );
}
