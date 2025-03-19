import * as yup from "yup";
import { getCurrentUser } from "@/infra/auth";

export const authSchema = yup.object().shape({
  password: yup.string().required(`パスワードは必須です`),
  confirmPassword: yup.string().required(`確認用パスワードは必須です`),
  email: yup
    .string()
    .required(`メールアドレスは必須です`)
    .test(
      "sameusername",
      "メールアドレスが重複しています",
      async (input: string) => {
        try {
          const response = await getCurrentUser();
          return !(
            response?.data?.some((user: any) => user.email === input) ?? false
          );
        } catch (error) {
          return false;
        }
      }
    ),
});
