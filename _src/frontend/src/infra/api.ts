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

export const getPost = async (params: any) =>
  axios({
    method: "get",
    url: `/posts/${params}`,
    responseType: "blob", // ← 追加：画像を Blob で取得
  })
    .then((response) => {
      return URL.createObjectURL(response.data); // Blob を URL に変換
    })

    .catch((error) => {
      console.error(error);
      throw error;
    });

export const updatePost = async (params: any, data: any) =>
  axios({
    method: "put",
    url: `/posts/${params}`,
    data: snakecaseKeys(data),
  }).then((response) => camelcaseKeys(response.data, { deep: true }));

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
