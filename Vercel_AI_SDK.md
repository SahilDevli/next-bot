
Vercel AI SDK is an open-source TypeScript toolkit used to integrate AI models into applications.

## Why do we use it?

Normally, when integrating an AI model directly, developers need to handle API requests, response formats, streaming, tool calls, and other provider-specific details.
Vercel AI SDK provides ready-to-use functions and abstractions for these operations, reducing the amount of code developers need to write.

## Key Features

1. Multiple Model Providers: Integrate different AI models through a common interface. Switching supported providers generally requires only a small code change.

2. Text Generation: Generate responses from an AI model using functions such as generateText().

3. Streaming Responses: Display AI responses in real time instead of waiting for the complete response. This is especially useful for chatbot applications.

4. Structured Output: Generate structured data, such as JSON, according to a predefined schema instead of receiving only plain text.

5. Tool Calling: Allow AI models to request the execution of application functions. For example, an AI assistant can call a function to search products, retrieve order details, or create a support ticket.

6. Embeddings: Convert text into numerical vectors using embedding models. These vectors can be stored in a vector database and used for semantic search and RAG applications.

7. Agent Development: Build AI agents that can use tools and perform multiple steps to complete a task.

8. UI Integration: Provides hooks such as useChat() for integrating AI-powered conversations into frontend applications built with React and other supported frameworks.

## How does it work?

Vercel AI SDK acts as an integration layer between our application and AI model providers.
Basic Architecture: Application → Vercel AI SDK → AI Model Provider → AI Model → Response


1. AI SDK vs Traditional way to use LLM in your APP?


- Traditional way: via http requests -> LLM models with prompt
```
const response = await fetch(
"https://ollama.com/v1/chat/completions",
{
    method: "POST",
    headers: {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
    },
    body: JSON.stringify({
    model: "gemma4:31b",
    messages: [
        { role: "user", content: "Explain RAG" }
    ],
    }),
}
);
```

- AI SDK 
```
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

const { text } = await generateText({
model: openai("gpt-4.1-mini"),
prompt: "Explain RAG",
});
```

### Official references:
- [Vercel AI SDK – Documentation](https://ai-sdk.dev/docs?utm_source=chatgpt.com)
- [Vercel AI SDK – GitHub Repository](https://github.com/vercel/ai?utm_source=chatgpt.com)