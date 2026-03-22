/**
 * GoHighLevel Workflow & Campaign Tools
 * Workflow management and campaign operations
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { GHLClient } from "../utils/ghl-client.js";

export function registerWorkflowTools(server: McpServer, client: GHLClient) {
  const locationId = client.getLocationId();

  // ─── Workflows ───────────────────────────────────────────────────────

  server.tool(
    "get_workflows",
    "Get all workflows for the location in GoHighLevel.",
    {},
    async () => {
      try {
        const result = await client.request({
          method: "GET",
          path: "/workflows/",
          query: { locationId },
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text" as const, text: `Error: ${error.message}` }], isError: true };
      }
    }
  );

  // ─── Campaigns ───────────────────────────────────────────────────────

  server.tool(
    "get_campaigns",
    "Get all campaigns for the location.",
    {
      status: z.string().optional().describe("Campaign status filter"),
    },
    async ({ status }) => {
      try {
        const result = await client.request({
          method: "GET",
          path: "/campaigns/",
          query: { locationId, status },
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text" as const, text: `Error: ${error.message}` }], isError: true };
      }
    }
  );

  // ─── Users ───────────────────────────────────────────────────────────

  server.tool(
    "get_users",
    "Get all users for the location.",
    {},
    async () => {
      try {
        const result = await client.request({
          method: "GET",
          path: "/users/",
          query: { locationId },
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text" as const, text: `Error: ${error.message}` }], isError: true };
      }
    }
  );

  server.tool(
    "get_user",
    "Get a specific user by ID.",
    {
      userId: z.string().describe("The user ID"),
    },
    async ({ userId }) => {
      try {
        const result = await client.request({
          method: "GET",
          path: `/users/${userId}`,
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text" as const, text: `Error: ${error.message}` }], isError: true };
      }
    }
  );

  // ─── Forms & Surveys ─────────────────────────────────────────────────

  server.tool(
    "get_forms",
    "Get all forms for the location.",
    {
      limit: z.number().optional().default(20).describe("Number of results"),
      skip: z.number().optional().default(0).describe("Pagination offset"),
      type: z.string().optional().describe("Form type filter"),
    },
    async ({ limit, skip, type }) => {
      try {
        const result = await client.request({
          method: "GET",
          path: "/forms/",
          query: { locationId, limit, skip, type },
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text" as const, text: `Error: ${error.message}` }], isError: true };
      }
    }
  );

  server.tool(
    "get_form_submissions",
    "Get form submissions for a specific form.",
    {
      formId: z.string().describe("The form ID"),
      limit: z.number().optional().default(20).describe("Number of results"),
      startAt: z.string().optional().describe("Start date filter"),
      endAt: z.string().optional().describe("End date filter"),
    },
    async ({ formId, limit, startAt, endAt }) => {
      try {
        const result = await client.request({
          method: "GET",
          path: `/forms/submissions`,
          query: { locationId, formId, limit, startAt, endAt },
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text" as const, text: `Error: ${error.message}` }], isError: true };
      }
    }
  );

  server.tool(
    "get_surveys",
    "Get all surveys for the location.",
    {
      limit: z.number().optional().default(20).describe("Number of results"),
      skip: z.number().optional().default(0).describe("Pagination offset"),
    },
    async ({ limit, skip }) => {
      try {
        const result = await client.request({
          method: "GET",
          path: "/surveys/",
          query: { locationId, limit, skip },
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text" as const, text: `Error: ${error.message}` }], isError: true };
      }
    }
  );

  server.tool(
    "get_survey_submissions",
    "Get survey submissions for a specific survey.",
    {
      surveyId: z.string().describe("The survey ID"),
      limit: z.number().optional().default(20).describe("Number of results"),
    },
    async ({ surveyId, limit }) => {
      try {
        const result = await client.request({
          method: "GET",
          path: "/surveys/submissions",
          query: { locationId, surveyId, limit },
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text" as const, text: `Error: ${error.message}` }], isError: true };
      }
    }
  );
}
