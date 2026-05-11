// TODO: 封装管理端 REST API 调用，后续接入 Refine dataProvider/authProvider。
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

export async function login() {
  // TODO: 调用 /api/auth/login，后续传入用户名、密码和验证码。
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, { method: "POST" });
  return response.json();
}

export async function getUsers() {
  // TODO: 调用 /api/user/* 用户管理接口。
  const response = await fetch(`${API_BASE_URL}/api/user/placeholder`);
  return response.json();
}

export async function getDocuments() {
  // TODO: 调用 /api/knowledge/* 文档管理接口。
  const response = await fetch(`${API_BASE_URL}/api/knowledge/search`);
  return response.json();
}
