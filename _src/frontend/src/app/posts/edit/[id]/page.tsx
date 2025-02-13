"use client";
import { getPost, getPosts, postPost, updatePost } from "@/infra/api";
import { SubmitHandler, useForm, useFormState } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter, useParams } from "next/navigation"; // 修正
import { useState, useEffect, useCallback } from "react";

interface IFormInput {
  title: string;
  content: string;
}
const postSchema = yup.object().shape({
  title: yup.string().required(`タイトルは必須です`),
  content: yup.string().required(`内容は必須です`),
});

export default function editPage() {
  const router = useRouter();
  const { id } = useParams(); // 修正

  console.log(id);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(postSchema),
  });

  useEffect(() => {
    if (id) {
      // idが配列の場合は最初の要素を、文字列の場合はそのまま使用
      const postId = Array.isArray(id) ? id[0] : id;
      fetchPost(postId);
    } else {
      console.log("id is empty");
      setLoading(false);
    }
  }, [id]);

  const fetchPost = async (postId: string) => {
    try {
      const response = await getPost(postId);
      console.log(response);
      setValue("title", response.title);
      setValue("content", response.content);
      setLoading(false);
    } catch (error: any) {
      setError(error.message);
      setLoading(false);
    }
  };

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      await updatePost(id, data);
      router.push(`/posts`);
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-indigo-800 dark:text-white mb-4">
        投稿編集
      </h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label className="block mb-2 text-indigo-500">タイトル</label>
          <input
            type="text"
            {...register("title")}
            className="w-full p-2 mb-2 text-gray-700 border-b-2 border-indigo-500 outline-none focus:bg-gray-300"
          />
          {errors.title && (
            <p className="text-red-500">{errors.title.message}</p>
          )}{" "}
        </div>
        <div>
          <label className="block mb-2 text-indigo-500">内容</label>
          <textarea
            {...register("content")}
            className="w-full p-2 mb-2 text-gray-700 border-b-2 border-indigo-500 outline-none focus:bg-gray-300"
          />
          {errors.content && (
            <p className="text-red-500">{errors.content.message}</p>
          )}{" "}
        </div>
        <button
          type="submit"
          className="bg-indigo-800 text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-800 focus:ring-offset-2 dark:focus:ring-offset-gray-800 mt-4"
        >
          更新
        </button>
      </form>
    </div>
  );
}
