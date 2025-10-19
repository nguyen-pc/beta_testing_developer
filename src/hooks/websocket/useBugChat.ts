import { useEffect, useState, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import axios from "axios";
import {
  callGetBugChatMessages,
  callPostBugChatMessage,
} from "../../config/api";
import { useAppSelector } from "../../redux/hooks";

export interface ChatMessage {
  id?: number;
  content: string;
  createdAt?: string;
  senderName?: string;
  senderEmail?: string;
}

export function useBugChat(bugId?: string | number) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [connected, setConnected] = useState(false);
  const clientRef = useRef<Client | null>(null);
  //   const user = useAppSelector((state) => state.auth.user);

  // 🔹 Lấy lịch sử chat qua REST
  const fetchHistory = async () => {
    if (!bugId) return;
    try {
      const res = await callGetBugChatMessages(bugId);
      console.log("Fetched chat history:", res.data);
      setMessages(res.data);
    } catch (err) {
      console.error("Error fetching chat history:", err);
    }
  };

  // 🔹 Kết nối WebSocket
  useEffect(() => {
    if (!bugId) return;

    const socket = new SockJS("http://localhost:8081/ws"); // ⚠️ backend URL
    const client = new Client({
      webSocketFactory: () => socket as any,
      reconnectDelay: 5000,
    });

    client.onConnect = () => {
      console.log("✅ Connected to WebSocket");
      setConnected(true);

      // Subscribe để nhận tin nhắn mới
      client.subscribe(`/topic/bugs/${bugId}`, (msg) => {
        const message = JSON.parse(msg.body);
        setMessages((prev) => [...prev, message]);
      });

      fetchHistory(); // tải tin nhắn cũ khi connect
    };

    client.onStompError = (frame) => {
      console.error("STOMP error:", frame);
    };

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
      setConnected(false);
    };
  }, [bugId]);

  // 🔹 Gửi tin nhắn mới
  const sendMessage = async (
    content: string,
    senderId?: number,
    bugId?: number
  ) => {
    const payload = {
      content,
      isInternal: false,
      sender: {
        id: senderId,
      },
      bugId,
    };
    console.log("Sending message payload:", payload);
    const res = await callPostBugChatMessage(bugId, payload);
    console.log("Sent message response:", res);
  };
  return { messages, sendMessage, connected };
}
