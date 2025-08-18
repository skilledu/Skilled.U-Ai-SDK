# Usage example for the Python SDK
# Requirements: Python 3.8+, no external dependencies
# Run: python sdk_python_usage.py

from sdk_python import SkilledUAIClient

BASE_URL = "https://api.skilledu.in/api/ai_gateway.php"  # Production endpoint

def main() -> None:
	client = SkilledUAIClient(BASE_URL)

	print("== List models (active platform) ==")
	try:
		models = client.list_models()
		print(models)
	except Exception as e:
		print("Error listing models:", e)

	print("\n== Chat (minimal) ==")
	try:
		reply = client.chat(message="Hello from Python SDK usage file!")
		print(reply)
	except Exception as e:
		print("Chat error:", e)

	print("\n== Chat (system/user) ==")
	try:
		reply = client.chat(system="You are helpful.", user="Who are you?")
		print(reply)
	except Exception as e:
		print("Chat error (system/user):", e)

	print("\n== Chat (assistant only) ==")
	try:
		reply = client.chat(assistant="Previously, I summarized the topic.")
		print(reply)
	except Exception as e:
		print("Chat error (assistant):", e)

	print("\n== Chat (messages array) ==")
	try:
		reply = client.chat(messages=[
			{"role": "system", "content": "You are a concise assistant."},
			{"role": "user", "content": "Explain LLMs briefly."},
		])
		print(reply)
	except Exception as e:
		print("Chat error (messages):", e)

	print("\n== Chat (with options) ==")
	try:
		reply = client.chat(
			message="Write a one-liner motivational quote.",
			temperature=0.6,
			max_tokens=120,
		)
		print(reply)
	except Exception as e:
		print("Chat error (options):", e)

if __name__ == "__main__":
	main()