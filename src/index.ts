#!/usr/bin/env node

/**
 * GoHighLevel MCP Server for Claude Desktop
 * 
 * A comprehensive stdio-based MCP server that bridges Claude Desktop
 * to GoHighLevel CRM via the GHL API v2. Includes optional WindsorAI
 * integration for cross-platform analytics.
 * 
 * This server acts as the missing bridge between Claude Desktop (which
 * requires stdio-based MCP) and GoHighLevel's HTTP-based MCP/API.
 * 
 * Features:
 * - 80+ tools across contacts, conversations, calendars, opportunities,
 *   payments, social media, blogs, emails, workflows, and more
 * - Direct GHL API v2 integration via Private Integration Token
 * - Optional WindsorAI connector for cross-platform analytics
 * - Full stdio transport for Claude Desktop compatibility
 * 
 * @see https://marketplace.gohighlevel.com/docs/
 * @see https://windsor.ai/connect/gohighlevel-to-claude-integration/
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { GHLClient } from "./utils/ghl-client.js";
import { registerContactTools } from "./tools/contacts.js";
import { registerConversationTools } from "./tools/conversations.js";
import { registerCalendarTools } from "./tools/calendars.js";
import { registerOpportunityTools } from "./tools/opportunities.js";
import { registerPaymentTools } from "./tools/payments.js";
import { registerSocialMediaTools } from "./tools/social-media.js";
import { registerLocationTools } from "./tools/locations.js";
import { registerWorkflowTools } from "./tools/workflows.js";
import { registerWindsorTools } from "./tools/windsor-analytics.js";

// ─── Configuration ─────────────────────────────────────────────────────

const GHL_API_KEY = process.env.GHL_API_KEY;
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;
const WINDSOR_API_KEY = process.env.WINDSOR_API_KEY;
const GHL_BASE_URL = process.env.GHL_BASE_URL || "https://services.leadconnectorhq.com";

if (!GHL_API_KEY) {
  console.error("Error: GHL_API_KEY environment variable is required.");
  console.error("");
  console.error("To get your Private Integration Token:");
  console.error("1. Go to GoHighLevel > Settings > Private Integrations");
  console.error("2. Click 'Create New Integration'");
  console.error("3. Select the required scopes");
  console.error("4. Copy the generated token");
  console.error("");
  console.error("Set it in your Claude Desktop config:");
  console.error(JSON.stringify({
    mcpServers: {
      "ghl-mcp": {
        command: "npx",
        args: ["-y", "ghl-mcp-server"],
        env: {
          GHL_API_KEY: "pit-xxxxxxxxxxxxxxxx",
          GHL_LOCATION_ID: "your-location-id",
        },
      },
    },
  }, null, 2));
  process.exit(1);
}

if (!GHL_LOCATION_ID) {
  console.error("Error: GHL_LOCATION_ID environment variable is required.");
  console.error("");
  console.error("Find your Location ID:");
  console.error("1. Go to GoHighLevel > Settings > Company");
  console.error("2. Copy the Location ID from the URL or settings page");
  process.exit(1);
}

// ─── Initialize ────────────────────────────────────────────────────────

async function main() {
  // Create the MCP server
  const server = new McpServer({
    name: "ghl-mcp-server",
    version: "1.0.0",
    description: "GoHighLevel MCP Server for Claude Desktop — Connects Claude to your GoHighLevel CRM with 80+ tools for contacts, conversations, calendars, opportunities, payments, social media, blogs, and more. Includes optional WindsorAI analytics integration.",
  });

  // Create the GHL API client
  const ghlClient = new GHLClient({
    apiKey: GHL_API_KEY!,
    locationId: GHL_LOCATION_ID!,
    baseUrl: GHL_BASE_URL,
  });

  // Register all tool modules
  registerContactTools(server, ghlClient);         // ~18 tools: contacts, tasks, notes, tags, workflows
  registerConversationTools(server, ghlClient);     // ~8 tools: conversations, messages, send
  registerCalendarTools(server, ghlClient);         // ~10 tools: calendars, events, appointments, slots
  registerOpportunityTools(server, ghlClient);      // ~8 tools: pipelines, opportunities, status
  registerPaymentTools(server, ghlClient);          // ~7 tools: orders, transactions, invoices
  registerSocialMediaTools(server, ghlClient);      // ~14 tools: social posts, accounts, blogs
  registerLocationTools(server, ghlClient);         // ~10 tools: location, custom fields, email templates
  registerWorkflowTools(server, ghlClient);         // ~8 tools: workflows, campaigns, users, forms, surveys
  registerWindsorTools(server, WINDSOR_API_KEY);    // ~4 tools: analytics (or setup guide if no key)

  // Connect via stdio transport for Claude Desktop
  const transport = new StdioServerTransport();
  await server.connect(transport);

  // Log startup info to stderr (stdout is reserved for MCP protocol)
  console.error("╔══════════════════════════════════════════════════════════╗");
  console.error("║     GoHighLevel MCP Server for Claude Desktop           ║");
  console.error("║     Connected and ready!                                ║");
  console.error("╠══════════════════════════════════════════════════════════╣");
  console.error(`║  Location: ${GHL_LOCATION_ID!.padEnd(44)}║`);
  console.error(`║  WindsorAI: ${(WINDSOR_API_KEY ? "Connected" : "Not configured").padEnd(43)}║`);
  console.error("╚══════════════════════════════════════════════════════════╝");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
