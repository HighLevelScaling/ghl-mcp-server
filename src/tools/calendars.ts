/**
 * GoHighLevel Calendar & Appointment Tools
 * Calendar management, events, appointments, and scheduling
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { GHLClient } from "../utils/ghl-client.js";

export function registerCalendarTools(server: McpServer, client: GHLClient) {
  const locationId = client.getLocationId();

  // ─── Calendars ───────────────────────────────────────────────────────

  server.tool(
    "get_calendars",
    "Get all calendars for the location in GoHighLevel.",
    {},
    async () => {
      try {
        const result = await client.request({
          method: "GET",
          path: "/calendars/",
          query: { locationId },
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text" as const, text: `Error: ${error.message}` }], isError: true };
      }
    }
  );

  server.tool(
    "get_calendar",
    "Get a specific calendar by ID.",
    {
      calendarId: z.string().describe("The calendar ID"),
    },
    async ({ calendarId }) => {
      try {
        const result = await client.request({
          method: "GET",
          path: `/calendars/${calendarId}`,
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text" as const, text: `Error: ${error.message}` }], isError: true };
      }
    }
  );

  server.tool(
    "get_calendar_free_slots",
    "Get available free slots for a calendar. Useful for booking appointments.",
    {
      calendarId: z.string().describe("The calendar ID"),
      startDate: z.string().describe("Start date (YYYY-MM-DD or epoch ms)"),
      endDate: z.string().describe("End date (YYYY-MM-DD or epoch ms)"),
      timezone: z.string().optional().describe("Timezone (e.g., America/New_York)"),
    },
    async ({ calendarId, startDate, endDate, timezone }) => {
      try {
        const result = await client.request({
          method: "GET",
          path: `/calendars/${calendarId}/free-slots`,
          query: { startDate, endDate, timezone },
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text" as const, text: `Error: ${error.message}` }], isError: true };
      }
    }
  );

  // ─── Calendar Events ─────────────────────────────────────────────────

  server.tool(
    "get_calendar_events",
    "Get calendar events. Requires at least one of: userId, groupId, or calendarId.",
    {
      calendarId: z.string().optional().describe("Calendar ID"),
      startTime: z.string().describe("Start time (epoch ms)"),
      endTime: z.string().describe("End time (epoch ms)"),
      userId: z.string().optional().describe("User ID to filter events"),
      groupId: z.string().optional().describe("Group ID to filter events"),
    },
    async ({ calendarId, startTime, endTime, userId, groupId }) => {
      try {
        const result = await client.request({
          method: "GET",
          path: "/calendars/events",
          query: {
            locationId,
            calendarId,
            startTime,
            endTime,
            userId,
            groupId,
          },
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text" as const, text: `Error: ${error.message}` }], isError: true };
      }
    }
  );

  // ─── Appointments ────────────────────────────────────────────────────

  server.tool(
    "get_appointment",
    "Get a specific appointment by ID.",
    {
      eventId: z.string().describe("The appointment/event ID"),
    },
    async ({ eventId }) => {
      try {
        const result = await client.request({
          method: "GET",
          path: `/calendars/events/appointments/${eventId}`,
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text" as const, text: `Error: ${error.message}` }], isError: true };
      }
    }
  );

  server.tool(
    "create_appointment",
    "Create a new appointment in GoHighLevel.",
    {
      calendarId: z.string().describe("The calendar ID"),
      contactId: z.string().describe("The contact ID"),
      startTime: z.string().describe("Start time (ISO 8601 format)"),
      endTime: z.string().describe("End time (ISO 8601 format)"),
      title: z.string().optional().describe("Appointment title"),
      appointmentStatus: z.enum(["confirmed", "new", "showed", "noshow", "cancelled", "invalid"]).optional().describe("Appointment status"),
      assignedUserId: z.string().optional().describe("Assigned user ID"),
      address: z.string().optional().describe("Appointment address"),
      notes: z.string().optional().describe("Appointment notes"),
    },
    async (params) => {
      try {
        const result = await client.request({
          method: "POST",
          path: "/calendars/events/appointments",
          body: { ...params, locationId },
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text" as const, text: `Error: ${error.message}` }], isError: true };
      }
    }
  );

  server.tool(
    "update_appointment",
    "Update an existing appointment in GoHighLevel.",
    {
      eventId: z.string().describe("The appointment/event ID to update"),
      calendarId: z.string().optional().describe("The calendar ID"),
      startTime: z.string().optional().describe("Start time (ISO 8601 format)"),
      endTime: z.string().optional().describe("End time (ISO 8601 format)"),
      title: z.string().optional().describe("Appointment title"),
      appointmentStatus: z.enum(["confirmed", "new", "showed", "noshow", "cancelled", "invalid"]).optional().describe("Appointment status"),
      assignedUserId: z.string().optional().describe("Assigned user ID"),
      address: z.string().optional().describe("Appointment address"),
      notes: z.string().optional().describe("Appointment notes"),
    },
    async ({ eventId, ...params }) => {
      try {
        const result = await client.request({
          method: "PUT",
          path: `/calendars/events/appointments/${eventId}`,
          body: params,
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text" as const, text: `Error: ${error.message}` }], isError: true };
      }
    }
  );

  server.tool(
    "delete_appointment",
    "Delete/cancel an appointment in GoHighLevel.",
    {
      eventId: z.string().describe("The appointment/event ID to delete"),
    },
    async ({ eventId }) => {
      try {
        const result = await client.request({
          method: "DELETE",
          path: `/calendars/events/appointments/${eventId}`,
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text" as const, text: `Error: ${error.message}` }], isError: true };
      }
    }
  );

  server.tool(
    "get_appointment_notes",
    "Get notes for a specific appointment.",
    {
      eventId: z.string().describe("The appointment/event ID"),
    },
    async ({ eventId }) => {
      try {
        const result = await client.request({
          method: "GET",
          path: `/calendars/events/appointments/${eventId}/notes`,
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text" as const, text: `Error: ${error.message}` }], isError: true };
      }
    }
  );

  // ─── Block Slots ─────────────────────────────────────────────────────

  server.tool(
    "create_block_slot",
    "Create a blocked time slot on a calendar.",
    {
      calendarId: z.string().describe("The calendar ID"),
      startTime: z.string().describe("Start time (ISO 8601 format)"),
      endTime: z.string().describe("End time (ISO 8601 format)"),
      title: z.string().optional().describe("Block slot title"),
      assignedUserId: z.string().optional().describe("Assigned user ID"),
    },
    async (params) => {
      try {
        const result = await client.request({
          method: "POST",
          path: "/calendars/events/block-slots",
          body: { ...params, locationId },
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text" as const, text: `Error: ${error.message}` }], isError: true };
      }
    }
  );
}
