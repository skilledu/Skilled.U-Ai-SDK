# Minimal Python SDK for Skilled.U AI API
# Usage:
#   from sdk_python import SkilledUAIClient
#   client = SkilledUAIClient(base_url="http://localhost/ai_gateway.php")
#   print(client.chat(message="Hello!"))
#   print(client.list_models())

from urllib import request, error
import json
from typing import Any, Dict, List, Optional, Sequence


class SkilledUAIClient:
    def __init__(self, base_url: str) -> None:
        if not base_url:
            raise ValueError("base_url is required")
        self.base_url = base_url.rstrip("/")

    def _http_get(self, url: str, timeout: int = 60) -> Dict[str, Any]:
        req = request.Request(url, headers={"Accept": "application/json"})
        try:
            with request.urlopen(req, timeout=timeout) as resp:
                data = resp.read().decode("utf-8")
                return json.loads(data) if data else {}
        except error.HTTPError as e:
            body = e.read().decode("utf-8") if hasattr(e, "read") else ""
            raise RuntimeError(f"HTTP {e.code}: {body}")
        except error.URLError as e:
            raise RuntimeError(f"Network error: {e}")

    def _http_post(self, url: str, payload: Dict[str, Any], timeout: int = 60) -> Dict[str, Any]:
        body = json.dumps(payload).encode("utf-8")
        headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
        }
        req = request.Request(url, data=body, headers=headers, method="POST")
        try:
            with request.urlopen(req, timeout=timeout) as resp:
                data = resp.read().decode("utf-8")
                return json.loads(data) if data else {}
        except error.HTTPError as e:
            body = e.read().decode("utf-8") if hasattr(e, "read") else ""
            raise RuntimeError(f"HTTP {e.code}: {body}")
        except error.URLError as e:
            raise RuntimeError(f"Network error: {e}")

    def chat(
        self,
        message: Optional[str] = None,
        *,
        system: Optional[str] = None,
        user: Optional[str] = None,
        assistant: Optional[str] = None,
        messages: Optional[Sequence[Dict[str, str]]] = None,
        model: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: int = 1000,
        timeout: int = 60,
    ) -> str:
        if not message and not (system or user or assistant) and not messages:
            raise ValueError("Provide message, or system/user/assistant, or messages[]")
        payload: Dict[str, Any] = {
            "temperature": temperature,
            "max_tokens": max_tokens,
        }
        if model:
            payload["model"] = model
        if messages:
            payload["messages"] = list(messages)
        else:
            if system:
                payload["system"] = system
            if user:
                payload["user"] = user
            if assistant:
                payload["assistant"] = assistant
            if message:
                payload["message"] = message

        result = self._http_post(self.base_url, payload, timeout=timeout)
        if not isinstance(result, dict):
            raise RuntimeError("Invalid response from server")
        if not result.get("success"):
            raise RuntimeError(result.get("error") or "Request failed")
        return str(result.get("response", ""))

    def list_models(self, timeout: int = 30) -> List[str]:
        url = f"{self.base_url}?action=models"
        result = self._http_get(url, timeout=timeout)
        if not isinstance(result, dict):
            raise RuntimeError("Invalid response from server")
        if not result.get("success"):
            raise RuntimeError(result.get("error") or "Request failed")
        models = result.get("models") or []
        if not isinstance(models, list):
            return []
        return [str(m) for m in models]