import { Post } from "@/types/post";
import axios from "axios";
import camelcaseKeys from "camelcase-keys";
import snakecaseKeys from "snakecase-keys";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;
axios.defaults.headers.common["Content-Type"] = "application/json";

export const postPost = async (params: any) =>
  axios
    .post("/posts", params, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => {
      console.log(response.data);
      return response.data;
    })
    .catch((error) => {
      console.error(error);
      throw error;
    });

export const getPost = async (id: string): Promise<Post> => {
  try {
    const response = await axios.get(`/posts/${id}`);
    return camelcaseKeys(response.data, { deep: true });
  } catch (error: any) {
    console.error(error);
    throw error;
  }
};

export const updatePost = async (id: string, data: FormData) => {
  try {
    const response = await axios({
      method: "put",
      url: `/posts/${id}`,
      data: data,
      headers: {
        "Content-Type": "multipart/form-data", // Set the correct content type
      },
    });
    return camelcaseKeys(response.data, { deep: true });
  } catch (error: any) {
    console.error(error);
    throw error;
  }
};

export const deletePost = async (params: any) =>
  axios({
    method: "delete",
    url: `/posts/${params}`,
  });

export const getPosts = async () =>
  axios({
    method: "get",
    url: `/posts`,
  })
    .then((response) => {
      console.log(response);
      return camelcaseKeys(response.data, { deep: true });
    })
    .catch((error) => {
      console.error(error);
      throw error;
    });
