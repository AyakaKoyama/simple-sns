"use client";
import Cookies from "js-cookie";
import { signIn } from "@/infra/auth";
import { useContext, useState } from "react";
import { AuthContext } from "../page";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { authSchema } from "@/component/authValidation";

interface IFormInput {
  email: string;
  password: string;
  //validationとの互換
  confirmPassword: string;
}
export default function Page() {
  const { setIsSignedIn, setCurrentUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(authSchema),
  });

  const generateParams = () => {
    const signInParams = {
      email: email,
      password: password,
    };
    return signInParams;
  };

  const onSubmit: SubmitHandler<IFormInput> = async () => {
    const params = generateParams();

    try {
      const res = await signIn(params);
      if (res.status === 200) {
        Cookies.set("_access_token", res.headers["access-token"]);
        Cookies.set("_client", res.headers["client"]);
        Cookies.set("_uid", res.headers["uid"]);

        setIsSignedIn(true);
        setCurrentUser(res.data.data);

        router.push("/");
      }
    } catch (e) {
      console.log(e);
    }
    reset();
  };
  return (
    <>
      <h2 className="text-2xl font-bold text-indigo-800 dark:text-white mb-4">
        サインイン
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} aria-label="signin-form">
        <div>
          <label htmlFor="email" className="block mb-2 text-indigo-500">
            メールアドレス
          </label>
          <input
            className="w-full p-2 mb-2 text-indigo-700 border-b-2 border-indigo-500 outline-none focus:bg-gray-300"
            type="email"
            id="email"
            {...register("email")}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && (
            <p className="text-red-500">{errors.email.message}</p>
          )}{" "}
        </div>
        <div>
          <label htmlFor="password" className="block mb-2 text-indigo-500">
            パスワード
          </label>
          <input
            className="w-full p-2 mb-2 text-indigo-700 border-b-2 border-indigo-500 outline-none focus:bg-gray-300"
            type="password"
            id="password"
            {...register("password")}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && (
            <p className="text-red-500">{errors.password.message}</p>
          )}{" "}
        </div>
        <button
          type="submit"
          className="bg-indigo-800 text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-800 focus:ring-offset-2 dark:focus:ring-offset-gray-800 mb-4"
          disabled={Object.keys(errors).length > 0}
        >
          登録
        </button>
      </form>
      <button
        className="bg-indigo-800 text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-800 focus:ring-offset-2 dark:focus:ring-offset-gray-800 mb-4"
        onClick={() => router.push("/signup")}
      >
        サインアップへ
      </button>
    </>
  );
}
