/**
 * GoHighLevel Payments & Transactions Tools
 * Orders, transactions, invoices, and payment management
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { GHLClient } from "../utils/ghl-client.js";

export function registerPaymentTools(server: McpServer, client: GHLClient) {
  const locationId = client.getLocationId();

  // ─── Orders ──────────────────────────────────────────────────────────

  server.tool(
    "get_order",
    "Get a specific order by ID from GoHighLevel.",
    {
      orderId: z.string().describe("The order ID"),
    },
    async ({ orderId }) => {
      try {
        const result = await client.request({
          method: "GET",
          path: `/payments/orders/${orderId}`,
          query: { altId: locationId, altType: "location" },
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text" as const, text: `Error: ${error.message}` }], isError: true };
      }
    }
  );

  server.tool(
    "list_orders",
    "List orders from GoHighLevel with optional filters.",
    {
      contactId: z.string().optional().describe("Filter by contact ID"),
      startAt: z.string().optional().describe("Start date filter"),
      endAt: z.string().optional().describe("End date filter"),
      limit: z.number().optional().default(20).describe("Number of results"),
      offset: z.number().optional().default(0).describe("Pagination offset"),
      status: z.string().optional().describe("Order status filter"),
    },
    async ({ contactId, startAt, endAt, limit, offset, status }) => {
      try {
        const result = await client.request({
          method: "GET",
          path: "/payments/orders",
          query: {
            altId: locationId,
            altType: "location",
            contactId,
            startAt,
            endAt,
            limit,
            offset,
            status,
          },
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text" as const, text: `Error: ${error.message}` }], isError: true };
      }
    }
  );

  // ─── Transactions ────────────────────────────────────────────────────

  server.tool(
    "list_transactions",
    "List payment transactions from GoHighLevel.",
    {
      contactId: z.string().optional().describe("Filter by contact ID"),
      startAt: z.string().optional().describe("Start date filter"),
      endAt: z.string().optional().describe("End date filter"),
      limit: z.number().optional().default(20).describe("Number of results"),
      offset: z.number().optional().default(0).describe("Pagination offset"),
      paymentMode: z.string().optional().describe("Payment mode filter"),
      entitySourceType: z.string().optional().describe("Entity source type"),
    },
    async ({ contactId, startAt, endAt, limit, offset, paymentMode, entitySourceType }) => {
      try {
        const result = await client.request({
          method: "GET",
          path: "/payments/transactions",
          query: {
            altId: locationId,
            altType: "location",
            contactId,
            startAt,
            endAt,
            limit,
            offset,
            paymentMode,
            entitySourceType,
          },
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text" as const, text: `Error: ${error.message}` }], isError: true };
      }
    }
  );

  server.tool(
    "get_transaction",
    "Get a specific transaction by ID.",
    {
      transactionId: z.string().describe("The transaction ID"),
    },
    async ({ transactionId }) => {
      try {
        const result = await client.request({
          method: "GET",
          path: `/payments/transactions/${transactionId}`,
          query: { altId: locationId, altType: "location" },
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text" as const, text: `Error: ${error.message}` }], isError: true };
      }
    }
  );

  // ─── Invoices ────────────────────────────────────────────────────────

  server.tool(
    "list_invoices",
    "List invoices from GoHighLevel.",
    {
      contactId: z.string().optional().describe("Filter by contact ID"),
      startAt: z.string().optional().describe("Start date filter"),
      endAt: z.string().optional().describe("End date filter"),
      limit: z.number().optional().default(20).describe("Number of results"),
      offset: z.number().optional().default(0).describe("Pagination offset"),
      status: z.string().optional().describe("Invoice status filter"),
      search: z.string().optional().describe("Search query"),
    },
    async ({ contactId, startAt, endAt, limit, offset, status, search }) => {
      try {
        const result = await client.request({
          method: "GET",
          path: "/invoices/",
          query: {
            altId: locationId,
            altType: "location",
            contactId,
            startAt,
            endAt,
            limit,
            offset,
            status,
            search,
          },
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text" as const, text: `Error: ${error.message}` }], isError: true };
      }
    }
  );

  server.tool(
    "get_invoice",
    "Get a specific invoice by ID.",
    {
      invoiceId: z.string().describe("The invoice ID"),
    },
    async ({ invoiceId }) => {
      try {
        const result = await client.request({
          method: "GET",
          path: `/invoices/${invoiceId}`,
          query: { altId: locationId, altType: "location" },
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text" as const, text: `Error: ${error.message}` }], isError: true };
      }
    }
  );

  server.tool(
    "create_invoice",
    "Create a new invoice in GoHighLevel.",
    {
      contactId: z.string().describe("Contact ID"),
      name: z.string().describe("Invoice name/title"),
      title: z.string().optional().describe("Invoice title"),
      dueDate: z.string().optional().describe("Due date (ISO 8601)"),
      items: z.array(z.object({
        name: z.string().describe("Item name"),
        description: z.string().optional().describe("Item description"),
        quantity: z.number().describe("Quantity"),
        price: z.number().describe("Unit price in cents"),
      })).optional().describe("Invoice line items"),
      discount: z.object({
        type: z.enum(["percentage", "fixed"]),
        value: z.number(),
      }).optional().describe("Discount"),
      currency: z.string().optional().default("USD").describe("Currency code"),
    },
    async (params) => {
      try {
        const result = await client.request({
          method: "POST",
          path: "/invoices/",
          body: { ...params, altId: locationId, altType: "location" },
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text" as const, text: `Error: ${error.message}` }], isError: true };
      }
    }
  );
}
