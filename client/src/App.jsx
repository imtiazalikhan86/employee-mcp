import ChatHeader from "./components/chat/ChatHeader";
import ChatWindow from "./components/chat/ChatWindow";
import { useChat } from "./hooks/useChat";

export default function App() {
  const { messages, isLoading, error, sendMessage, clearChat } = useChat();

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-0 sm:p-6">
      <section className="flex h-dvh w-full flex-col overflow-hidden bg-white sm:h-[min(850px,calc(100dvh-48px))] sm:max-w-5xl sm:rounded-3xl sm:border sm:border-slate-200 sm:shadow-xl">
        <ChatHeader onClear={clearChat} />

        <ChatWindow
          messages={messages}
          isLoading={isLoading}
          error={error}
          onSend={sendMessage}
        />
      </section>
    </main>
  );
}
