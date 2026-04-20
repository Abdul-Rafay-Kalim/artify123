import { KeyboardEvent, useState, useRef, useEffect } from "react";
import { Send, Sparkles, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type Msg = { role: "user" | "assistant"; content: string };
type Conversation = { id: string; title: string; messages: Msg[]; updatedAt: number };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-curator`;
const HISTORY_KEY = "artify_ai_curator_history";

const starterPrompts = [
  "I want bold abstract art for a modern living room.",
  "Suggest calm pieces for a bedroom with soft lighting.",
  "I am new to collecting. Recommend affordable starter artworks.",
  "I like portrait-focused pieces with strong emotion.",
];

const createConversation = (): Conversation => ({
  id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
  title: "New chat",
  messages: [],
  updatedAt: Date.now(),
});

const getInitialHistory = (): Conversation[] => {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [createConversation()];
    const parsed = JSON.parse(raw) as Conversation[];
    if (!Array.isArray(parsed) || parsed.length === 0) return [createConversation()];
    return parsed;
  } catch {
    return [createConversation()];
  }
};

const summarizeTitle = (content: string) => {
  if (content.length <= 34) return content;
  return `${content.slice(0, 34)}...`;
};

const AICurator = () => {
  const [chatHistory, setChatHistory] = useState<Conversation[]>(getInitialHistory);
  const [activeChatId, setActiveChatId] = useState<string>(getInitialHistory()[0].id);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const activeConversation = chatHistory.find((chat) => chat.id === activeChatId) ?? chatHistory[0];
  const messages = activeConversation?.messages ?? [];

  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(chatHistory));
  }, [chatHistory]);

  useEffect(() => {
    if (!activeConversation) {
      const fresh = createConversation();
      setChatHistory([fresh]);
      setActiveChatId(fresh.id);
    }
  }, [activeConversation]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const updateActiveConversation = (updater: (conversation: Conversation) => Conversation) => {
    setChatHistory((prev) =>
      prev
        .map((conversation) =>
          conversation.id === activeChatId ? updater(conversation) : conversation,
        )
        .sort((a, b) => b.updatedAt - a.updatedAt),
    );
  };

  const handleNewChat = () => {
    const fresh = createConversation();
    setChatHistory((prev) => [fresh, ...prev]);
    setActiveChatId(fresh.id);
    setInput("");
    setIsLoading(false);
  };

  const handleSelectChat = (chatId: string) => {
    setActiveChatId(chatId);
    setInput("");
    setIsLoading(false);
  };

  const handleDeleteChat = (chatId: string) => {
    setChatHistory((prev) => {
      const remaining = prev.filter((chat) => chat.id !== chatId).sort((a, b) => b.updatedAt - a.updatedAt);

      if (remaining.length === 0) {
        const fresh = createConversation();
        setActiveChatId(fresh.id);
        setInput("");
        setIsLoading(false);
        return [fresh];
      }

      if (activeChatId === chatId) {
        setActiveChatId(remaining[0].id);
        setInput("");
        setIsLoading(false);
      }

      return remaining;
    });
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading || !activeConversation) return;
    const question = input.trim();
    const userMsg: Msg = { role: "user", content: question };
    const allMessages = [...messages, userMsg];
    updateActiveConversation((conversation) => ({
      ...conversation,
      title: conversation.messages.length === 0 ? summarizeTitle(question) : conversation.title,
      messages: allMessages,
      updatedAt: Date.now(),
    }));
    setInput("");
    setIsLoading(true);

    let assistantSoFar = "";

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: allMessages }),
      });

      if (!resp.ok) {
        const errData = await resp.json().catch(() => ({}));
        throw new Error(errData.error || `Request failed (${resp.status})`);
      }

      const reader = resp.body?.getReader();
      if (!reader) throw new Error("No response stream");
      const decoder = new TextDecoder();
      let textBuffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantSoFar += content;
              updateActiveConversation((conversation) => {
                const last = conversation.messages[conversation.messages.length - 1];
                const nextMessages =
                  last?.role === "assistant"
                    ? conversation.messages.map((message, idx) =>
                        idx === conversation.messages.length - 1
                          ? { ...message, content: assistantSoFar }
                          : message,
                      )
                    : [...conversation.messages, { role: "assistant" as const, content: assistantSoFar }];

                return {
                  ...conversation,
                  messages: nextMessages,
                  updatedAt: Date.now(),
                };
              });
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleComposerKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f7f7f8] text-zinc-900">
      <Navbar />
      <div className="mx-auto flex flex-1 w-full max-w-[1700px]">
        <aside className="hidden sticky top-0 self-start h-[calc(100vh-64px)] w-[280px] flex-col border-r border-zinc-200 bg-zinc-100/80 p-3 md:flex">
          <Button
            onClick={handleNewChat}
            className="mb-3 h-11 justify-start gap-2 rounded-xl bg-zinc-900 px-4 text-sm text-white hover:bg-zinc-800"
          >
            <Plus className="h-4 w-4" />
            New chat
          </Button>

          <div className="min-h-0 flex-1 overflow-y-auto pr-1">
            <p className="mb-2 px-2 text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">Recent</p>
            <div className="space-y-1.5">
              {chatHistory.map((chat) => (
                <div
                  key={chat.id}
                  className={`group flex items-center gap-1 rounded-xl px-2 py-1.5 ${
                    chat.id === activeConversation?.id ? "bg-zinc-200 text-zinc-950" : "text-zinc-700 hover:bg-zinc-200/70"
                  }`}
                >
                  <button
                    onClick={() => handleSelectChat(chat.id)}
                    className="min-w-0 flex-1 rounded-lg px-2 py-1 text-left"
                  >
                    <p className="line-clamp-1 text-sm font-medium">{chat.title}</p>
                    <p className="mt-0.5 text-xs text-zinc-500">{chat.messages.length} msg</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteChat(chat.id)}
                    className="rounded-lg p-2 text-zinc-500 opacity-0 transition group-hover:opacity-100 hover:bg-zinc-300/60 hover:text-zinc-800"
                    aria-label={`Delete ${chat.title}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <section className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-10 border-b border-zinc-200 bg-[#f7f7f8]/95 px-4 py-3 backdrop-blur md:px-8">
            <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-3">
              <div>
                <h1 className="text-base font-semibold text-zinc-900">AI Curator</h1>
                <p className="text-xs text-zinc-500">Artify assistant</p>
              </div>
              <Button onClick={handleNewChat} variant="ghost" className="h-9 rounded-lg px-3 text-zinc-700 hover:bg-zinc-200 md:hidden">
                <Plus className="mr-1.5 h-4 w-4" />
                New
              </Button>
            </div>
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="mx-auto w-full max-w-3xl px-4 py-7 md:px-8">
              {messages.length === 0 && (
                <div className="mt-10 rounded-2xl border border-zinc-200 bg-white p-6 text-center shadow-sm">
                  <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-zinc-100 text-zinc-700">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <h2 className="mt-4 text-2xl font-semibold text-zinc-900">How can I help with your art selection?</h2>
                  <p className="mx-auto mt-2 max-w-xl text-sm text-zinc-600">
                    Ask about styles, placements, mood, budget, or collector recommendations.
                  </p>
                  <div className="mt-6 grid gap-2 sm:grid-cols-2">
                    {starterPrompts.map((prompt) => (
                      <button
                        key={prompt}
                        onClick={() => setInput(prompt)}
                        className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-left text-sm text-zinc-800 transition hover:border-zinc-300 hover:bg-zinc-100"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-6">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    {msg.role === "user" ? (
                      <div className="max-w-[85%] rounded-2xl bg-zinc-900 px-4 py-3 text-sm leading-6 text-white">
                        {msg.content}
                      </div>
                    ) : (
                      <div className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-4 text-sm leading-7 text-zinc-900 shadow-sm">
                        <div className="prose prose-sm max-w-none prose-zinc">
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
                  <div className="flex justify-start">
                    <div className="rounded-xl border border-zinc-200 bg-white px-4 py-3 shadow-sm">
                      <div className="flex gap-1.5">
                        <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400" style={{ animationDelay: "0ms" }} />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400" style={{ animationDelay: "120ms" }} />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400" style={{ animationDelay: "240ms" }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>
            </div>
          </div>

          <div className="border-t border-zinc-200 bg-[#f7f7f8] px-4 py-3 md:px-8 md:py-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
              className="mx-auto flex w-full max-w-3xl items-end gap-2"
            >
              <div className="flex-1 rounded-2xl border border-zinc-300 bg-white px-3 py-2 shadow-sm focus-within:border-zinc-400">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleComposerKeyDown}
                  placeholder="Message AI Curator..."
                  disabled={isLoading}
                  rows={1}
                  className="max-h-40 min-h-[28px] w-full resize-y border-0 bg-transparent text-sm leading-6 text-zinc-900 placeholder:text-zinc-500 focus:outline-none"
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="h-11 w-11 rounded-xl bg-zinc-900 p-0 text-white hover:bg-zinc-800"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
            <p className="mx-auto mt-2 w-full max-w-3xl text-center text-xs text-zinc-500">
              AI Curator can make mistakes. Verify important details before purchasing.
            </p>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default AICurator;
