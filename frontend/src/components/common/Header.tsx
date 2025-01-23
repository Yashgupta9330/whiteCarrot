import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { getAuthHeaders } from "@/services/apiConnector";



export const Header: React.FC = () => {
  const navigate=useNavigate();
  const [dark, setDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const headers=getAuthHeaders();

  const logout = async () => {
    try {
      await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/auth/logout`,{headers});
      localStorage.removeItem("token");
      navigate('/')
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  useEffect(() => {
    if (dark) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [dark]);

  const darkModeHandler = () => {
    setDark(!dark);
    const newTheme = !dark ? "dark" : "light";
    document.body.classList.toggle("dark", !dark);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <motion.header
      className="bg-white dark:bg-gray-800 shadow-md"
      initial={{ opacity: 0, y: -100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center">
        <h1 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 sm:mb-0">
          Dashboard
        </h1>
        <div className="flex items-center space-x-4">
          <div
            className={cn(
              "flex items-center justify-center hover:bg-gray-900/30 dark:hover:bg-gray-200/30 p-2 rounded-full"
            )}
          >
            <button
              onClick={darkModeHandler}
              className="text-sm font-medium text-gray-900 dark:text-gray-100"
            >
              {dark ? (
                <Sun className="h-[1.2rem] w-[1.2rem] text-yellow-400" />
              ) : (
                <Moon className="h-[1.2rem] w-[1.2rem] text-indigo-600" />
              )}
            </button>
          </div>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Button
            onClick={logout}
            variant="outline"
            className="text-indigo-600 dark:text-indigo-400 border-indigo-600 dark:border-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900"
          >
            Logout
          </Button>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
