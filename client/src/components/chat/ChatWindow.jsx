import { useEffect, useRef } from "react";
import { MessageCircle } from "lucide-react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import LoadingIndicator from "../common/LoadingIndicator";

export default function ChatWindow({ messages, isLoading, error, onSend }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-slate-50">
      <div className="flex-1 space-y-6 overflow-y-auto px-4 py-6 sm:px-6">
        {messages.length === 1 && (
          <div className="mx-auto mb-8 max-w-xl text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700">
              <MessageCircle size={28} />
            </div>

            <h2 className="text-lg font-semibold text-slate-900">
              How can I help you today?
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Try asking about an employee's leave balance, assigned project, or
              company policies.
            </p>
          </div>
        )}

        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}

        {isLoading && <LoadingIndicator />}

        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <ChatInput onSend={onSend} isLoading={isLoading} />
    </div>
  );
}
