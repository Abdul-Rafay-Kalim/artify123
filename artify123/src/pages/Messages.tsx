import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, Send, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

interface Conversation {
  id: string;
  artwork_id: string;
  buyer_id: string;
  seller_id: string;
  buyer_name?: string;
  seller_name?: string;
  created_at: string;
  updated_at: string;
}

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

const Messages = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      fetchConversations();
    }
  }, [user, loading]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation);
      // Auto-refresh messages every 2 seconds
      const interval = setInterval(() => fetchMessages(selectedConversation), 2000);
      return () => clearInterval(interval);
    }
  }, [selectedConversation]);

  const fetchConversations = async () => {
    setLoadingConversations(true);
    try {
      const { data, error } = await supabase
        .from("conversations")
        .select("*")
        .or(`buyer_id.eq.${user?.id},seller_id.eq.${user?.id}`);

      if (error) throw error;

      // Fetch user names for each conversation
      const updatedConversations = await Promise.all(
        (data || []).map(async (conv: any) => {
          const buyerProfile = await supabase
            .from("profiles")
            .select("first_name, last_name")
            .eq("user_id", conv.buyer_id)
            .single();

          const sellerProfile = await supabase
            .from("profiles")
            .select("first_name, last_name")
            .eq("user_id", conv.seller_id)
            .single();

          return {
            ...conv,
            buyer_name: buyerProfile.data
              ? `${buyerProfile.data.first_name} ${buyerProfile.data.last_name}`.trim()
              : "Buyer",
            seller_name: sellerProfile.data
              ? `${sellerProfile.data.first_name} ${sellerProfile.data.last_name}`.trim()
              : "Seller",
          };
        })
      );

      setConversations(updatedConversations as Conversation[]);
      if (updatedConversations.length > 0 && !selectedConversation) {
        setSelectedConversation(updatedConversations[0].id);
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setLoadingConversations(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    setLoadingMessages(true);
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoadingMessages(false);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation || !user) return;

    try {
      const { error } = await supabase.from("messages").insert({
        conversation_id: selectedConversation,
        sender_id: user.id,
        content: newMessage.trim(),
      });

      if (error) throw error;

      setNewMessage("");
      await fetchMessages(selectedConversation);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (loading || loadingConversations) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-28 pb-16 container mx-auto px-4">
          <div className="flex items-center justify-center h-96">
            <p className="text-muted-foreground">Loading messages...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-28 pb-16 container mx-auto px-4 text-center">
          <h1 className="text-3xl font-serif font-bold text-foreground mb-4">
            Sign in to view messages
          </h1>
          <Button onClick={() => navigate("/login")}>Sign In</Button>
        </main>
      </div>
    );
  }

  const selectedConv = conversations.find((c) => c.id === selectedConversation);
  const otherUserName =
    selectedConv && user.id === selectedConv.buyer_id
      ? selectedConv.seller_name
      : selectedConv?.buyer_name;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-28 pb-16">
        <div className="container mx-auto px-4 md:px-8 h-full">
          <Button variant="ghost" size="sm" className="mb-6 gap-2" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>

          {conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-96">
              <MessageCircle className="w-16 h-16 text-muted-foreground mb-4 opacity-50" />
              <p className="text-muted-foreground text-lg">No conversations yet</p>
              <p className="text-sm text-muted-foreground mt-2">Start chatting when you find artwork you love</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6 h-[600px]">
              {/* Conversations List */}
              <div className="border border-border rounded-lg overflow-hidden flex flex-col bg-card">
                <div className="p-4 border-b border-border">
                  <h2 className="font-serif font-bold text-foreground">Messages</h2>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {conversations.map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => setSelectedConversation(conv.id)}
                      className={`w-full p-4 text-left border-b border-border transition-colors ${
                        selectedConversation === conv.id
                          ? "bg-secondary"
                          : "hover:bg-secondary/50"
                      }`}
                    >
                      <p className="font-medium text-foreground text-sm">
                        {user.id === conv.buyer_id ? conv.seller_name : conv.buyer_name}
                      </p>
                      <p className="text-xs text-muted-foreground">Art ID: {conv.artwork_id}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(conv.updated_at).toLocaleDateString()}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Area */}
              <div className="md:col-span-2 border border-border rounded-lg overflow-hidden flex flex-col bg-card">
                {/* Header */}
                <div className="p-4 border-b border-border">
                  <h3 className="font-serif font-bold text-foreground">
                    Chat with {otherUserName || "Seller"}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Artwork ID: {selectedConv?.artwork_id}
                  </p>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {loadingMessages ? (
                    <p className="text-center text-muted-foreground text-sm">Loading...</p>
                  ) : messages.length === 0 ? (
                    <p className="text-center text-muted-foreground text-sm">No messages yet. Start the conversation!</p>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.sender_id === user.id ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-xs px-4 py-2 rounded-lg ${
                            msg.sender_id === user.id
                              ? "bg-foreground text-background"
                              : "bg-secondary text-foreground"
                          }`}
                        >
                          <p className="text-sm break-words">{msg.content}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {new Date(msg.created_at).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Message Input */}
                <div className="border-t border-border p-4">
                  <form onSubmit={sendMessage} className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="submit" size="icon">
                      <Send className="w-4 h-4" />
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Messages;
