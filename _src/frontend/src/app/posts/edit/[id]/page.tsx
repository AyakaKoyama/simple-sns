"use client";
import { getPost, getPosts, postPost, updatePost } from "@/infra/api";
import { SubmitHandler, useForm, useFormState } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter, useParams } from "next/navigation"; // 修正
import { useState, useEffect, useCallback } from "react";
import ImagePreview from "@/component/ImagePreview";
import { Post } from "@/types/post";

interface IFormInput {
  title: string;
  content: string;
  image?: File | null;
  imageUrl?: string;
}
export const postSchema = yup.object().shape({
  title: yup.string().required(`タイトルは必須です`),
  content: yup.string().required(`内容は必須です`),
});

export default function editPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
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
      //const postId = Array.isArray(id) ? id[0] : id;
      fetchPost(id);
    } else {
      console.log("id is empty");
      setLoading(false);
    }
  }, [id]);

  const fetchPost = async (postId: string) => {
    try {
      const response: Post = await getPost(postId);
      console.log(response);

      setValue("title", response.title);
      setValue("content", response.content);
      setImageUrl(response.imageUrl || null);
      setLoading(false);
      console.log(response.imageUrl);
    } catch (error: any) {
      setError(error.message);
      setLoading(false);
    }
  };

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("content", data.content);
      if (image) {
        formData.append("image", image);
      }
      await updatePost(id, formData);
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
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="タイトル"
          >
            タイトル
          </label>
          <input
            type="text"
            {...register("title")}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          ></input>
          {errors.title && (
            <p className="text-red-500">{errors.title.message}</p>
          )}{" "}
        </div>
        <div>
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="内容"
          >
            内容
          </label>
          <textarea
            {...register("content")}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {errors.content && (
            <p className="text-red-500">{errors.content.message}</p>
          )}{" "}
        </div>
        <div className="mb-4">
          <ImagePreview onImageSelect={setImage} imageUrl={imageUrl} />
        </div>
        <div className="w-1/4 p-3 flex items-start">
          {imageUrl && (
            <div className="w-16 h-16 rounded-full overflow-hidden">
              <img
                src={imageUrl}
                alt={`投稿画像: ${imageUrl}`}
                className="w-full h-full object-cover"
              />
            </div>
          )}
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
