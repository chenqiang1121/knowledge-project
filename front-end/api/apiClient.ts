// TODO: 封装用户端 REST API 调用，后续统一处理 token、错误提示和请求追踪。
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

export async function searchKnowledge(query: string) {
  // TODO: 调用 /api/knowledge/search 并返回规范化结果。
  const response = await fetch(`${API_BASE_URL}/api/knowledge/search?query=${encodeURIComponent(query)}`);
  return response.json();
}

export async function getDocumentDetail(id: string) {
  // TODO: 调用 /api/knowledge/document，后续改为 RESTful 路径或查询参数。
  const response = await fetch(`${API_BASE_URL}/api/knowledge/document?id=${encodeURIComponent(id)}`);
  return response.json();
}
