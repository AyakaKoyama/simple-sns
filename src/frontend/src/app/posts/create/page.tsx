"use client";

import { postPost } from "@/infra/api";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [username, setUsername] = useState("");
  const router = useRouter();

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value);
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const postPostFunc = async (post: {
    title: string;
    content: string;
    username: string;
  }) => {
    await postPost(post);
    //router.push("/posts");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newPost = { title: title, content: content, username: username };
    await postPostFunc(newPost);

    setTitle("");
    setContent("");
    setUsername("");
  };

  return (
    <div>
      <h2>投稿作成</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label className="block mb-2 text-indigo-500">タイトル</label>
          <input
            className="w-full p-2 mb-6 text-indigo-700 border-b-2 border-indigo-500 outline-none focus:bg-gray-300"
            type="text"
            value={title}
            onChange={handleTitleChange}
          />
        </div>
        <div>
          <label className="block mb-2 text-indigo-500">内容</label>
          <input
            className="w-full p-2 mb-6 text-indigo-700 border-b-2 border-indigo-500 outline-none focus:bg-gray-300"
            type="text"
            value={content}
            onChange={handleContentChange}
          />
        </div>
        <div>
          <label className="block mb-2 text-indigo-500">ユーザー名</label>
          <input
            className="w-full p-2 mb-6 text-indigo-700 border-b-2 border-indigo-500 outline-none focus:bg-gray-300"
            type="text"
            name="username"
            onChange={handleUsernameChange}
          />
        </div>
        <button
          className="w-full bg-indigo-700 hover:bg-pink-700 text-white font-bold py-2 px-4 mb-6 rounded"
          type="submit"
        >
          投稿
        </button>
      </form>
    </div>
  );
}
