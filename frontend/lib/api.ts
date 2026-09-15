import type { ArticlesResponse } from "@/types/article";
import axios from "axios";

export type { ArticlesResponse };

export type RegisterRequest = {
  email: string;
  password: string;
  username: string;
};
export type User = {
  id: string;
  email: string;
  userName?: string;
  photoUrl?: string;
  createdAt: Date;
  updatedAt: Date;
};
export type LoginRequest = {
  email: string;
  password: string;
};

const nextServer = axios.create({
  baseURL: "/api",
  withCredentials: true,
});
export const register = async (data: RegisterRequest) => {
  const res = await nextServer.post<User>("/auth/register", data);
  return res.data;
};
export const login = async (data: LoginRequest) => {
  const res = await nextServer.post<User>("/auth/login", data);

  return res.data;
};

export type ArticlesFilter = "all" | "popular";

export async function getArticles(
  page: number = 1,
  limit: number = 6,
  filter: ArticlesFilter = "all",
): Promise<ArticlesResponse> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (filter === "popular") {
    params.set("filter", "popular");
  }

  const response = await fetch(`/api/articles?${params.toString()}`);

  if (!response.ok) {
    throw new Error("Failed to fetch articles");
  }

  return response.json();
}

export function getPopularArticles(
  limit: number = 4,
): Promise<ArticlesResponse> {
  return getArticles(1, limit, "popular");
}
