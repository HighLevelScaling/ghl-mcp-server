/**
 * GoHighLevel Location, Custom Fields, and Email Template Tools
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { GHLClient } from "../utils/ghl-client.js";

export function registerLocationTools(server: McpServer, client: GHLClient) {
  const locationId = client.getLocationId();

  // ─── Location ────────────────────────────────────────────────────────

  server.tool(
    "get_location",
    "Get the current location (sub-account) details from GoHighLevel.",
    {},
    async () => {
      try {
        const result = await client.request({
          method: "GET",
          path: `/locations/${locationId}`,
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text" as const, text: `Error: ${error.message}` }], isError: true };
      }
    }
  );

  server.tool(
    "get_location_tags",
    "Get all tags for the location.",
    {},
    async () => {
      try {
        const result = await client.request({
          method: "GET",
          path: `/locations/${locationId}/tags`,
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text" as const, text: `Error: ${error.message}` }], isError: true };
      }
    }
  );

  server.tool(
    "create_location_tag",
    "Create a new tag for the location.",
    {
      name: z.string().describe("Tag name"),
    },
    async ({ name }) => {
      try {
        const result = await client.request({
          method: "POST",
          path: `/locations/${locationId}/tags`,
          body: { name },
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text" as const, text: `Error: ${error.message}` }], isError: true };
      }
    }
  );

  // ─── Custom Fields ───────────────────────────────────────────────────

  server.tool(
    "get_custom_fields",
    "Get all custom field definitions for the location.",
    {
      model: z.enum(["contact", "opportunity", "all"]).optional().default("all").describe("Filter by model type"),
    },
    async ({ model }) => {
      try {
        const result = await client.request({
          method: "GET",
          path: `/locations/${locationId}/customFields`,
          query: { model: model === "all" ? undefined : model },
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text" as const, text: `Error: ${error.message}` }], isError: true };
      }
    }
  );

  server.tool(
    "create_custom_field",
    "Create a new custom field for the location.",
    {
      name: z.string().describe("Field name"),
      dataType: z.enum(["TEXT", "LARGE_TEXT", "NUMERICAL", "PHONE", "MONETORY", "CHECKBOX", "SINGLE_OPTIONS", "MULTIPLE_OPTIONS", "FLOAT", "DATE", "TEXTBOX_LIST", "FILE_UPLOAD", "SIGNATURE"]).describe("Field data type"),
      model: z.enum(["contact", "opportunity"]).describe("Model to attach the field to"),
      placeholder: z.string().optional().describe("Placeholder text"),
      options: z.array(z.string()).optional().describe("Options for dropdown fields"),
      position: z.number().optional().describe("Field position/order"),
    },
    async (params) => {
      try {
        const result = await client.request({
          method: "POST",
          path: `/locations/${locationId}/customFields`,
          body: params,
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text" as const, text: `Error: ${error.message}` }], isError: true };
      }
    }
  );

  // ─── Custom Values ───────────────────────────────────────────────────

  server.tool(
    "get_custom_values",
    "Get all custom values for the location.",
    {},
    async () => {
      try {
        const result = await client.request({
          method: "GET",
          path: `/locations/${locationId}/customValues`,
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text" as const, text: `Error: ${error.message}` }], isError: true };
      }
    }
  );

  // ─── Email Templates ─────────────────────────────────────────────────

  server.tool(
    "get_email_templates",
    "Get email templates for the location.",
    {
      originId: z.string().optional().describe("Origin ID filter"),
      limit: z.number().optional().default(20).describe("Number of results"),
      offset: z.number().optional().default(0).describe("Pagination offset"),
    },
    async ({ originId, limit, offset }) => {
      try {
        const result = await client.request({
          method: "GET",
          path: "/emails/templates",
          query: { locationId, originId, limit, offset },
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text" as const, text: `Error: ${error.message}` }], isError: true };
      }
    }
  );

  server.tool(
    "create_email_template",
    "Create a new email template in GoHighLevel.",
    {
      name: z.string().describe("Template name"),
      subject: z.string().describe("Email subject"),
      html: z.string().describe("HTML content of the email"),
    },
    async (params) => {
      try {
        const result = await client.request({
          method: "POST",
          path: "/emails/templates",
          body: { ...params, locationId },
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text" as const, text: `Error: ${error.message}` }], isError: true };
      }
    }
  );

  server.tool(
    "update_email_template",
    "Update an existing email template.",
    {
      templateId: z.string().describe("The template ID to update"),
      name: z.string().optional().describe("Template name"),
      subject: z.string().optional().describe("Email subject"),
      html: z.string().optional().describe("HTML content"),
    },
    async ({ templateId, ...params }) => {
      try {
        const result = await client.request({
          method: "PUT",
          path: `/emails/templates/${templateId}`,
          body: { ...params, locationId },
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text" as const, text: `Error: ${error.message}` }], isError: true };
      }
    }
  );

  server.tool(
    "delete_email_template",
    "Delete an email template.",
    {
      templateId: z.string().describe("The template ID to delete"),
    },
    async ({ templateId }) => {
      try {
        const result = await client.request({
          method: "DELETE",
          path: `/emails/templates/${templateId}`,
          query: { locationId },
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text" as const, text: `Error: ${error.message}` }], isError: true };
      }
    }
  );
}
