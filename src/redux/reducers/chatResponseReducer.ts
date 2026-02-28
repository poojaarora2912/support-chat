import { type UnknownAction } from "@reduxjs/toolkit";

import {
  FETCHING_CHAT_RESPONSE,
  FETCHING_CHAT_RESPONSE_SUCCEEDED,
  FETCHING_CHAT_RESPONSE_FAILED,
  INVALIDATE_CHAT_RESPONSE,
} from "../../constants/actionTypes";

interface SessionItems {
  items: object[];
}

interface PendingFirstMessage {
  _pending: true;
  query: string;
}

interface ChatResponseState {
  chatSession: {
    fetching: boolean;
    fetched: boolean;
    error: string | null;
    currentSessionId: string | null;
    pendingFirstMessage: PendingFirstMessage | null;
    [sessionId: string]:
      | SessionItems
      | boolean
      | string
      | PendingFirstMessage
      | null
      | undefined;
  };
}

const initialState: ChatResponseState = {
  chatSession: {
    fetching: false,
    fetched: false,
    error: null,
    currentSessionId: null,
    pendingFirstMessage: null,
  },
};

const chatResponseReducer = (state = initialState, action: UnknownAction) => {
  switch (action.type) {
    case FETCHING_CHAT_RESPONSE: {
      const { message } = action.payload as {
        message: string;
        sessionId?: string | null;
      };
      const currentSessionId = state.chatSession.currentSessionId;

      // Existing session: add a pending placeholder for this answer only; don't set chatSession.fetching
      if (currentSessionId) {
        const existingSession = state.chatSession[currentSessionId];
        const existingItems =
          existingSession &&
          typeof existingSession === "object" &&
          "items" in existingSession
            ? existingSession.items
            : [];
        const pendingItem = { _pending: true, query: message };
        return {
          ...state,
          chatSession: {
            ...state.chatSession,
            [currentSessionId]: {
              items: [...existingItems, pendingItem],
            },
          },
        };
      }

      // No session yet (first message): show query with loading placeholder (same as follow-up messages)
      return {
        ...state,
        chatSession: {
          ...state.chatSession,
          pendingFirstMessage: { _pending: true, query: message },
        },
      };
    }

    case FETCHING_CHAT_RESPONSE_SUCCEEDED: {
      const payload = action.payload as {
        session_id?: string;
        [key: string]: unknown;
      };
      const sessionId = payload?.session_id ?? "default";
      const existingSession = state.chatSession[sessionId];
      const existingItems =
        existingSession &&
        typeof existingSession === "object" &&
        "items" in existingSession
          ? existingSession.items
          : [];
      // Replace pending placeholder with the real answer
      const itemsWithoutPending = existingItems.filter(
        (item: object) => !(item as { _pending?: boolean })._pending,
      );
      return {
        ...state,
        chatSession: {
          ...state.chatSession,
          fetching: false,
          fetched: true,
          error: null,
          currentSessionId: sessionId,
          pendingFirstMessage: null,
          [sessionId]: {
            items: [...itemsWithoutPending, payload],
          },
        },
      };
    }

    case FETCHING_CHAT_RESPONSE_FAILED: {
      const currentSessionId = state.chatSession.currentSessionId;
      const nextChatSession: typeof state.chatSession = {
        ...state.chatSession,
        fetching: false,
        fetched: false,
        error: action.payload as string,
        pendingFirstMessage: null,
      };
      // Remove pending placeholder for this answer if we have a session
      if (currentSessionId) {
        const existingSession = state.chatSession[currentSessionId];
        const existingItems =
          existingSession &&
          typeof existingSession === "object" &&
          "items" in existingSession
            ? existingSession.items
            : [];
        const itemsWithoutPending = existingItems.filter(
          (item: object) => !(item as { _pending?: boolean })._pending,
        );
        nextChatSession[currentSessionId] = { items: itemsWithoutPending };
      }
      return {
        ...state,
        chatSession: nextChatSession,
      };
    }

    case INVALIDATE_CHAT_RESPONSE: {
      return {
        ...state,
        chatSession: { },
      };
    }

    default:
      return state;
  }
};

export default chatResponseReducer;
