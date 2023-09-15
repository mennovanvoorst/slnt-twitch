import axios, { AxiosError } from "axios";
import { HttpResponse, HttpRequest } from "@interfaces/http";
import config from "@config";

export const get = async ({
  endpoint,
  params
}: HttpRequest): Promise<HttpResponse> =>
  axios
    .get(`${config.server_url}${config.api.prefix}${endpoint}`, {
      params: { ...params },
      withCredentials: true
    })
    .then((res) => ({ success: true, payload: res.data }))
    .catch((e: AxiosError) => {
      console.log(e);
      return { success: false, payload: e.message };
    });

export const post = async ({
  endpoint,
  data
}: HttpRequest): Promise<HttpResponse> =>
  axios(`${config.server_url}${config.api.prefix}${endpoint}`, {
    method: "post",
    data: { ...data },
    withCredentials: true
  })
    .then((res) => ({ success: true, payload: res.data }))
    .catch((e: AxiosError) => {
      console.log(e);
      return { success: false, payload: e.message };
    });
