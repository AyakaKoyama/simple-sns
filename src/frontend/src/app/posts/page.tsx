"use client";
import { getPost, getPosts } from "@/infra/api";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

type Post = {
  id: number;
  title: string;
  content: string;
  username: string;
};
export default function Page() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const response = await getPosts();
      console.log(response);
      setPosts(response);
      setLoading(false);
    } catch (error: any) {
      setError(error.message);

      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-indigo-800 dark:text-white mb-4">
        投稿一覧
      </h2>
      <button
        className="bg-indigo-800 text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-800 focus:ring-offset-2 dark:focus:ring-offset-gray-800 mb-4"
        onClick={() => router.push("/posts/create")}
      >
        新規作成
      </button>
      {loading ? (
        <p>loading...</p>
      ) : error ? (
        <p>Error:{error}</p>
      ) : posts.length > 0 ? (
        <>
          <ul>
            {posts.map((post: any) => (
              <div
                key={post.id}
                className="rounded-xl overflow-hidden flex shadow hover:shadow-md max-w-sm bg-white cursor-pointer h-28 mb-4"
              >
                <div className="w-7/12 pl-3 p-3 text-text1 flex flex-col justify-center">
                  <p
                    className="text-base mb-2 font-bold truncate text-indigo-500"
                    onClick={() => router.push(`/posts/${post.id}`)}
                  >
                    {post.title}
                  </p>
                  <p className="font-bold tracking-wide text-sm text-gray-700">
                    {post.content}
                  </p>
                  <div className="text-sm text-text2 tracking-wider">
                    {post.username}
                  </div>
                </div>
              </div>
            ))}
          </ul>
        </>
      ) : (
        <p>投稿がありません</p>
      )}
    </div>
  );
}
