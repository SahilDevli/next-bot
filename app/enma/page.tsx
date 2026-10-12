"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import styles from "./enma.module.scss";

type Source = {
  source: string;
  section: string | null;
  clause: string | null;
  subsection: string | null;
  similarity: number;
};

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  attachment?: string;
  sources?: Source[];
};;

type IconName =
  | "aura"
  | "panel"
  | "plus"
  | "search"
  | "history"
  | "library"
  | "settings"
  | "paperclip"
  | "arrow-up"
  | "x"
  | "sparkles"
  | "shield"
  | "chevron";

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };

  switch (name) {
    case "aura":
      return (
        <svg {...common} viewBox="0 0 32 32">
          <path d="M16 2.5 19.7 11l8.8 3.9-8.8 3.7L16 27.5l-3.7-8.9-8.8-3.7L12.3 11 16 2.5Z" />
          <path d="m16 9 1.8 4.2L22 15l-4.2 1.8L16 21l-1.8-4.2L10 15l4.2-1.8L16 9Z" />
        </svg>
      );

    case "panel":
      return (
        <svg {...common}>
          <rect x="3" y="4" width="18" height="16" rx="3" />
          <path d="M9 4v16" />
        </svg>
      );

    case "plus":
      return (
        <svg {...common}>
          <path d="M12 5v14M5 12h14" />
        </svg>
      );

    case "search":
      return (
        <svg {...common}>
          <circle cx="10.8" cy="10.8" r="6.8" />
          <path d="m16 16 4.5 4.5" />
        </svg>
      );

    case "history":
      return (
        <svg {...common}>
          <path d="M3.5 11a8.5 8.5 0 1 1 2.2 6" />
          <path d="M3.5 4.5V11H10M12 7v5l3.2 2" />
        </svg>
      );

    case "library":
      return (
        <svg {...common}>
          <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 1 4 17.5v-12Z" />
          <path d="M4 17.5A2.5 2.5 0 0 1 6.5 15H20M8 7h8M8 10h6" />
        </svg>
      );

    case "settings":
      return (
        <svg {...common}>
          <circle cx="12" cy="10" r="2.5" />
          <path d="m19.4 15 .1.1a1.8 1.8 0 1 1-2.5 2.5l-.1-.1a1.8 1.8 0 0 0-3 .9v.2a1.8 1.8 0 1 1-3.6 0v-.2a1.8 1.8 0 0 0-3-.9l-.1.1a1.8 1.8 0 1 1-2.5-2.5l.1-.1a1.8 1.8 0 0 0-.9-3h-.2a1.8 1.8 0 1 1 0-3.6h.2a1.8 1.8 0 0 0 .9-3l-.1-.1a1.8 1.8 0 1 1 2.5-2.5l.1.1a1.8 1.8 0 0 0 3-.9v-.2a1.8 1.8 0 1 1 3.6 0v.2a1.8 1.8 0 0 0 3 .9l.1-.1a1.8 1.8 0 1 1 2.5 2.5l-.1.1a1.8 1.8 0 0 0 .9 3h.2a1.8 1.8 0 1 1 0 3.6h-.2a1.8 1.8 0 0 0-.9 3Z" />
        </svg>
      );

    case "paperclip":
      return (
        <svg {...common}>
          <path d="m8.5 12.5 6.8-6.8a3.2 3.2 0 0 1 4.5 4.5l-8.9 8.9a5 5 0 0 1-7.1-7.1l8.5-8.5" />
        </svg>
      );

    case "arrow-up":
      return (
        <svg {...common}>
          <path d="M12 19V5M6.5 10.5 12 5l5.5 5.5" />
        </svg>
      );

    case "x":
      return (
        <svg {...common}>
          <path d="m6 6 12 12M18 6 6 18" />
        </svg>
      );

    case "sparkles":
      return (
        <svg {...common}>
          <path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3Z" />
          <path d="m19 15 .9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15ZM5 2l.7 1.8L7.5 4.5l-1.8.7L5 7l-.7-1.8-1.8-.7 1.8-.7L5 2Z" />
        </svg>
      );

    case "shield":
      return (
        <svg {...common}>
          <path d="M12 3 19 6v5.2c0 4.7-2.9 7.9-7 9.8-4.1-1.9-7-5.1-7-9.8V6l7-3Z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );

    case "chevron":
      return (
        <svg {...common}>
          <path d="m9 18 6-6-6-6" />
        </svg>
      );

    default:
      return null;
  }
}

const starterPrompts = [
  {
    title: "Learn something",
    description: "Explain a complex topic simply",
    prompt: "Explain the JavaScript event loop in a clear, visual way.",
    symbol: "01",
  },
  {
    title: "Build something",
    description: "Turn an idea into a plan",
    prompt: "Help me plan a clean, scalable Next.js chat application.",
    symbol: "02",
  },
  {
    title: "Think it through",
    description: "Explore options and trade-offs",
    prompt: "Help me compare a few approaches and choose the best one.",
    symbol: "03",
  },
  {
    title: "Write with clarity",
    description: "Shape rough thoughts into words",
    prompt: "Help me turn a rough idea into a concise, polished message.",
    symbol: "04",
  },
];

const sampleChats: { title: string; messages: Message[] }[] = [
  {
    title: "Understanding async JavaScript",
    messages: [
      {
        id: "async-user",
        role: "user",
        content: "Can you explain promises vs async/await?",
      },
      {
        id: "async-assistant",
        role: "assistant",
        content:
          "A Promise represents a value that may be available later. `async/await` is syntax that makes working with promises read more like sequential code. An async function always returns a Promise, and `await` pauses that function until the promise settles—not the entire JavaScript thread.",
      },
    ],
  },
  {
    title: "RAG architecture for ENMA",
    messages: [
      {
        id: "rag-user",
        role: "user",
        content: "What is the basic flow for a RAG chatbot?",
      },
      {
        id: "rag-assistant",
        role: "assistant",
        content:
          "A typical RAG flow has two stages. First, ingest your documents: parse, chunk, embed, and store vectors. At question time, embed the query, retrieve the most relevant chunks, and pass those chunks to your model as context before generating an answer.",
      },
    ],
  },
  {
    title: "Next.js App Router basics",
    messages: [
      {
        id: "next-user",
        role: "user",
        content: "When should I use a client component?",
      },
      {
        id: "next-assistant",
        role: "assistant",
        content:
          "Start with Server Components by default. Add `use client` at the smallest component boundary that needs browser APIs, state, event handlers, or effects. This keeps more of your UI on the server and can reduce the JavaScript sent to the browser.",
      },
    ],
  },
];

export default function EnmaChatPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [currentTitle, setCurrentTitle] = useState("New conversation");
  const [isThinking, setIsThinking] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 760px)");

    if (media.matches) {
      setSidebarOpen(false);
    }

    const handleChange = (event: MediaQueryListEvent) => {
      setSidebarOpen(!event.matches);
    };

    media.addEventListener("change", handleChange);

    return () => media.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, isThinking]);

  useEffect(() => {
    if (!textareaRef.current) return;

    textareaRef.current.style.height = "0px";
    textareaRef.current.style.height = `${Math.min(
      textareaRef.current.scrollHeight,
      180,
    )}px`;
  }, [draft]);

  function closeSidebarOnMobile() {
    if (window.matchMedia("(max-width: 760px)").matches) {
      setSidebarOpen(false);
    }
  }

  function startNewChat() {
    setMessages([]);
    setDraft("");
    setAttachedFile(null);
    setCurrentTitle("New conversation");
    setIsThinking(false);
    closeSidebarOnMobile();
  }

  function openSampleChat(chat: (typeof sampleChats)[number]) {
    setMessages(chat.messages);
    setCurrentTitle(chat.title);
    setIsThinking(false);
    closeSidebarOnMobile();
  }

  
async function sendMessage(textOverride?: string) {
  const content = (textOverride ?? draft).trim();

  if ((!content && !attachedFile) || isThinking) return;

  const file = attachedFile;

  const userContent =
    content || `Can you help me understand this file: ${file?.name}?`;

  const userMessage: Message = {
    id: `user-${Date.now()}`,
    role: "user",
    content: userContent,
    attachment: file?.name,
  };

  setMessages(previous => [...previous, userMessage]);

  setCurrentTitle(previous =>
    previous === "New conversation"
      ? userContent.slice(0, 34) +
        (userContent.length > 34 ? "…" : "")
      : previous
  );

  setDraft("");
  setAttachedFile(null);
  setIsThinking(true);
  closeSidebarOnMobile();

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question: userContent,
      }),
    });

    const data = await response.json() as {
      answer?: string;
      sources?: Source[];
      error?: string;
    };

    if (!response.ok) {
      throw new Error(data.error ?? "Chat request failed.");
    }

    setMessages(previous => [
      ...previous,
      {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.answer ?? "No answer was returned.",
        sources: data.sources ?? [],
      },
    ]);
  } catch (error) {
    console.error("ENMA request failed:", error);

    setMessages(previous => [
      ...previous,
      {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content:
          error instanceof Error
            ? `I couldn't answer that request: ${error.message}`
            : "I couldn't answer that request. Please try again.",
      },
    ]);
  } finally {
    setIsThinking(false);
  }
}


  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    sendMessage();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;

    setAttachedFile(file);

    // Reset the input so the same file can be selected again.
    event.target.value = "";
  }

  const visibleChats = sampleChats.filter((chat) =>
    chat.title.toLowerCase().includes(searchText.toLowerCase()),
  );

  return (
    <main
      className={`${styles.appShell} ${
        sidebarOpen ? styles.sidebarOpen : styles.sidebarClosed
      }`}
    >
      {sidebarOpen && (
        <button
          className={styles.mobileBackdrop}
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={styles.sidebar} aria-label="Conversation sidebar">
        <div className={styles.sidebarTop}>
          <a
            className={styles.brand}
            href="#main"
            aria-label="ENMA home"
            onClick={(event) => event.preventDefault()}
          >
            <span className={styles.brandMark}>
              <Icon name="aura" size={26} />
            </span>

            <span className={styles.brandText}>
              <strong>ENMA</strong>
              <small>RAG Based AI</small>
            </span>
          </a>

          <button
            className={`${styles.iconButton} ${styles.sidebarClose}`}
            aria-label="Close sidebar"
            onClick={() => setSidebarOpen(false)}
          >
            <Icon name="x" />
          </button>
        </div>

        <button className={styles.newChatButton} onClick={startNewChat}>
          <span className={styles.newChatIcon}>
            <Icon name="plus" size={17} />
          </span>

          <span>New conversation</span>

          {/* <kbd>⌘ K</kbd> */}
        </button>

        <div className={styles.sidebarSection}>
          <div className={styles.sectionHeading}>
            <span>YOUR SPACE</span>
          </div>

          <button
            className={`${styles.sideLink} ${
              searchOpen ? styles.sideLinkActive : ""
            }`}
            onClick={() => {
              setSearchOpen((open) => !open);
              setSearchText("");
            }}
          >
            <Icon name="search" size={17} />
            <span>Search conversations</span>
          </button>

          {searchOpen && (
            <input
              className={styles.searchInput}
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="Find a conversation…"
              aria-label="Search conversations"
              autoFocus
            />
          )}

          <button
            className={styles.sideLink}
            onClick={() => openSampleChat(sampleChats[0])}
          >
            <Icon name="history" size={17} />
            <span>Recent activity</span>
          </button>

          <button
            className={styles.sideLink}
            onClick={() => openSampleChat(sampleChats[1])}
          >
            <Icon name="library" size={17} />
            <span>Prompt library</span>
          </button>
        </div>

        <div className={styles.recentSection}>
          <div className={styles.sectionHeading}>
            <span>RECENT THREADS</span>
            <span className={styles.recentCount}>
              {visibleChats.length.toString().padStart(2, "0")}
            </span>
          </div>

          <div className={styles.threadList}>
            {visibleChats.map((chat) => (
              <button
                key={chat.title}
                className={`${styles.threadButton} ${
                  currentTitle === chat.title ? styles.threadSelected : ""
                }`}
                onClick={() => openSampleChat(chat)}
                title={chat.title}
              >
                <span className={styles.threadDot} />
                <span>{chat.title}</span>
              </button>
            ))}

            {visibleChats.length === 0 && (
              <p className={styles.noResults}>No conversations found.</p>
            )}
          </div>
        </div>

        <div className={styles.sidebarBottom}>
          {/* <div className={styles.planCard}>
            <div className={styles.planOrb}>
              <Icon name="sparkles" size={17} />
            </div> */}

            {/* <div className={styles.planCopy}>
              <strong>Find your edge.</strong>
              <span>Make room for better thinking.</span>
            </div> */}

            {/* <Icon name="chevron" size={15} /> */}
          {/* </div> */}

          <div className={styles.profileRow}>
            <div className={styles.profileAvatar}>Y</div>

            <div className={styles.profileCopy}>
              <strong>Your workspace</strong>
              <span>Personal edition</span>
            </div>

            <button
              className={styles.profileSettings}
              aria-label="Workspace settings"
              onClick={() => window.alert("Add your settings panel here.")}
            >
              <Icon name="settings" size={17} />
            </button>
          </div>

        </div>
      </aside>

      <section className={styles.mainPanel} id="main">
        <header className={styles.topBar}>
          <div className={styles.topBarLeft}>
            <button
              className={styles.iconButton}
              aria-label={
                sidebarOpen ? "Collapse sidebar" : "Open sidebar"
              }
              onClick={() => setSidebarOpen((open) => !open)}
            >
              <Icon name="panel" size={19} />
            </button>

            <span className={styles.headerDivider} />

            <div className={styles.breadcrumb}>
              <span>ENMA</span>
              <Icon name="chevron" size={13} />
              <strong>{currentTitle}</strong>
            </div>
          </div>

          <div className={styles.topBarRight}>
            <span className={styles.statusPill}>
              <span className={styles.statusDot} />
              AURA ACTIVE
            </span>

            <button
              className={styles.shareButton}
              onClick={() =>
                window.alert("Connect this button to your share flow.")
              }
            >
              Share <span>↗</span>
            </button>
          </div>
        </header>

        <div className={styles.chatViewport}>
          {messages.length === 0 ? (
            <div className={styles.welcomeWrap}>
              <div className={styles.heroAura} aria-hidden="true">
                <div className={styles.auraRingOuter} />
                <div className={styles.auraRingMiddle} />
                <div className={styles.auraRingInner} />

                <div className={styles.heroMark}>
                  <Icon name="aura" size={43} />
                </div>

                <span
                  className={`${styles.auraSpark} ${styles.auraSparkOne}`}
                />
                <span
                  className={`${styles.auraSpark} ${styles.auraSparkTwo}`}
                />
                <span
                  className={`${styles.auraSpark} ${styles.auraSparkThree}`}
                />
              </div>

              <div className={styles.heroEyebrow}>
                <span />
                YOUR MIND, UNBOUND
                <span />
              </div>

              <h1>
                Think beyond.
                <br />
                <span>Move with intent.</span>
              </h1>

              <p className={styles.heroDescription}>
                A clear mind is a powerful weapon. Bring your questions,
                plans, and wild ideas — let’s sharpen them together.
              </p>

              <div className={styles.promptGrid}>
                {starterPrompts.map((prompt) => (
                  <button
                    className={styles.promptCard}
                    key={prompt.title}
                    onClick={() => sendMessage(prompt.prompt)}
                  >
                    <span className={styles.promptNumber}>
                      {prompt.symbol}
                    </span>

                    <span className={styles.promptText}>
                      <strong>{prompt.title}</strong>
                      <small>{prompt.description}</small>
                    </span>

                    <span className={styles.promptArrow}>↗</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className={styles.messagesColumn}>
              <div className={styles.conversationMeta}>
                <span className={styles.metaLine} />
                <span>CONVERSATION START</span>
                <span className={styles.metaLine} />
              </div>

              {messages.map((message) => (
                <article
                  key={message.id}
                  className={`${styles.messageRow} ${
                    message.role === "user"
                      ? styles.userMessageRow
                      : styles.assistantMessageRow
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className={styles.messageAvatar}>
                      <Icon name="aura" size={19} />
                    </div>
                  )}

                  <div className={styles.messageBody}>
                    <div className={styles.messageHeading}>
                      <strong>
                        {message.role === "assistant" ? "ENMA" : "YOU"}
                      </strong>

                      {message.role === "assistant" && (
                        <span className={styles.messageTag}>
                          AURA INTELLIGENCE
                        </span>
                      )}
                    </div>

                        <div
                        className={`${styles.messageContent} ${
                            message.role === "user" ? styles.userBubble : ""
                        }`}
                        >
                        {message.content}

                        {/* {message.sources && message.sources.length > 0 && (
                            <div className={styles.sources}>
                            <strong>Sources:</strong>

                            {message.sources.map((source, index) => (
                                <div key={`${source.source}-${index}`}>
                                {[
                                    source.source,
                                    source.section,
                                    source.clause ? `Clause ${source.clause}` : null,
                                    source.subsection,
                                ]
                                    .filter(Boolean)
                                    .join(" — ")}
                                </div>
                            ))}
                            </div>
                        )} */}

                        {message.attachment && (
                            <div className={styles.attachmentChip}>
                            <Icon name="paperclip" size={14} />
                            {message.attachment}
                            </div>
                        )}
                        </div>

                  </div>

                  {message.role === "user" && (
                    <div className={styles.userAvatar}>S</div>
                  )}
                </article>
              ))}

              {isThinking && (
                <div
                  className={`${styles.messageRow} ${styles.assistantMessageRow}`}
                >
                  <div className={styles.messageAvatar}>
                    <Icon name="aura" size={19} />
                  </div>

                  <div className={styles.messageBody}>
                    <div className={styles.messageHeading}>
                      <strong>ENMA</strong>
                      <span className={styles.messageTag}>FOCUSING</span>
                    </div>

                    <div className={styles.typingIndicator}>
                      <i />
                      <i />
                      <i />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <div className={styles.composerDock}>
          {attachedFile && (
            <div className={styles.selectedFile}>
              <Icon name="paperclip" size={15} />
              <span>{attachedFile.name}</span>

              <button
                type="button"
                aria-label="Remove attachment"
                onClick={() => setAttachedFile(null)}
              >
                <Icon name="x" size={14} />
              </button>
            </div>
          )}

          <form className={styles.composer} onSubmit={handleSubmit}>
            <input
              ref={fileInputRef}
              className={styles.hiddenFileInput}
              type="file"
              onChange={handleFileChange}
            />

            <button
              type="button"
              className={styles.attachButton}
              aria-label="Attach a file"
              onClick={() => fileInputRef.current?.click()}
            >
              <Icon name="paperclip" size={19} />
            </button>

            <textarea
              ref={textareaRef}
              rows={1}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask ENMA anything…"
              aria-label="Message ENMA"
            />

            <div className={styles.composerRight}>
              <span className={styles.enterHint}>
                ↵ <small>to send</small>
              </span>

              <button
                className={styles.sendButton}
                type="submit"
                disabled={!draft.trim() && !attachedFile}
                aria-label="Send message"
              >
                <Icon name="arrow-up" size={20} />
              </button>
            </div>
          </form>

          <div className={styles.composerFooter}>
            <span>
              <Icon name="shield" size={13} />
              Your space. Your thoughts.
            </span>

            <span>
              ENMA IS A CREATIVE COMPANION <i>✳</i>
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}