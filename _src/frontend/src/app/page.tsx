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
        <div className="flex items-center justify-center h-screen bg-gray-200">
          <div className="container">
            <div className="bg-white rounded-lg shadow-lg p-5 md:p-20 mx-2">
              <div className="text-center">
                <h2 className="text-4xl tracking-tight leading-10 font-extrabold text-gray-900 sm:text-5xl sm:leading-none md:text-6xl">
                  ログイン<span className="text-indigo-600">成功</span>
                </h2>
                <h3 className="text-xl md:text-3xl mt-10">ようこそ！</h3>
                <p className="text-md md:text-xl mt-10">
                  シンプルなSNSで、気軽に投稿してみましょう。
                </p>
              </div>
              <div className="flex flex-wrap mt-10 justify-center">
                <div className="m-3">
                  <button
                    className="md:w-35 bg-white tracking-wide text-gray-800 font-bold rounded border-2 border-blue-600 hover:border-blue-600 hover:bg-blue-600 hover:text-white shadow-md py-2 px-6 inline-flex items-center"
                    onClick={() => router.push("/posts")}
                  >
                    投稿一覧へ
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Private>
    </AuthContext.Provider>
  );
}
