import type {
  Article,
  ArticleOwner,
  ArticlesResponse,
} from "@/types/article";

const API_URL = process.env.BACKEND_URL;

export type User = {
  _id: string;
  name?: string;
  username?: string;
  avatarUrl?: string;
  avatar?: string;
  articlesAmount?: number;
};

export type { Article, ArticlesResponse };

export async function getArticleById(id: string): Promise<Article> {
  const response = await fetch(`${API_URL}/articles/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch article");
  }

  return response.json();
}

export async function getArticles(
  page = 1,
  limit = 20,
): Promise<ArticlesResponse> {
  const response = await fetch(
    `${API_URL}/articles?page=${page}&limit=${limit}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch articles");
  }

  return response.json();
}

export async function getUserById(
  owner: string | ArticleOwner,
): Promise<User> {
  const id = typeof owner === "string" ? owner : owner._id;

  const response = await fetch(`${API_URL}/users/${id}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }

  return response.json();
}
