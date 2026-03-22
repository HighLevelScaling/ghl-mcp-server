/**
 * GoHighLevel Opportunities & Pipeline Tools
 * Sales pipeline management, deals, and opportunity tracking
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { GHLClient } from "../utils/ghl-client.js";

export function registerOpportunityTools(server: McpServer, client: GHLClient) {
  const locationId = client.getLocationId();

  // ─── Pipelines ───────────────────────────────────────────────────────

  server.tool(
    "get_pipelines",
    "Get all opportunity pipelines for the location.",
    {},
    async () => {
      try {
        const result = await client.request({
          method: "GET",
          path: "/opportunities/pipelines",
          query: { locationId },
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text" as const, text: `Error: ${error.message}` }], isError: true };
      }
    }
  );

  // ─── Opportunities ──────────────────────────────────────────────────

  server.tool(
    "search_opportunities",
    "Search opportunities in GoHighLevel with filters.",
    {
      pipelineId: z.string().optional().describe("Filter by pipeline ID"),
      pipelineStageId: z.string().optional().describe("Filter by pipeline stage ID"),
      contactId: z.string().optional().describe("Filter by contact ID"),
      status: z.enum(["open", "won", "lost", "abandoned", "all"]).optional().describe("Opportunity status filter"),
      assignedTo: z.string().optional().describe("Filter by assigned user ID"),
      query: z.string().optional().describe("Search query"),
      limit: z.number().optional().default(20).describe("Number of results"),
      startAfter: z.string().optional().describe("Pagination cursor"),
      order: z.enum(["asc", "desc"]).optional().describe("Sort order"),
    },
    async ({ pipelineId, pipelineStageId, contactId, status, assignedTo, query, limit, startAfter, order }) => {
      try {
        const result = await client.request({
          method: "GET",
          path: "/opportunities/search",
          query: {
            location_id: locationId,
            pipeline_id: pipelineId,
            pipeline_stage_id: pipelineStageId,
            contact_id: contactId,
            status,
            assigned_to: assignedTo,
            q: query,
            limit,
            startAfter,
            order,
          },
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text" as const, text: `Error: ${error.message}` }], isError: true };
      }
    }
  );

  server.tool(
    "get_opportunity",
    "Get a specific opportunity by ID.",
    {
      opportunityId: z.string().describe("The opportunity ID"),
    },
    async ({ opportunityId }) => {
      try {
        const result = await client.request({
          method: "GET",
          path: `/opportunities/${opportunityId}`,
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text" as const, text: `Error: ${error.message}` }], isError: true };
      }
    }
  );

  server.tool(
    "create_opportunity",
    "Create a new opportunity in GoHighLevel.",
    {
      pipelineId: z.string().describe("Pipeline ID"),
      pipelineStageId: z.string().describe("Pipeline stage ID"),
      contactId: z.string().describe("Contact ID"),
      name: z.string().describe("Opportunity name"),
      status: z.enum(["open", "won", "lost", "abandoned"]).optional().default("open").describe("Opportunity status"),
      monetaryValue: z.number().optional().describe("Monetary value of the opportunity"),
      assignedTo: z.string().optional().describe("Assigned user ID"),
      source: z.string().optional().describe("Lead source"),
      customFields: z.array(z.object({
        id: z.string(),
        value: z.union([z.string(), z.number(), z.boolean(), z.array(z.string())]),
      })).optional().describe("Custom field values"),
    },
    async (params) => {
      try {
        const result = await client.request({
          method: "POST",
          path: "/opportunities/",
          body: { ...params, locationId },
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text" as const, text: `Error: ${error.message}` }], isError: true };
      }
    }
  );

  server.tool(
    "update_opportunity",
    "Update an existing opportunity in GoHighLevel.",
    {
      opportunityId: z.string().describe("The opportunity ID to update"),
      pipelineId: z.string().optional().describe("Pipeline ID"),
      pipelineStageId: z.string().optional().describe("Pipeline stage ID"),
      name: z.string().optional().describe("Opportunity name"),
      status: z.enum(["open", "won", "lost", "abandoned"]).optional().describe("Opportunity status"),
      monetaryValue: z.number().optional().describe("Monetary value"),
      assignedTo: z.string().optional().describe("Assigned user ID"),
      source: z.string().optional().describe("Lead source"),
      customFields: z.array(z.object({
        id: z.string(),
        value: z.union([z.string(), z.number(), z.boolean(), z.array(z.string())]),
      })).optional().describe("Custom field values"),
    },
    async ({ opportunityId, ...params }) => {
      try {
        const result = await client.request({
          method: "PUT",
          path: `/opportunities/${opportunityId}`,
          body: params,
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text" as const, text: `Error: ${error.message}` }], isError: true };
      }
    }
  );

  server.tool(
    "delete_opportunity",
    "Delete an opportunity from GoHighLevel.",
    {
      opportunityId: z.string().describe("The opportunity ID to delete"),
    },
    async ({ opportunityId }) => {
      try {
        const result = await client.request({
          method: "DELETE",
          path: `/opportunities/${opportunityId}`,
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text" as const, text: `Error: ${error.message}` }], isError: true };
      }
    }
  );

  server.tool(
    "update_opportunity_status",
    "Quick update of opportunity status (won/lost/abandoned/open).",
    {
      opportunityId: z.string().describe("The opportunity ID"),
      status: z.enum(["open", "won", "lost", "abandoned"]).describe("New status"),
    },
    async ({ opportunityId, status }) => {
      try {
        const result = await client.request({
          method: "PUT",
          path: `/opportunities/${opportunityId}/status`,
          body: { status },
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text" as const, text: `Error: ${error.message}` }], isError: true };
      }
    }
  );

  server.tool(
    "upsert_opportunity",
    "Create or update an opportunity. Matches by pipeline + contact.",
    {
      pipelineId: z.string().describe("Pipeline ID"),
      pipelineStageId: z.string().describe("Pipeline stage ID"),
      contactId: z.string().describe("Contact ID"),
      name: z.string().describe("Opportunity name"),
      status: z.enum(["open", "won", "lost", "abandoned"]).optional().default("open"),
      monetaryValue: z.number().optional().describe("Monetary value"),
      assignedTo: z.string().optional().describe("Assigned user ID"),
    },
    async (params) => {
      try {
        const result = await client.request({
          method: "POST",
          path: "/opportunities/upsert",
          body: { ...params, locationId },
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text" as const, text: `Error: ${error.message}` }], isError: true };
      }
    }
  );
}
