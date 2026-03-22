/**
 * GoHighLevel Contact Management Tools
 * Full CRUD operations for contacts, tasks, notes, and tags
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { GHLClient } from "../utils/ghl-client.js";

export function registerContactTools(server: McpServer, client: GHLClient) {
  const locationId = client.getLocationId();

  // ─── Search / Get Contacts ───────────────────────────────────────────

  server.tool(
    "search_contacts",
    "Search contacts in GoHighLevel with filters. Returns paginated results.",
    {
      query: z.string().optional().describe("Search query string"),
      limit: z.number().optional().default(20).describe("Number of results (max 100)"),
      skip: z.number().optional().default(0).describe("Number of results to skip"),
      sortBy: z.string().optional().describe("Field to sort by"),
      sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
    },
    async ({ query, limit, skip, sortBy, sortOrder }) => {
      try {
        const result = await client.request({
          method: "GET",
          path: "/contacts/",
          query: {
            locationId,
            query,
            limit,
            skip,
            sortBy,
            sortOrder,
          },
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text" as const, text: `Error: ${error.message}` }], isError: true };
      }
    }
  );

  server.tool(
    "get_contact",
    "Get a specific contact by ID from GoHighLevel.",
    {
      contactId: z.string().describe("The contact ID to retrieve"),
    },
    async ({ contactId }) => {
      try {
        const result = await client.request({
          method: "GET",
          path: `/contacts/${contactId}`,
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text" as const, text: `Error: ${error.message}` }], isError: true };
      }
    }
  );

  // ─── Create / Update / Upsert Contacts ──────────────────────────────

  server.tool(
    "create_contact",
    "Create a new contact in GoHighLevel.",
    {
      firstName: z.string().optional().describe("Contact first name"),
      lastName: z.string().optional().describe("Contact last name"),
      email: z.string().optional().describe("Contact email address"),
      phone: z.string().optional().describe("Contact phone number"),
      companyName: z.string().optional().describe("Company name"),
      website: z.string().optional().describe("Website URL"),
      tags: z.array(z.string()).optional().describe("Tags to assign"),
      source: z.string().optional().describe("Lead source"),
      address1: z.string().optional().describe("Street address"),
      city: z.string().optional().describe("City"),
      state: z.string().optional().describe("State"),
      postalCode: z.string().optional().describe("Postal/ZIP code"),
      country: z.string().optional().describe("Country code"),
      timezone: z.string().optional().describe("Timezone"),
      dnd: z.boolean().optional().describe("Do Not Disturb flag"),
      customFields: z.array(z.object({
        id: z.string(),
        value: z.union([z.string(), z.number(), z.boolean(), z.array(z.string())]),
      })).optional().describe("Custom field values"),
    },
    async (params) => {
      try {
        const result = await client.request({
          method: "POST",
          path: "/contacts/",
          body: { ...params, locationId },
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text" as const, text: `Error: ${error.message}` }], isError: true };
      }
    }
  );

  server.tool(
    "update_contact",
    "Update an existing contact in GoHighLevel.",
    {
      contactId: z.string().describe("The contact ID to update"),
      firstName: z.string().optional().describe("Contact first name"),
      lastName: z.string().optional().describe("Contact last name"),
      email: z.string().optional().describe("Contact email address"),
      phone: z.string().optional().describe("Contact phone number"),
      companyName: z.string().optional().describe("Company name"),
      website: z.string().optional().describe("Website URL"),
      tags: z.array(z.string()).optional().describe("Tags to assign"),
      source: z.string().optional().describe("Lead source"),
      address1: z.string().optional().describe("Street address"),
      city: z.string().optional().describe("City"),
      state: z.string().optional().describe("State"),
      postalCode: z.string().optional().describe("Postal/ZIP code"),
      country: z.string().optional().describe("Country code"),
      dnd: z.boolean().optional().describe("Do Not Disturb flag"),
      customFields: z.array(z.object({
        id: z.string(),
        value: z.union([z.string(), z.number(), z.boolean(), z.array(z.string())]),
      })).optional().describe("Custom field values"),
    },
    async ({ contactId, ...params }) => {
      try {
        const result = await client.request({
          method: "PUT",
          path: `/contacts/${contactId}`,
          body: params,
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text" as const, text: `Error: ${error.message}` }], isError: true };
      }
    }
  );

  server.tool(
    "upsert_contact",
    "Create or update a contact in GoHighLevel. If a matching contact exists (by email/phone), it updates; otherwise creates new.",
    {
      firstName: z.string().optional().describe("Contact first name"),
      lastName: z.string().optional().describe("Contact last name"),
      email: z.string().optional().describe("Contact email address"),
      phone: z.string().optional().describe("Contact phone number"),
      companyName: z.string().optional().describe("Company name"),
      website: z.string().optional().describe("Website URL"),
      tags: z.array(z.string()).optional().describe("Tags to assign"),
      source: z.string().optional().describe("Lead source"),
      address1: z.string().optional().describe("Street address"),
      city: z.string().optional().describe("City"),
      state: z.string().optional().describe("State"),
      postalCode: z.string().optional().describe("Postal/ZIP code"),
      country: z.string().optional().describe("Country code"),
      customFields: z.array(z.object({
        id: z.string(),
        value: z.union([z.string(), z.number(), z.boolean(), z.array(z.string())]),
      })).optional().describe("Custom field values"),
    },
    async (params) => {
      try {
        const result = await client.request({
          method: "POST",
          path: "/contacts/upsert",
          body: { ...params, locationId },
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text" as const, text: `Error: ${error.message}` }], isError: true };
      }
    }
  );

  server.tool(
    "delete_contact",
    "Delete a contact from GoHighLevel.",
    {
      contactId: z.string().describe("The contact ID to delete"),
    },
    async ({ contactId }) => {
      try {
        const result = await client.request({
          method: "DELETE",
          path: `/contacts/${contactId}`,
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text" as const, text: `Error: ${error.message}` }], isError: true };
      }
    }
  );

  // ─── Tags ────────────────────────────────────────────────────────────

  server.tool(
    "add_contact_tags",
    "Add tags to a contact in GoHighLevel.",
    {
      contactId: z.string().describe("The contact ID"),
      tags: z.array(z.string()).describe("Tags to add"),
    },
    async ({ contactId, tags }) => {
      try {
        const result = await client.request({
          method: "POST",
          path: `/contacts/${contactId}/tags`,
          body: { tags },
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text" as const, text: `Error: ${error.message}` }], isError: true };
      }
    }
  );

  server.tool(
    "remove_contact_tags",
    "Remove tags from a contact in GoHighLevel.",
    {
      contactId: z.string().describe("The contact ID"),
      tags: z.array(z.string()).describe("Tags to remove"),
    },
    async ({ contactId, tags }) => {
      try {
        const result = await client.request({
          method: "DELETE",
          path: `/contacts/${contactId}/tags`,
          body: { tags },
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text" as const, text: `Error: ${error.message}` }], isError: true };
      }
    }
  );

  // ─── Tasks ───────────────────────────────────────────────────────────

  server.tool(
    "get_contact_tasks",
    "Get all tasks for a contact in GoHighLevel.",
    {
      contactId: z.string().describe("The contact ID"),
    },
    async ({ contactId }) => {
      try {
        const result = await client.request({
          method: "GET",
          path: `/contacts/${contactId}/tasks`,
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text" as const, text: `Error: ${error.message}` }], isError: true };
      }
    }
  );

  server.tool(
    "create_contact_task",
    "Create a task for a contact in GoHighLevel.",
    {
      contactId: z.string().describe("The contact ID"),
      title: z.string().describe("Task title"),
      body: z.string().optional().describe("Task description"),
      dueDate: z.string().optional().describe("Due date (ISO 8601 format)"),
      completed: z.boolean().optional().default(false).describe("Whether the task is completed"),
      assignedTo: z.string().optional().describe("User ID to assign the task to"),
    },
    async ({ contactId, ...params }) => {
      try {
        const result = await client.request({
          method: "POST",
          path: `/contacts/${contactId}/tasks`,
          body: params,
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text" as const, text: `Error: ${error.message}` }], isError: true };
      }
    }
  );

  server.tool(
    "update_contact_task",
    "Update a task for a contact in GoHighLevel.",
    {
      contactId: z.string().describe("The contact ID"),
      taskId: z.string().describe("The task ID to update"),
      title: z.string().optional().describe("Task title"),
      body: z.string().optional().describe("Task description"),
      dueDate: z.string().optional().describe("Due date (ISO 8601 format)"),
      completed: z.boolean().optional().describe("Whether the task is completed"),
      assignedTo: z.string().optional().describe("User ID to assign the task to"),
    },
    async ({ contactId, taskId, ...params }) => {
      try {
        const result = await client.request({
          method: "PUT",
          path: `/contacts/${contactId}/tasks/${taskId}`,
          body: params,
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text" as const, text: `Error: ${error.message}` }], isError: true };
      }
    }
  );

  server.tool(
    "delete_contact_task",
    "Delete a task for a contact in GoHighLevel.",
    {
      contactId: z.string().describe("The contact ID"),
      taskId: z.string().describe("The task ID to delete"),
    },
    async ({ contactId, taskId }) => {
      try {
        const result = await client.request({
          method: "DELETE",
          path: `/contacts/${contactId}/tasks/${taskId}`,
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text" as const, text: `Error: ${error.message}` }], isError: true };
      }
    }
  );

  // ─── Notes ───────────────────────────────────────────────────────────

  server.tool(
    "get_contact_notes",
    "Get all notes for a contact in GoHighLevel.",
    {
      contactId: z.string().describe("The contact ID"),
    },
    async ({ contactId }) => {
      try {
        const result = await client.request({
          method: "GET",
          path: `/contacts/${contactId}/notes`,
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text" as const, text: `Error: ${error.message}` }], isError: true };
      }
    }
  );

  server.tool(
    "create_contact_note",
    "Create a note for a contact in GoHighLevel.",
    {
      contactId: z.string().describe("The contact ID"),
      body: z.string().describe("Note content"),
    },
    async ({ contactId, body }) => {
      try {
        const result = await client.request({
          method: "POST",
          path: `/contacts/${contactId}/notes`,
          body: { body },
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text" as const, text: `Error: ${error.message}` }], isError: true };
      }
    }
  );

  server.tool(
    "update_contact_note",
    "Update a note for a contact in GoHighLevel.",
    {
      contactId: z.string().describe("The contact ID"),
      noteId: z.string().describe("The note ID to update"),
      body: z.string().describe("Updated note content"),
    },
    async ({ contactId, noteId, body }) => {
      try {
        const result = await client.request({
          method: "PUT",
          path: `/contacts/${contactId}/notes/${noteId}`,
          body: { body },
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text" as const, text: `Error: ${error.message}` }], isError: true };
      }
    }
  );

  server.tool(
    "delete_contact_note",
    "Delete a note for a contact in GoHighLevel.",
    {
      contactId: z.string().describe("The contact ID"),
      noteId: z.string().describe("The note ID to delete"),
    },
    async ({ contactId, noteId }) => {
      try {
        const result = await client.request({
          method: "DELETE",
          path: `/contacts/${contactId}/notes/${noteId}`,
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text" as const, text: `Error: ${error.message}` }], isError: true };
      }
    }
  );

  // ─── Workflows ───────────────────────────────────────────────────────

  server.tool(
    "add_contact_to_workflow",
    "Add a contact to a workflow in GoHighLevel.",
    {
      contactId: z.string().describe("The contact ID"),
      workflowId: z.string().describe("The workflow ID"),
    },
    async ({ contactId, workflowId }) => {
      try {
        const result = await client.request({
          method: "POST",
          path: `/contacts/${contactId}/workflow/${workflowId}`,
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text" as const, text: `Error: ${error.message}` }], isError: true };
      }
    }
  );

  server.tool(
    "remove_contact_from_workflow",
    "Remove a contact from a workflow in GoHighLevel.",
    {
      contactId: z.string().describe("The contact ID"),
      workflowId: z.string().describe("The workflow ID"),
    },
    async ({ contactId, workflowId }) => {
      try {
        const result = await client.request({
          method: "DELETE",
          path: `/contacts/${contactId}/workflow/${workflowId}`,
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text" as const, text: `Error: ${error.message}` }], isError: true };
      }
    }
  );
}
