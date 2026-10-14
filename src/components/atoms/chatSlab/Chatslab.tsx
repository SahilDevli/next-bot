"use client";

import { useEffect, useRef } from "react";
import type { Message } from "../../../types/chat";
import styles from "./Chatslab.module.scss";

type ChatSlabProps = {
  messages: Message[];
  isTyping?: boolean;
};

/* The scrolling message thread. Owns nothing but its own scroll position. */
export default function ChatSlab({
  messages,
  isTyping = false,
}: ChatSlabProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  /* Keep the newest message in view. */
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <div className={styles.scroll} ref={scrollRef}>
      <div className={styles.thread} role="log" aria-live="polite">
        {messages.map((message) => {
          const isUser = message.role === "user";
          return (
            <div
              key={message.id}
              className={`${styles.row} ${isUser ? styles.rowUser : ""}`}
            >
              <div
                className={`${styles.avatar} ${
                  isUser ? styles.avatarUser : styles.avatarBot
                }`}
                aria-hidden="true"
              >
                {isUser ? "Y" : "✦"}
              </div>

              <div className={styles.group}>
                <div
                  className={`${styles.bubble} ${
                    isUser ? styles.bubbleUser : styles.bubbleBot
                  }`}
                >
                  {message.text}
                </div>
                {message.time && (
                  <span className={styles.time}>{message.time}</span>
                )}
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className={styles.row}>
            <div
              className={`${styles.avatar} ${styles.avatarBot}`}
              aria-hidden="true"
            >
              ✦
            </div>
            <div className={styles.group}>
              <div
                className={`${styles.bubble} ${styles.bubbleBot} ${styles.typing}`}
              >
                <span className={styles.dot} />
                <span className={styles.dot} />
                <span className={styles.dot} />
                <span className={styles.srOnly}>Binger is typing</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
