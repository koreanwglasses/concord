import to from "await-to-js";
import { useReducer, useState } from "react";
import { api, Message } from "../api";
import * as Sockets from "../sockets";
import { useAsyncEffect } from "./use-async-effect";

export const useMessages = ({
  guildId,
  channelId,
}: {
  guildId: string;
  channelId: string;
}) => {
  const [err, setErr] = useState<Error>();

  const messagesReducer = (
    messages: Message[],
    action:
      | { type: "add"; item: Message }
      | { type: "set"; messages: Message[] }
  ) => {
    if (action.type === "set") {
      return action.messages;
    }
    if (action.type === "add") {
      return [action.item, ...messages];
    }
    return messages;
  };
  const [messages, messagesDispatch] = useReducer(messagesReducer, undefined);

  useAsyncEffect(async () => {
    const [err, messages] = await to(
      api("/api/message/list", { guildId, channelId })
    );

    if (err) return setErr(err);
    messagesDispatch({ type: "set", messages });

    Sockets.listenForMessages({ guildId, channelId }, (message) => {
      messagesDispatch({ type: "add", item: message });
    });
  }, []);

  return [err, messages] as const;
};