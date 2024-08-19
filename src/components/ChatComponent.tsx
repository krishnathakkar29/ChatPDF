"use client";
import React from "react";
import { Message, useChat } from "ai/react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import MessageList from "./MessageList";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
type Props = {
  chatId: number;
};

const ChatComponent = ({ chatId }: Props) => {
  const { data, isLoading } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: async () => {
      const response = await axios.post<Message[]>("/api/get-messages", {
        chatId,
      });
      return response.data;
    },
  });

  // const { input, handleInputChange, handleSubmit, messages } = useChat({
  //   api: "/api/chat",
  //   body: {
  //     chatId,
  //   },
  //   initialMessages: data || [],
  // });

  const { input, handleInputChange, handleSubmit, messages, append } = useChat({
    api: "/api/chat",
    body: {
      chatId,
    },
    initialMessages: data || [],
  });

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!input.trim()) return; 

    append({
      id: String(Math.random()),
      content: input,
      role: "user",
    });

   
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, { role: "user", content: input }],
          chatId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const aiMessage = data.message;

        append({
          id: String(Math.random()), 
          content: aiMessage,
          role: "assistant",
        });
      } else {
        console.error("Failed to get AI response.");
      }
    } catch (error) {
      console.error("Error in submitting message:", error);
    }
  };

  React.useEffect(() => {
    const messageContainer = document.getElementById("message-container");
    if (messageContainer) {
      messageContainer.scrollTo({
        top: messageContainer.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <div
      className="relative max-h-screen overflow-y-auto "
      id="message-container"
    >
      {/* header */}
      <div className="sticky top-0 inset-x-0 p-2 bg-white h-fit">
        <h3 className="text-xl font-bold">Chat</h3>
      </div>

      {/* messagelist */}
      <MessageList messages={messages} isLoading={isLoading} />
      <form
        // onSubmit={handleSubmit}
        onSubmit={onSubmit}
        className="sticky bottom-0 inset-x-0 px-2 py-4 bg-white"
      >
        <div className="flex">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask any question..."
            className="w-full"
          />
          <Button type="submit" className="bg-blue-600 ml-2">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatComponent;
