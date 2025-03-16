"use client";
import { getCurrentUser } from "@/infra/auth";
import { useRouter } from "next/navigation";
import { createContext, useEffect, useState } from "react";

type AuthContextType = {
  currentUser: any | null;
  setCurrentUser: (currentUser: any | null) => void;
};

export const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  setCurrentUser: () => {},
});

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState();
  const router = useRouter();

  const handleGetCurrentUser = async () => {
    try {
      const res = await getCurrentUser();

      if (res?.data.isLogin === true) {
        setIsSignedIn(true);
        setCurrentUser(res?.data.data);
        console.log(res?.data.data);
      } else {
        console.log("no current user");
      }
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    handleGetCurrentUser();
  }, [setCurrentUser]);

  const Private = ({ children }: { children: React.ReactNode }) => {
    if (!loading) {
      if (isSignedIn) {
        return children;
      } else {
        router.push(`/signin`);
      }
    } else {
      return <></>;
    }
  };
  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
      <Private>
        <p>Homeページです</p>
      </Private>
    </AuthContext.Provider>
  );
}
