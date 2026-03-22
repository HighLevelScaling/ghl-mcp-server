# GoHighLevel MCP Server for Claude Desktop

A comprehensive **Model Context Protocol (MCP)** server that connects **Claude Desktop** directly to your **GoHighLevel CRM** account. This server bridges the gap between Claude Desktop's stdio-based MCP transport and GoHighLevel's HTTP API, giving you **80+ powerful tools** to manage contacts, conversations, calendars, opportunities, payments, social media, blogs, and more — all through natural language in Claude.

Includes optional **WindsorAI** integration for cross-platform analytics and reporting.

---

## Why This Exists

GoHighLevel provides an [official HTTP-based MCP server](https://marketplace.gohighlevel.com/docs/other/mcp/index.html), but **Claude Desktop only supports stdio-based MCP servers**. GoHighLevel's roadmap mentions an upcoming `npx` package for Claude Desktop, but it is not yet available.

This project solves that problem by providing a **local stdio MCP server** that communicates directly with the GoHighLevel API v2, making all CRM functionality accessible from Claude Desktop today.

For users who also want **cross-platform analytics** (combining GoHighLevel data with Google Ads, Meta Ads, GA4, and 325+ other sources), the optional [WindsorAI](https://windsor.ai/connect/gohighlevel-to-claude-integration/) connector is included.

---

## Features

| Category | Tools | Capabilities |
|---|---|---|
| **Contacts** | 18 | Search, create, update, delete, upsert, tags, tasks, notes, workflows |
| **Conversations** | 8 | Search, send SMS/Email/WhatsApp, get messages, manage status |
| **Calendars** | 10 | List calendars, events, free slots, create/update/delete appointments |
| **Opportunities** | 8 | Pipelines, search, create, update, delete, status changes, upsert |
| **Payments** | 7 | Orders, transactions, invoices (list, get, create) |
| **Social Media** | 7 | Accounts, statistics, create/edit/delete posts |
| **Blogs** | 7 | Sites, posts, categories, authors, create/update posts, slug check |
| **Locations** | 10 | Location details, tags, custom fields, custom values, email templates |
| **Workflows** | 8 | Workflows, campaigns, users, forms, surveys, submissions |
| **WindsorAI** | 4 | Cross-platform analytics, pipeline analysis, contact insights |

**Total: 80+ tools** available through natural language in Claude Desktop.

---

## Quick Start

### Prerequisites

- **Node.js** 18 or later
- **Claude Desktop** (latest version)
- **GoHighLevel** account with API access
- A **Private Integration Token** from GoHighLevel

### Step 1: Get Your GoHighLevel Private Integration Token

1. Log in to your GoHighLevel account.
2. Navigate to **Settings > Private Integrations**.
3. Click **"Create New Integration"**.
4. Name it (e.g., "Claude MCP Server").
5. Select the required scopes (see [Required Scopes](#required-scopes) below).
6. Click **Save** and **copy the generated token** immediately (you will not be able to see it again).
7. Also note your **Location ID** from **Settings > Company**.

### Step 2: Configure Claude Desktop

Open your Claude Desktop configuration file:

- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **Linux**: `~/.config/Claude/claude_desktop_config.json`

Add the following configuration:

```json
{
  "mcpServers": {
    "ghl-mcp": {
      "command": "npx",
      "args": ["-y", "ghl-mcp-server"],
      "env": {
        "GHL_API_KEY": "pit-xxxxxxxxxxxxxxxxxxxxxxxx",
        "GHL_LOCATION_ID": "your-location-id-here"
      }
    }
  }
}
```

### Step 3: Restart Claude Desktop

Restart Claude Desktop. You should see the GoHighLevel tools available in the MCP tools list (hammer icon).

### Step 4: Start Using It

Ask Claude things like:

- *"Show me all my contacts tagged as VIP"*
- *"Create a new contact: John Smith, john@example.com, phone 555-0123"*
- *"What appointments do I have this week?"*
- *"Search for open opportunities worth more than $5,000"*
- *"Send an SMS to contact ID abc123 saying 'Your appointment is confirmed'"*
- *"Create a blog post about our new product launch"*
- *"Show me my sales pipeline overview"*

---

## Alternative Installation (Local Clone)

If you prefer to run from source:

```bash
git clone https://github.com/HighLevelScaling/ghl-mcp-server.git
cd ghl-mcp-server
npm install
npm run build
```

Then configure Claude Desktop to use the local build:

```json
{
  "mcpServers": {
    "ghl-mcp": {
      "command": "node",
      "args": ["/path/to/ghl-mcp-server/dist/index.js"],
      "env": {
        "GHL_API_KEY": "pit-xxxxxxxxxxxxxxxxxxxxxxxx",
        "GHL_LOCATION_ID": "your-location-id-here"
      }
    }
  }
}
```

---

## WindsorAI Integration (Optional)

[WindsorAI](https://windsor.ai/) provides a no-code connector that syncs GoHighLevel data with 325+ marketing and analytics sources. When configured, it adds powerful cross-platform analytics tools to your Claude Desktop.

### Setup

1. Sign up at [windsor.ai](https://windsor.ai/) (30-day free trial).
2. Connect GoHighLevel as a data source in the WindsorAI dashboard.
3. Get your WindsorAI API key from settings.
4. Add the `WINDSOR_API_KEY` to your Claude Desktop config:

```json
{
  "mcpServers": {
    "ghl-mcp": {
      "command": "npx",
      "args": ["-y", "ghl-mcp-server"],
      "env": {
        "GHL_API_KEY": "pit-xxxxxxxxxxxxxxxxxxxxxxxx",
        "GHL_LOCATION_ID": "your-location-id-here",
        "WINDSOR_API_KEY": "your-windsor-api-key"
      }
    }
  }
}
```

### What WindsorAI Adds

With WindsorAI configured, you can ask Claude:

- *"Analyze my sales pipeline performance over the last 90 days"*
- *"Compare my Google Ads spend with GoHighLevel closed deals"*
- *"Which campaigns generated the most qualified leads?"*
- *"Show me contact engagement insights for the last month"*

WindsorAI provides **16 metrics** and **199 dimensions** from GoHighLevel, including contact data, opportunity values, pipeline stages, orders, invoices, conversations, and more.

---

## Required Scopes

When creating your Private Integration Token, enable these scopes for full functionality:

| Scope | Required For |
|---|---|
| View Contacts | Reading contact data |
| Edit Contacts | Creating/updating contacts |
| View Conversations | Reading conversations |
| Edit Conversations | Sending messages |
| View Conversation Messages | Reading messages |
| Edit Conversation Messages | Managing message status |
| View Opportunities | Reading opportunities/pipelines |
| Edit Opportunities | Creating/updating opportunities |
| View Calendars | Reading calendars |
| View Calendar Events | Reading events |
| Edit Calendar Events | Creating/updating appointments |
| Edit Calendars | Managing calendars |
| View Locations | Reading location details |
| View Custom Fields | Reading custom field definitions |
| View Payment Orders | Reading orders |
| View Payment Transactions | Reading transactions |
| View Forms | Reading forms and submissions |
| View Social Media Posts | Reading social posts |
| Edit Social Media Posts | Creating/editing posts |
| View Social Media Accounts | Reading connected accounts |
| View Email Templates | Reading email templates |
| Create, Update and Delete Email Templates | Managing templates |
| View Blog Authors | Reading blog authors |
| View Blog Categories | Reading blog categories |
| Check Blog Post Slug | Validating blog URLs |
| Create Blog Post | Creating blog posts |
| Update Blog Post | Updating blog posts |

> **Tip:** You can start with fewer scopes and add more later by editing your Private Integration in GoHighLevel settings.

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GHL_API_KEY` | Yes | Your GoHighLevel Private Integration Token |
| `GHL_LOCATION_ID` | Yes | Your GoHighLevel Location (sub-account) ID |
| `WINDSOR_API_KEY` | No | Your WindsorAI API key for analytics |
| `GHL_BASE_URL` | No | Custom API base URL (default: `https://services.leadconnectorhq.com`) |

---

## Architecture

```
┌──────────────────┐     stdio      ┌──────────────────┐     HTTPS      ┌──────────────────┐
│                  │ ◄────────────► │                  │ ◄────────────► │                  │
│  Claude Desktop  │   MCP JSON     │  ghl-mcp-server  │   REST API     │  GoHighLevel     │
│                  │   over stdio   │  (this project)  │   v2           │  API             │
└──────────────────┘                └──────────────────┘                └──────────────────┘
                                           │
                                           │ HTTPS (optional)
                                           ▼
                                    ┌──────────────────┐
                                    │  WindsorAI       │
                                    │  Analytics API   │
                                    └──────────────────┘
```

The server runs as a **local stdio process** that Claude Desktop spawns and communicates with via JSON-RPC over stdin/stdout. All GoHighLevel API calls are made server-side using your Private Integration Token.

---

## Tool Reference

### Contact Tools

| Tool | Description |
|---|---|
| `search_contacts` | Search contacts with query filters |
| `get_contact` | Get contact by ID |
| `create_contact` | Create a new contact |
| `update_contact` | Update an existing contact |
| `upsert_contact` | Create or update (match by email/phone) |
| `delete_contact` | Delete a contact |
| `add_contact_tags` | Add tags to a contact |
| `remove_contact_tags` | Remove tags from a contact |
| `get_contact_tasks` | Get tasks for a contact |
| `create_contact_task` | Create a task for a contact |
| `update_contact_task` | Update a contact task |
| `delete_contact_task` | Delete a contact task |
| `get_contact_notes` | Get notes for a contact |
| `create_contact_note` | Create a note for a contact |
| `update_contact_note` | Update a contact note |
| `delete_contact_note` | Delete a contact note |
| `add_contact_to_workflow` | Add contact to a workflow |
| `remove_contact_from_workflow` | Remove contact from a workflow |

### Conversation Tools

| Tool | Description |
|---|---|
| `search_conversations` | Search conversations with filters |
| `get_conversation` | Get conversation by ID |
| `create_conversation` | Create a new conversation |
| `get_messages` | Get messages from a conversation |
| `send_message` | Send SMS, Email, WhatsApp, or other message |
| `update_message_status` | Update message read/delivery status |
| `cancel_scheduled_message` | Cancel a scheduled message |
| `get_message_recording` | Get call recording URL |

### Calendar Tools

| Tool | Description |
|---|---|
| `get_calendars` | List all calendars |
| `get_calendar` | Get calendar by ID |
| `get_calendar_free_slots` | Get available booking slots |
| `get_calendar_events` | Get calendar events |
| `get_appointment` | Get appointment by ID |
| `create_appointment` | Create a new appointment |
| `update_appointment` | Update an appointment |
| `delete_appointment` | Delete/cancel an appointment |
| `get_appointment_notes` | Get appointment notes |
| `create_block_slot` | Block a time slot |

### Opportunity Tools

| Tool | Description |
|---|---|
| `get_pipelines` | List all pipelines |
| `search_opportunities` | Search opportunities with filters |
| `get_opportunity` | Get opportunity by ID |
| `create_opportunity` | Create a new opportunity |
| `update_opportunity` | Update an opportunity |
| `delete_opportunity` | Delete an opportunity |
| `update_opportunity_status` | Quick status update (won/lost/open) |
| `upsert_opportunity` | Create or update opportunity |

### Payment Tools

| Tool | Description |
|---|---|
| `get_order` | Get order by ID |
| `list_orders` | List orders with filters |
| `list_transactions` | List payment transactions |
| `get_transaction` | Get transaction by ID |
| `list_invoices` | List invoices |
| `get_invoice` | Get invoice by ID |
| `create_invoice` | Create a new invoice |

### Social Media & Blog Tools

| Tool | Description |
|---|---|
| `get_social_media_accounts` | List connected social accounts |
| `get_social_media_statistics` | Get social media analytics |
| `get_social_media_posts` | List social media posts |
| `get_social_media_post` | Get post by ID |
| `create_social_media_post` | Create a new post |
| `update_social_media_post` | Update a post |
| `delete_social_media_post` | Delete a post |
| `get_blogs` | List blog sites |
| `get_blog_posts` | List blog posts |
| `create_blog_post` | Create a blog post |
| `update_blog_post` | Update a blog post |
| `check_blog_slug` | Check URL slug availability |
| `get_blog_categories` | List blog categories |
| `get_blog_authors` | List blog authors |

### Location & Email Tools

| Tool | Description |
|---|---|
| `get_location` | Get location details |
| `get_location_tags` | List location tags |
| `create_location_tag` | Create a new tag |
| `get_custom_fields` | List custom field definitions |
| `create_custom_field` | Create a custom field |
| `get_custom_values` | List custom values |
| `get_email_templates` | List email templates |
| `create_email_template` | Create an email template |
| `update_email_template` | Update an email template |
| `delete_email_template` | Delete an email template |

### Workflow & Operations Tools

| Tool | Description |
|---|---|
| `get_workflows` | List all workflows |
| `get_campaigns` | List campaigns |
| `get_users` | List location users |
| `get_user` | Get user by ID |
| `get_forms` | List forms |
| `get_form_submissions` | Get form submissions |
| `get_surveys` | List surveys |
| `get_survey_submissions` | Get survey submissions |

### WindsorAI Analytics Tools

| Tool | Description |
|---|---|
| `windsor_get_ghl_analytics` | Fetch GHL analytics data |
| `windsor_get_cross_platform_data` | Cross-platform analytics |
| `windsor_analyze_pipeline` | Pipeline performance analysis |
| `windsor_contact_insights` | Contact engagement insights |
| `windsor_setup_guide` | Setup instructions (when no API key) |

---

## Troubleshooting

### "GHL_API_KEY environment variable is required"

Make sure you have set the `GHL_API_KEY` in your Claude Desktop config's `env` section.

### "GHL API Error 401: Unauthorized"

Your Private Integration Token may be expired or invalid. Go to GoHighLevel Settings > Private Integrations and rotate your token.

### "GHL API Error 403: Forbidden"

Your token is missing required scopes. Edit your Private Integration and add the necessary scopes.

### Tools not appearing in Claude Desktop

1. Make sure you have restarted Claude Desktop after updating the config.
2. Check that `npx` is available in your system PATH.
3. Look for errors in the Claude Desktop developer console.

### Rate Limiting

GoHighLevel enforces API rate limits. If you encounter 429 errors, wait a moment and try again. The server does not implement automatic retry logic.

---

## Security Best Practices

- **Rotate your token** every 90 days (GoHighLevel provides a 7-day overlap window).
- **Use minimal scopes** — only enable the permissions you actually need.
- **Never share your token** publicly or commit it to version control.
- **Use environment variables** — never hardcode tokens in configuration files that are version-controlled.

---

## Contributing

Contributions are welcome! Please open an issue or pull request on GitHub.

---

## License

MIT License. See [LICENSE](LICENSE) for details.

---

## Links

- [GoHighLevel API Documentation](https://marketplace.gohighlevel.com/docs/)
- [GoHighLevel Official MCP Server](https://marketplace.gohighlevel.com/docs/other/mcp/index.html)
- [WindsorAI GoHighLevel Connector](https://windsor.ai/connect/gohighlevel-to-claude-integration/)
- [Model Context Protocol Specification](https://modelcontextprotocol.io/)
- [Claude Desktop](https://claude.ai/download)
