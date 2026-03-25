import requests

API_KEY = "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"


URL = "https://openrouter.ai/api/v1/chat/completions"

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json",
    "HTTP-Referer": "http://localhost",
    "X-Title": "Terminal Chat Bot"
}

# Conversation memory
messages = [
    {"role": "system", "content": "You are a helpful AI assistant."}
]

print("🤖 AI Chat started (type 'exit' to quit)\n")

while True:
    user_input = input("You: ")
    if user_input.lower() == "exit":
        print("👋 Chat ended")
        break

    messages.append({"role": "user", "content": user_input})

    response = requests.post(
        URL,
        headers=headers,
        json={
            "model": "deepseek/deepseek-chat",
            "messages": messages,
            "temperature": 0.3
        }
    )

    ai_message = response.json()["choices"][0]["message"]["content"]
    print("AI:", ai_message, "\n")

    messages.append({"role": "assistant", "content": ai_message})
