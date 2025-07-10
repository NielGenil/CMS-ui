import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { verifyTokenAPI } from "../api/api";

export function useAuth() {
  const token = Cookies.get("access");
  const [isTokenValid, setIsTokenValid] = useState(null); 

  const { mutateAsync: verifyToken } = useMutation({
    mutationFn: verifyTokenAPI,
  });

  useEffect(() => {
    const checkToken = async () => {
      if (!token) {
        setIsTokenValid(false);
        return; 
      }

      try {
        const res = await verifyToken(token);
        if (res?.code === "token_not_valid") {
          setIsTokenValid(false);
        } else {
          setIsTokenValid(true);
        }
      } catch {
        setIsTokenValid(false);
      }
    };

    checkToken();
  }, [token, verifyToken]);

  const isAuthenticated = !!token;

  const logout = () => {
    Cookies.remove("access");
    Cookies.remove("refresh");
  };

  return { isAuthenticated, logout, isTokenValid };
}
