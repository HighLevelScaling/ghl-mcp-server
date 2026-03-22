/**
 * GoHighLevel Social Media & Blog Tools
 * Social media posting, blog management, and content creation
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { GHLClient } from "../utils/ghl-client.js";

export function registerSocialMediaTools(server: McpServer, client: GHLClient) {
  const locationId = client.getLocationId();

  // ─── Social Media Accounts ───────────────────────────────────────────

  server.tool(
    "get_social_media_accounts",
    "Get connected social media accounts for the location.",
    {},
    async () => {
      try {
        const result = await client.request({
          method: "GET",
          path: "/social-media-posting/oauth/accounts",
          query: { locationId },
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text" as const, text: `Error: ${error.message}` }], isError: true };
      }
    }
  );

  server.tool(
    "get_social_media_statistics",
    "Get analytics/statistics for social media accounts.",
    {
      accountIds: z.array(z.string()).describe("Social media account IDs"),
      startDate: z.string().optional().describe("Start date (YYYY-MM-DD)"),
      endDate: z.string().optional().describe("End date (YYYY-MM-DD)"),
    },
    async ({ accountIds, startDate, endDate }) => {
      try {
        const result = await client.request({
          method: "GET",
          path: "/social-media-posting/oauth/statistics",
          query: {
            locationId,
            accountIds: accountIds.join(","),
            startDate,
            endDate,
          },
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text" as const, text: `Error: ${error.message}` }], isError: true };
      }
    }
  );

  // ─── Social Media Posts ──────────────────────────────────────────────

  server.tool(
    "get_social_media_posts",
    "Get social media posts for the location.",
    {
      accountIds: z.array(z.string()).optional().describe("Filter by account IDs"),
      type: z.enum(["post", "story", "reel"]).optional().describe("Post type filter"),
      limit: z.number().optional().default(20).describe("Number of results"),
      skip: z.number().optional().default(0).describe("Pagination offset"),
    },
    async ({ accountIds, type, limit, skip }) => {
      try {
        const result = await client.request({
          method: "GET",
          path: "/social-media-posting/post/",
          query: {
            locationId,
            accountIds: accountIds?.join(","),
            type,
            limit,
            skip,
          },
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text" as const, text: `Error: ${error.message}` }], isError: true };
      }
    }
  );

  server.tool(
    "get_social_media_post",
    "Get a specific social media post by ID.",
    {
      postId: z.string().describe("The post ID"),
    },
    async ({ postId }) => {
      try {
        const result = await client.request({
          method: "GET",
          path: `/social-media-posting/post/${postId}`,
          query: { locationId },
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text" as const, text: `Error: ${error.message}` }], isError: true };
      }
    }
  );

  server.tool(
    "create_social_media_post",
    "Create a new social media post across platforms.",
    {
      accountIds: z.array(z.string()).describe("Social media account IDs to post to"),
      summary: z.string().describe("Post content/caption"),
      mediaUrls: z.array(z.string()).optional().describe("Media URLs to attach"),
      scheduledAt: z.string().optional().describe("Schedule time (ISO 8601). Leave empty for immediate post."),
      type: z.enum(["post", "story", "reel"]).optional().default("post").describe("Post type"),
    },
    async (params) => {
      try {
        const result = await client.request({
          method: "POST",
          path: "/social-media-posting/post/",
          body: { ...params, locationId },
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text" as const, text: `Error: ${error.message}` }], isError: true };
      }
    }
  );

  server.tool(
    "update_social_media_post",
    "Update an existing social media post.",
    {
      postId: z.string().describe("The post ID to update"),
      summary: z.string().optional().describe("Updated post content"),
      mediaUrls: z.array(z.string()).optional().describe("Updated media URLs"),
      scheduledAt: z.string().optional().describe("Updated schedule time"),
    },
    async ({ postId, ...params }) => {
      try {
        const result = await client.request({
          method: "PUT",
          path: `/social-media-posting/post/${postId}`,
          body: { ...params, locationId },
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text" as const, text: `Error: ${error.message}` }], isError: true };
      }
    }
  );

  server.tool(
    "delete_social_media_post",
    "Delete a social media post.",
    {
      postId: z.string().describe("The post ID to delete"),
    },
    async ({ postId }) => {
      try {
        const result = await client.request({
          method: "DELETE",
          path: `/social-media-posting/post/${postId}`,
          query: { locationId },
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text" as const, text: `Error: ${error.message}` }], isError: true };
      }
    }
  );

  // ─── Blogs ───────────────────────────────────────────────────────────

  server.tool(
    "get_blogs",
    "Get all blog sites for the location.",
    {},
    async () => {
      try {
        const result = await client.request({
          method: "GET",
          path: "/blogs/",
          query: { locationId },
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text" as const, text: `Error: ${error.message}` }], isError: true };
      }
    }
  );

  server.tool(
    "get_blog_posts",
    "Get blog posts for a specific blog site.",
    {
      blogId: z.string().describe("The blog site ID"),
      limit: z.number().optional().default(20).describe("Number of results"),
      offset: z.number().optional().default(0).describe("Pagination offset"),
    },
    async ({ blogId, limit, offset }) => {
      try {
        const result = await client.request({
          method: "GET",
          path: `/blogs/${blogId}/posts`,
          query: { locationId, limit, offset },
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text" as const, text: `Error: ${error.message}` }], isError: true };
      }
    }
  );

  server.tool(
    "create_blog_post",
    "Create a new blog post in GoHighLevel.",
    {
      blogId: z.string().describe("The blog site ID"),
      title: z.string().describe("Blog post title"),
      content: z.string().describe("Blog post HTML content"),
      slug: z.string().describe("URL slug for the post"),
      status: z.enum(["draft", "published"]).optional().default("draft").describe("Post status"),
      categoryId: z.string().optional().describe("Category ID"),
      authorId: z.string().optional().describe("Author ID"),
      imageUrl: z.string().optional().describe("Featured image URL"),
      metaTitle: z.string().optional().describe("SEO meta title"),
      metaDescription: z.string().optional().describe("SEO meta description"),
      tags: z.array(z.string()).optional().describe("Post tags"),
    },
    async ({ blogId, ...params }) => {
      try {
        const result = await client.request({
          method: "POST",
          path: `/blogs/${blogId}/posts`,
          body: { ...params, locationId },
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text" as const, text: `Error: ${error.message}` }], isError: true };
      }
    }
  );

  server.tool(
    "update_blog_post",
    "Update an existing blog post.",
    {
      blogId: z.string().describe("The blog site ID"),
      postId: z.string().describe("The post ID to update"),
      title: z.string().optional().describe("Blog post title"),
      content: z.string().optional().describe("Blog post HTML content"),
      slug: z.string().optional().describe("URL slug"),
      status: z.enum(["draft", "published"]).optional().describe("Post status"),
      categoryId: z.string().optional().describe("Category ID"),
      imageUrl: z.string().optional().describe("Featured image URL"),
      metaTitle: z.string().optional().describe("SEO meta title"),
      metaDescription: z.string().optional().describe("SEO meta description"),
    },
    async ({ blogId, postId, ...params }) => {
      try {
        const result = await client.request({
          method: "PUT",
          path: `/blogs/${blogId}/posts/${postId}`,
          body: { ...params, locationId },
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text" as const, text: `Error: ${error.message}` }], isError: true };
      }
    }
  );

  server.tool(
    "check_blog_slug",
    "Check if a blog URL slug is available.",
    {
      blogId: z.string().describe("The blog site ID"),
      slug: z.string().describe("URL slug to check"),
    },
    async ({ blogId, slug }) => {
      try {
        const result = await client.request({
          method: "GET",
          path: `/blogs/${blogId}/posts/url-slug-exists`,
          query: { locationId, urlSlug: slug },
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text" as const, text: `Error: ${error.message}` }], isError: true };
      }
    }
  );

  server.tool(
    "get_blog_categories",
    "Get all blog categories for the location.",
    {},
    async () => {
      try {
        const result = await client.request({
          method: "GET",
          path: "/blogs/categories",
          query: { locationId },
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text" as const, text: `Error: ${error.message}` }], isError: true };
      }
    }
  );

  server.tool(
    "get_blog_authors",
    "Get all blog authors for the location.",
    {},
    async () => {
      try {
        const result = await client.request({
          method: "GET",
          path: "/blogs/authors",
          query: { locationId },
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text" as const, text: `Error: ${error.message}` }], isError: true };
      }
    }
  );
}
