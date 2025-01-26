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
      const res = await getPosts();
      console.log(res);
      //setPosts(res);
      setLoading(false);
    } catch (error: any) {
      setError(error);

      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h2>投稿一覧</h2>
      <button onClick={() => router.push("/posts/create")}>新規作成</button>
      {loading ? (
        <p>loading...</p>
      ) : error ? (
        <p>Error:{error}</p>
      ) : posts.length > 0 ? (
        <>
          <ul>
            {posts.map((post: any) => (
              <li key={post.id}>
                <a onClick={() => router.push(`/posts/${post.id}`)}>
                  {post.title}
                </a>
                <a>{post.content}</a>
                <a>{post.username}</a>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>投稿がありません</p>
      )}
    </div>
  );
}
