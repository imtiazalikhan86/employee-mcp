import { Bot, UserRound } from "lucide-react";

export default function ChatMessage({ message }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
          isUser
            ? "bg-slate-200 text-slate-700"
            : "bg-indigo-100 text-indigo-700"
        }`}
      >
        {isUser ? <UserRound size={19} /> : <Bot size={19} />}
      </div>

      <div
        className={`max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-4 py-3 text-sm leading-6 sm:max-w-[75%] ${
          isUser
            ? "rounded-tr-sm bg-indigo-600 text-white"
            : "rounded-tl-sm border border-slate-200 bg-white text-slate-800"
        }`}
      >
        {message.content}
      </div>
    </div>
  );
}
