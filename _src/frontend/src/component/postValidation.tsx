import * as yup from "yup";
import { getPosts } from "@/infra/api";

export const postSchema = yup.object().shape({
  title: yup.string().required(`タイトルは必須です`),
  content: yup.string().required(`内容は必須です`),
  username: yup
    .string()
    .required(`ユーザー名は必須です`)
    .test(
      "sameusername",
      "ユーザー名が重複しています",
      async (input: string) => {
        const response = await getPosts();
        return !response.some((post: any) => post.username === input);
      }
    ),
});
