import axios from "axios";
import camelcaseKeys from "camelcase-keys";
import snakecaseKeys from "snakecase-keys";

axios.defaults.baseURL = process.env.REACT_APP_API_URL;
axios.defaults.headers.common["Content-Type"] = "application/json";

export const postPost = async (params: any) =>
  axios.post("/posts", snakecaseKeys(params));

export const getPost = async (params: any) =>
  axios({
    method: "get",
    url: `/posts/${params}`,
  }).then((response) => camelcaseKeys(response.data, { deep: true }));

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
  }).then((response) => camelcaseKeys(response.data, { deep: true }));
