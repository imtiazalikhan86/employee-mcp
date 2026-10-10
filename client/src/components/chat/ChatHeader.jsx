import { Bot, RotateCcw } from "lucide-react";

export default function ChatHeader({ onClear }) {
  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-4 sm:px-6">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-white">
          <Bot size={25} />
        </div>

        <div>
          <h1 className="font-semibold text-slate-900">
            Employee AI Assistant
          </h1>
          <p className="text-sm text-slate-500">Powered by Ollama and MCP</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onClear}
        title="Clear conversation"
        className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
      >
        <RotateCcw size={16} />
        <span className="hidden sm:inline">New chat</span>
      </button>
    </header>
  );
}
