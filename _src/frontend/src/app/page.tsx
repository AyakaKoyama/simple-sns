"use client";
import { getCurrentUser } from "@/infra/auth";
import { useRouter } from "next/navigation";
import { createContext, useEffect, useState } from "react";

type AuthContextType = {
  currentUser: any | null;
  setCurrentUser: (currentUser: any | null) => void;
  isSignedIn: boolean;
  setIsSignedIn: (isSignedIn: boolean) => void;
};

export const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  setCurrentUser: () => {},
  isSignedIn: false,
  setIsSignedIn: () => {},
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
    useEffect(() => {
      if (!loading && !isSignedIn) {
        router.push("/signin");
      }
    }, [loading, isSignedIn, router]); // 依存配列を明確にする

    if (loading) {
      return <></>; // ローディング中は何も表示しない
    }

    if (!isSignedIn) {
      return null; // リダイレクト中はコンテンツをレンダリングしない
    }

    return <>{children}</>;
  };
  return (
    <AuthContext.Provider
      value={{ currentUser, setCurrentUser, isSignedIn, setIsSignedIn }}
    >
      <Private>
        <h2 className="text-2xl font-bold text-indigo-800 dark:text-white mb-4">
          ログイン済みです
        </h2>
        <button
          className="bg-indigo-800 text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-800 focus:ring-offset-2 dark:focus:ring-offset-gray-800 mb-4"
          onClick={() => router.push("/posts")}
        >
          投稿一覧へ
        </button>
      </Private>
    </AuthContext.Provider>
  );
}
