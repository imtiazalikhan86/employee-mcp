import { useState } from "react";
import { Send } from "lucide-react";

export default function ChatInput({ onSend, isLoading }) {
  const [text, setText] = useState("");

  const submit = (event) => {
    event.preventDefault();

    if (!text.trim() || isLoading) return;

    onSend(text);
    setText("");
  };

  return (
    <form
      onSubmit={submit}
      className="flex items-end gap-3 border-t border-slate-200 bg-white p-4 sm:px-6"
    >
      <textarea
        value={text}
        onChange={(event) => setText(event.target.value)}
        onKeyDown={(event) => {
          if (
            event.key === "Enter" &&
            !event.shiftKey &&
            !event.nativeEvent.isComposing
          ) {
            event.preventDefault();
            submit(event);
          }
        }}
        placeholder="Ask about leave balance, projects, or policies..."
        rows={1}
        disabled={isLoading}
        className="max-h-32 min-h-12 flex-1 resize-y rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50"
      />

      <button
        type="submit"
        disabled={isLoading || !text.trim()}
        aria-label="Send message"
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Send size={19} />
      </button>
    </form>
  );
}
