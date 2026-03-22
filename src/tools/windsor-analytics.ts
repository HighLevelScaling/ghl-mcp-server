/**
 * WindsorAI Analytics Tools
 * Optional integration for cross-platform analytics and reporting
 * WindsorAI connects GoHighLevel data with 325+ sources for AI-driven insights
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { WindsorAIClient } from "../utils/ghl-client.js";

export function registerWindsorTools(server: McpServer, windsorApiKey: string | undefined) {
  if (!windsorApiKey) {
    // Register a helper tool that explains WindsorAI setup
    server.tool(
      "windsor_setup_guide",
      "Get instructions for setting up WindsorAI integration for cross-platform analytics with GoHighLevel data.",
      {},
      async () => {
        return {
          content: [{
            type: "text" as const,
            text: `## WindsorAI Integration Setup Guide

WindsorAI connects your GoHighLevel data with 325+ marketing and analytics sources for AI-driven insights.

### Setup Steps:

1. **Sign up** at https://windsor.ai (30-day free trial, no credit card needed)
2. **Connect GoHighLevel** as a data source in the Windsor.ai dashboard
3. **Get your API key** from Windsor.ai settings
4. **Add to your MCP config:**
   Set the WINDSOR_API_KEY environment variable in your Claude Desktop config:
   
   \`\`\`json
   {
     "mcpServers": {
       "ghl-mcp": {
         "command": "npx",
         "args": ["-y", "ghl-mcp-server"],
         "env": {
           "GHL_API_KEY": "your-ghl-private-integration-token",
           "GHL_LOCATION_ID": "your-location-id",
           "WINDSOR_API_KEY": "your-windsor-api-key"
         }
       }
     }
   }
   \`\`\`

### What WindsorAI Provides:
- **16 metrics** and **199 dimensions** from GoHighLevel
- Cross-platform analytics (combine with Google Ads, Meta Ads, GA4, etc.)
- Contact and conversation metrics
- Sales and opportunity analytics
- Task and user data
- Location information

### Supported Fields Include:
- contact_name, contact_email, contact_phone, contact_tags
- opportunity_name, opportunity_monetary_value, opportunity_status
- pipeline_name, pipeline_stage
- order_amount, invoice_status, payment_mode
- conversation_unread_count, last_message_type
- And 180+ more dimensions

Learn more: https://windsor.ai/connect/gohighlevel-to-claude-integration/`,
          }],
        };
      }
    );
    return;
  }

  const windsorClient = new WindsorAIClient(windsorApiKey);

  server.tool(
    "windsor_get_ghl_analytics",
    "Fetch GoHighLevel analytics data via WindsorAI. Provides cross-platform marketing and CRM insights.",
    {
      fields: z.array(z.string()).optional().describe("Fields to retrieve (e.g., contact_name, opportunity_monetary_value, pipeline_stage). Leave empty for default fields."),
      date_preset: z.enum(["today", "yesterday", "last_7d", "last_14d", "last_28d", "last_30d", "last_90d", "this_month", "last_month"]).optional().describe("Date range preset"),
      filter: z.string().optional().describe("Filter expression (e.g., 'opportunity_status=won')"),
    },
    async ({ fields, date_preset, filter }) => {
      try {
        const result = await windsorClient.fetchData({
          source: "gohighlevel",
          fields,
          date_preset,
          filter,
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text" as const, text: `Error: ${error.message}` }], isError: true };
      }
    }
  );

  server.tool(
    "windsor_get_cross_platform_data",
    "Fetch cross-platform analytics combining GoHighLevel with other sources via WindsorAI.",
    {
      source: z.string().describe("Data source (e.g., 'gohighlevel', 'google_ads', 'facebook', 'google_analytics_4')"),
      fields: z.array(z.string()).optional().describe("Fields to retrieve"),
      date_preset: z.enum(["today", "yesterday", "last_7d", "last_14d", "last_28d", "last_30d", "last_90d", "this_month", "last_month"]).optional().describe("Date range preset"),
      filter: z.string().optional().describe("Filter expression"),
    },
    async ({ source, fields, date_preset, filter }) => {
      try {
        const result = await windsorClient.fetchData({
          source,
          fields,
          date_preset,
          filter,
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text" as const, text: `Error: ${error.message}` }], isError: true };
      }
    }
  );

  server.tool(
    "windsor_analyze_pipeline",
    "Analyze sales pipeline performance using WindsorAI data from GoHighLevel.",
    {
      date_preset: z.enum(["last_7d", "last_14d", "last_28d", "last_30d", "last_90d", "this_month", "last_month"]).optional().default("last_30d").describe("Date range"),
    },
    async ({ date_preset }) => {
      try {
        const result = await windsorClient.fetchData({
          source: "gohighlevel",
          fields: [
            "pipeline_name",
            "pipeline_stage",
            "opportunity_status",
            "opportunity_monetary_value",
            "opportunity_assigned_to",
            "contact_name",
          ],
          date_preset,
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text" as const, text: `Error: ${error.message}` }], isError: true };
      }
    }
  );

  server.tool(
    "windsor_contact_insights",
    "Get contact and conversation insights from GoHighLevel via WindsorAI.",
    {
      date_preset: z.enum(["last_7d", "last_14d", "last_28d", "last_30d", "last_90d", "this_month", "last_month"]).optional().default("last_30d").describe("Date range"),
    },
    async ({ date_preset }) => {
      try {
        const result = await windsorClient.fetchData({
          source: "gohighlevel",
          fields: [
            "contact_name",
            "contact_email",
            "contact_tags",
            "contact_source",
            "last_activity",
            "conversation_unread_count",
            "last_message_type",
          ],
          date_preset,
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text" as const, text: `Error: ${error.message}` }], isError: true };
      }
    }
  );
}
