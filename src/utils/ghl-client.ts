/**
 * GoHighLevel API Client
 * Handles authentication and HTTP requests to the GHL API v2
 * Base URL: https://services.leadconnectorhq.com
 */

import fetch from "node-fetch";

const GHL_BASE_URL = "https://services.leadconnectorhq.com";
const API_VERSION = "2021-07-28";

export interface GHLClientConfig {
  apiKey: string;
  locationId: string;
  baseUrl?: string;
}

export interface GHLRequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  path: string;
  body?: Record<string, unknown>;
  query?: Record<string, string | number | boolean | undefined>;
}

export class GHLClient {
  private apiKey: string;
  private locationId: string;
  private baseUrl: string;

  constructor(config: GHLClientConfig) {
    this.apiKey = config.apiKey;
    this.locationId = config.locationId;
    this.baseUrl = config.baseUrl || GHL_BASE_URL;
  }

  getLocationId(): string {
    return this.locationId;
  }

  async request<T = unknown>(options: GHLRequestOptions): Promise<T> {
    const { method = "GET", path, body, query } = options;

    // Build URL with query parameters
    const url = new URL(`${this.baseUrl}${path}`);
    if (query) {
      for (const [key, value] of Object.entries(query)) {
        if (value !== undefined && value !== null) {
          url.searchParams.set(key, String(value));
        }
      }
    }

    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.apiKey}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      Version: API_VERSION,
    };

    const fetchOptions: Record<string, unknown> = {
      method,
      headers,
    };

    if (body && method !== "GET") {
      fetchOptions.body = JSON.stringify(body);
    }

    const response = await fetch(url.toString(), fetchOptions as any);

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `GHL API Error ${response.status}: ${response.statusText}\n${errorBody}`
      );
    }

    const data = await response.json();
    return data as T;
  }
}

/**
 * GoHighLevel MCP Proxy Client
 * Proxies requests to the official GHL MCP HTTP endpoint
 */
export class GHLMCPProxy {
  private apiKey: string;
  private locationId: string;
  private mcpUrl: string;

  constructor(config: GHLClientConfig) {
    this.apiKey = config.apiKey;
    this.locationId = config.locationId;
    this.mcpUrl = `${config.baseUrl || GHL_BASE_URL}/mcp/`;
  }

  async callTool(
    toolName: string,
    args: Record<string, unknown>
  ): Promise<unknown> {
    const response = await fetch(this.mcpUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
        locationId: this.locationId,
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: Date.now(),
        method: "tools/call",
        params: {
          name: toolName,
          arguments: args,
        },
      }),
    } as any);

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `GHL MCP Error ${response.status}: ${response.statusText}\n${errorBody}`
      );
    }

    const data = await response.json();
    return data;
  }

  async listTools(): Promise<unknown> {
    const response = await fetch(this.mcpUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
        locationId: this.locationId,
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: Date.now(),
        method: "tools/list",
      }),
    } as any);

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `GHL MCP Error ${response.status}: ${response.statusText}\n${errorBody}`
      );
    }

    return response.json();
  }
}

/**
 * WindsorAI Client for analytics data
 */
export class WindsorAIClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.baseUrl = "https://connectors.windsor.ai/all";
  }

  async fetchData(params: {
    source?: string;
    date_preset?: string;
    fields?: string[];
    filter?: string;
  }): Promise<unknown> {
    const url = new URL(this.baseUrl);
    url.searchParams.set("api_key", this.apiKey);
    url.searchParams.set("source", params.source || "gohighlevel");
    if (params.date_preset) {
      url.searchParams.set("date_preset", params.date_preset);
    }
    if (params.fields && params.fields.length > 0) {
      url.searchParams.set("fields", params.fields.join(","));
    }
    if (params.filter) {
      url.searchParams.set("filter", params.filter);
    }

    const response = await fetch(url.toString());

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `WindsorAI Error ${response.status}: ${response.statusText}\n${errorBody}`
      );
    }

    return response.json();
  }
}
