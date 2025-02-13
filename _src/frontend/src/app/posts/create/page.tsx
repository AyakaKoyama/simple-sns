"use client";

import { getPosts, postPost } from "@/infra/api";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";

interface IFormInput {
  title: string;
  content: string;
  username: string;
}

// バリデーションスキーマを定義
const postSchema = yup.object().shape({
  title: yup.string().required(`タイトルは必須です`),
  content: yup.string().required(`内容は必須です`),
  username: yup
    .string()
    .required(`ユーザー名は必須です`)
    .test("sameusername", "ユーザー名が重複しています", async (input) => {
      const response = await getPosts();
      return !response.some((post: any) => post.username === input);
    }),
});

export default function createPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(postSchema), // yupを使ったバリデーションを設定
  });

  const postPostFunc = async (post: IFormInput) => {
    await postPost(post);
    if (router) {
      router.push("/posts");
    }
  };

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    postPostFunc(data);
    reset();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-indigo-800 dark:text-white mb-4">
        投稿作成
      </h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="title" className="block mb-2 text-indigo-500">
            タイトル
          </label>
          <input
            id="title"
            className="w-full p-2 mb-2 text-indigo-700 border-b-2 border-indigo-500 outline-none focus:bg-gray-300"
            type="text"
            {...register("title")}
          />
          {errors.title && (
            <p className="text-red-500">{errors.title.message}</p>
          )}{" "}
        </div>
        <div>
          <label htmlFor="content" className="block mb-2 text-indigo-500">
            内容
          </label>
          <input
            id="content"
            className="w-full p-2 mb-2 text-indigo-700 border-b-2 border-indigo-500 outline-none focus:bg-gray-300"
            type="text"
            {...register("content")}
          />
          {errors.content && (
            <p className="text-red-500">{errors.content.message}</p>
          )}{" "}
        </div>
        <div>
          <label htmlFor="username" className="block mb-2 text-indigo-500">
            ユーザー名
          </label>
          <input
            id="username"
            className="w-full p-2 mb-2 text-indigo-700 border-b-2 border-indigo-500 outline-none focus:bg-gray-300"
            type="text"
            {...register("username")}
          />
          {errors.username && (
            <p className="text-red-500">{errors.username.message}</p>
          )}{" "}
        </div>

        <button
          className="w-full bg-indigo-700 hover:bg-pink-700 text-white font-bold py-2 px-4 mb-6 rounded"
          type="submit"
          disabled={Object.keys(errors).length > 0} // エラーがある場合は無効化
        >
          投稿
        </button>
      </form>
    </div>
  );
}
