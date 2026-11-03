# 4. Vercel AI SDK – Features and Services

| Feature | Short summary |
|---|---|
| **AI SDK Core** | Main library for generating text, structured data, embeddings, and interacting with AI models. |
| **AI SDK UI** | Provides hooks such as `useChat` to build chat interfaces and handle streaming responses. |
| **AI Gateway** | Provides one endpoint to access multiple AI model providers. Supports model routing, fallbacks, API key management, usage tracking and cost monitoring. |
| **Vercel Connect** | Securely connects applications and AI agents to external services such as Slack, GitHub, Microsoft and Salesforce. Manages authentication and access tokens. |
| **MCP Integration** | Connects applications to MCP servers to discover and use external tools, resources and prompts. |
| **Tool Calling** | Allows AI models to request actions such as calling APIs, querying databases or executing application functions. |
| **Agents and Subagents** | Supports agents that perform multi-step tasks, use tools and delegate work to specialised agents. |
| **Workflows** | Helps build long-running AI processes that can pause, resume and continue even after function timeouts. |
| **Vercel Sandbox** | Provides an isolated environment to execute AI-generated code securely. |
| **AI Elements** | Provides reusable UI components for building AI-powered interfaces, such as chatbots and tool-based interactions. |

## Important Difference

Not everything listed above is part of the `ai` npm package.

- **Core SDK features:** AI SDK Core, AI SDK UI, tool calling, agents and MCP integration.
- **Separate Vercel services and products:** AI Gateway, Vercel Connect, Workflows, Sandbox and AI Elements.

These services can work together to build complete AI applications.

**Example:** An AI assistant can use AI SDK Core to interact with a model, AI Gateway to manage model requests, Vercel Connect to access GitHub, and Workflows to manage long-running tasks.

### Official references:
- [Vercel AI SDK – Documentation](https://ai-sdk.dev/docs?utm_source=chatgpt.com)
- [Vercel AI SDK – GitHub Repository](https://github.com/vercel/ai?utm_source=chatgpt.com)