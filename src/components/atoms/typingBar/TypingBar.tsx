"use client";

import { useRef, useState } from "react";
import Button from "../button/Button";
import styles from "./TypingBar.module.scss";

type TypingBarProps = {
  onSend: (text: string) => void;
  /** Blocks sending while the bot is replying. */
  disabled?: boolean;
  placeholder?: string;
};

/* Owns its own draft text so the page only hears about finished messages. */
export default function TypingBar({
  onSend,
  disabled = false,
  placeholder = "Send a message…",
}: TypingBarProps) {
  const [draft, setDraft] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const canSend = draft.trim().length > 0 && !disabled;

  const submit = () => {
    if (!canSend) return;
    onSend(draft.trim());
    setDraft("");
    const el = textareaRef.current;
    if (el) el.style.height = "auto";
  };

  /* Grow with the content, up to the max-height in the SCSS. */
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDraft(event.target.value);
    const el = event.target;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  };

  return (
    <form
      className={styles.composer}
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
    >
      <div className={styles.inputWrap}>
        <textarea
          ref={textareaRef}
          className={styles.textarea}
          value={draft}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          aria-label="Message"
        />
        <Button
          type="submit"
          variant="primary"
          disabled={!canSend}
          aria-label="Send message"
        >
          ↑
        </Button>
      </div>
      <p className={styles.hint}>Enter to send · Shift + Enter for a new line</p>
    </form>
  );
}
