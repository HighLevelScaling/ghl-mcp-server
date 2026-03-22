/**
 * GoHighLevel Conversations & Messaging Tools
 * SMS, Email, conversations, and message management
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { GHLClient } from "../utils/ghl-client.js";

export function registerConversationTools(server: McpServer, client: GHLClient) {
  const locationId = client.getLocationId();

  // ─── Conversations ───────────────────────────────────────────────────

  server.tool(
    "search_conversations",
    "Search conversations in GoHighLevel with filters.",
    {
      query: z.string().optional().describe("Search query"),
      contactId: z.string().optional().describe("Filter by contact ID"),
      assignedTo: z.string().optional().describe("Filter by assigned user ID"),
      status: z.enum(["all", "read", "unread", "starred"]).optional().describe("Conversation status filter"),
      limit: z.number().optional().default(20).describe("Number of results"),
      lastMessageType: z.enum(["TYPE_CALL", "TYPE_SMS", "TYPE_EMAIL", "TYPE_SMS_REVIEW_REQUEST", "TYPE_WEBCHAT", "TYPE_SMS_NO_SHOW_REQUEST", "TYPE_CAMPAIGN_SMS", "TYPE_CAMPAIGN_CALL", "TYPE_CAMPAIGN_EMAIL", "TYPE_CAMPAIGN_VOICEMAIL", "TYPE_FACEBOOK", "TYPE_CAMPAIGN_FACEBOOK", "TYPE_CAMPAIGN_MANUAL_CALL", "TYPE_CAMPAIGN_MANUAL_SMS", "TYPE_GMB", "TYPE_CAMPAIGN_GMB", "TYPE_REVIEW", "TYPE_INSTAGRAM", "TYPE_WHATSAPP", "TYPE_CUSTOM_SMS", "TYPE_CUSTOM_EMAIL", "TYPE_CUSTOM_PROVIDER_SMS", "TYPE_CUSTOM_PROVIDER_EMAIL", "TYPE_IVR_CALL", "TYPE_ACTIVITY_CONTACT", "TYPE_ACTIVITY_INVOICE", "TYPE_ACTIVITY_PAYMENT", "TYPE_ACTIVITY_OPPORTUNITY", "TYPE_LIVE_CHAT", "TYPE_LIVE_CHAT_INFO_MESSAGE"]).optional().describe("Filter by last message type"),
    },
    async ({ query, contactId, assignedTo, status, limit, lastMessageType }) => {
      try {
        const result = await client.request({
          method: "GET",
          path: "/conversations/search",
          query: {
            locationId,
            q: query,
            contactId,
            assignedTo,
            status,
            limit,
            lastMessageType,
          },
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text" as const, text: `Error: ${error.message}` }], isError: true };
      }
    }
  );

  server.tool(
    "get_conversation",
    "Get a specific conversation by ID.",
    {
      conversationId: z.string().describe("The conversation ID"),
    },
    async ({ conversationId }) => {
      try {
        const result = await client.request({
          method: "GET",
          path: `/conversations/${conversationId}`,
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text" as const, text: `Error: ${error.message}` }], isError: true };
      }
    }
  );

  server.tool(
    "create_conversation",
    "Create a new conversation in GoHighLevel.",
    {
      contactId: z.string().describe("The contact ID to start conversation with"),
    },
    async ({ contactId }) => {
      try {
        const result = await client.request({
          method: "POST",
          path: "/conversations/",
          body: { locationId, contactId },
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text" as const, text: `Error: ${error.message}` }], isError: true };
      }
    }
  );

  // ─── Messages ────────────────────────────────────────────────────────

  server.tool(
    "get_messages",
    "Get messages from a conversation in GoHighLevel.",
    {
      conversationId: z.string().describe("The conversation ID"),
      limit: z.number().optional().default(20).describe("Number of messages to retrieve"),
      lastMessageId: z.string().optional().describe("Last message ID for pagination"),
    },
    async ({ conversationId, limit, lastMessageId }) => {
      try {
        const result = await client.request({
          method: "GET",
          path: `/conversations/${conversationId}/messages`,
          query: { limit, lastMessageId },
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text" as const, text: `Error: ${error.message}` }], isError: true };
      }
    }
  );

  server.tool(
    "send_message",
    "Send a message (SMS, Email, or other type) in a GoHighLevel conversation.",
    {
      type: z.enum(["SMS", "Email", "WhatsApp", "GMB", "IG", "FB", "Custom", "Live_Chat"]).describe("Message type"),
      contactId: z.string().describe("The contact ID to send message to"),
      message: z.string().optional().describe("Message body (for SMS/WhatsApp)"),
      subject: z.string().optional().describe("Email subject (for Email type)"),
      html: z.string().optional().describe("HTML body (for Email type)"),
      emailFrom: z.string().optional().describe("From email address"),
      emailTo: z.string().optional().describe("To email address"),
      emailCc: z.array(z.string()).optional().describe("CC email addresses"),
      emailBcc: z.array(z.string()).optional().describe("BCC email addresses"),
      conversationId: z.string().optional().describe("Existing conversation ID"),
      conversationProviderId: z.string().optional().describe("Conversation provider ID"),
    },
    async (params) => {
      try {
        const result = await client.request({
          method: "POST",
          path: "/conversations/messages",
          body: params,
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text" as const, text: `Error: ${error.message}` }], isError: true };
      }
    }
  );

  server.tool(
    "update_message_status",
    "Update the status of a message in GoHighLevel.",
    {
      messageId: z.string().describe("The message ID"),
      status: z.enum(["read", "pending", "delivered", "failed"]).describe("New status"),
    },
    async ({ messageId, status }) => {
      try {
        const result = await client.request({
          method: "PUT",
          path: `/conversations/messages/${messageId}/status`,
          body: { status },
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text" as const, text: `Error: ${error.message}` }], isError: true };
      }
    }
  );

  server.tool(
    "cancel_scheduled_message",
    "Cancel a scheduled message in GoHighLevel.",
    {
      messageId: z.string().describe("The scheduled message ID to cancel"),
    },
    async ({ messageId }) => {
      try {
        const result = await client.request({
          method: "POST",
          path: `/conversations/messages/${messageId}/schedule`,
          body: { status: "cancelled" },
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text" as const, text: `Error: ${error.message}` }], isError: true };
      }
    }
  );

  server.tool(
    "get_message_recording",
    "Get the recording URL for a call message.",
    {
      locationId: z.string().describe("The location ID"),
      messageId: z.string().describe("The message ID of the call"),
    },
    async ({ locationId: locId, messageId }) => {
      try {
        const result = await client.request({
          method: "GET",
          path: `/conversations/messages/${messageId}/locations/${locId}/recording`,
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text" as const, text: `Error: ${error.message}` }], isError: true };
      }
    }
  );
}
