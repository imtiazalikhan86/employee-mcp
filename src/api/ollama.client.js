export class OllamaClient {
  constructor({
    baseUrl = "http://localhost:11434",
    model = "llama3.2:latest",
  } = {}) {
    this.baseUrl = baseUrl;
    this.model = model;
  }

  async chat(messages, tools = []) {
    const response = await fetch(`${this.baseUrl}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: this.model,
        messages,
        tools,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Ollama request failed: ${response.status} ${response.statusText}`,
      );
    }

    return response.json();
  }
}
