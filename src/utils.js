import * as dotenv from "dotenv";
import fetch from "node-fetch";
dotenv.config();

export function ghRequest(url, options) {
  options = options || {};
  const headers = options.headers || {};
  const token = process.env.GH_TOKEN;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return fetch(url, {
    ...options,
    headers: {
      ...headers,
      Accept: "application/vnd.github.v3+json",
    },
  });
}
