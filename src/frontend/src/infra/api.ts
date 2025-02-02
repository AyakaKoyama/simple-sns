import axios from "axios";
import camelcaseKeys from "camelcase-keys";
import snakecaseKeys from "snakecase-keys";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;
axios.defaults.headers.common["Content-Type"] = "application/json";

export const postPost = async (params: any) =>
  axios
    .post("/posts", snakecaseKeys(params), {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      console.log(response.data);
      return camelcaseKeys(response.data, { deep: true });
    })
    .catch(function (error) {
      if (error.response) {
        // リクエストが行われ、サーバーは 2xx の範囲から外れるステータスコードで応答しました
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // リクエストは行われましたが、応答がありませんでした
        // `error.request` は、ブラウザでは XMLHttpRequest のインスタンスになり、
        // Node.js では http.ClientRequest のインスタンスになります。
        console.log(error.request);
      } else {
        // エラーをトリガーしたリクエストの設定中に何かが発生しました
        console.log("Error", error.message);
      }
      console.log(error.config);
      throw error; // エラーを再スロー
    });

export const getPost = async (params: any) =>
  axios({
    method: "get",
    url: `/posts/${params}`,
  })
    .then((response) => camelcaseKeys(response.data, { deep: true }))

    .catch(function (error) {
      if (error.response) {
        // リクエストが行われ、サーバーは 2xx の範囲から外れるステータスコードで応答しました
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // リクエストは行われましたが、応答がありませんでした
        // `error.request` は、ブラウザでは XMLHttpRequest のインスタンスになり、
        // Node.js では http.ClientRequest のインスタンスになります。
        console.log(error.request);
      } else {
        // エラーをトリガーしたリクエストの設定中に何かが発生しました
        console.log("Error", error.message);
      }
      console.log(error.config);
      throw error; // エラーを再スロー
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
    .catch(function (error) {
      if (error.response) {
        // リクエストが行われ、サーバーは 2xx の範囲から外れるステータスコードで応答しました
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // リクエストは行われましたが、応答がありませんでした
        // `error.request` は、ブラウザでは XMLHttpRequest のインスタンスになり、
        // Node.js では http.ClientRequest のインスタンスになります。
        console.log(error.request);
      } else {
        // エラーをトリガーしたリクエストの設定中に何かが発生しました
        console.log("Error", error.message);
      }
      console.log(error.config);
      throw error; // エラーを再スロー
    });
