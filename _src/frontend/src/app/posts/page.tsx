"use client";
import DeleteModal from "@/component/deleteModal";
import { deletePost, getPosts } from "@/infra/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export type Post = {
  id: number;
  title: string;
  content: string;
  username: string;
  image?: File | string;
  imageUrl?: string; // この行を追加
};
export default function Page() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [postToDelete, setPostToDelete] = useState<number | null>(null);
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
  //console.log(posts[0].image);

  const openDeleteModal = (id: number) => {
    setPostToDelete(id);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setPostToDelete(null);
  };
  const onDelete = async (id: number) => {
    try {
      const response = await deletePost(id);
      if (response) {
        fetchData();
        setDeleteModalOpen(false);
      } else {
        throw new Error("削除に失敗しました");
      }
    } catch (error: any) {
      setError(error.message);
    }
  };

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
                className="rounded-xl overflow-hidden flex shadow hover:shadow-md max-w-md bg-white cursor-pointer h-35 mb-4"
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
                <div className="text-sm text-text2 tracking-wider">
                  {post.imageUrl && (
                    <img
                      src={post.imageUrl}
                      alt="プレビュー"
                      className="mt-2 max-w-xs rounded"
                    />
                  )}
                </div>
                <button
                  className="text-indigo-800 hover:text-blue-600 text-base bg-white hover:bg-slate-100 border border-slate-200 rounded-l-lg font-medium px-6 py-3 inline-flex space-x-1 items-center"
                  onClick={() => router.push(`/posts/edit/${post.id}`)}
                  data-testid="edit-button"
                >
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-10 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                      />
                    </svg>
                  </span>
                </button>
                <button
                  className="text-slate-800 hover:text-blue-600 text-base bg-white hover:bg-slate-100 border border-slate-200 rounded-r-lg font-medium px-6 py-3 inline-flex space-x-1 items-center"
                  onClick={() => openDeleteModal(post.id)}
                  data-testid="delete-modal-button"
                >
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-10 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                  </span>
                </button>
              </div>
            ))}
          </ul>
          {isDeleteModalOpen && (
            <DeleteModal
              isOpen={isDeleteModalOpen}
              onRequestClose={closeDeleteModal}
              onDelete={() => {
                if (postToDelete !== null) {
                  onDelete(postToDelete);
                }
              }}
            />
          )}
        </>
      ) : (
        <p>投稿がありません</p>
      )}
    </div>
  );
}
