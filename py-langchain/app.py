"""TODO: FastAPI 服务占位，后续提供 Java 后端调用的向量化与检索接口。"""

from fastapi import FastAPI

from langchain_service import search_knowledge

app = FastAPI(title="Knowledge LangChain Service")


@app.get("/health")
def health_check() -> dict[str, str]:
    """TODO: 健康检查占位，后续补充依赖状态。"""
    return {"status": "ok", "message": "TODO: FastAPI placeholder"}


@app.get("/knowledge/search")
def search(query: str) -> dict[str, object]:
    """TODO: 知识库检索接口占位，后续接入 LangChain Retriever。"""
    return search_knowledge(query)
