// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.optional(v.string()),
    clerkUserId: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    username: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("byClerkUserId", ["clerkUserId"])
    .index("byEmail", ["email"])
    .index("byUsername", ["username"]),

  documents: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    type: v.union(
      v.literal("editor"),
      v.literal("whiteboard"),
      v.literal("editorPlusWhiteboard")
    ),
    data: v.any(), // Store JSON data for editor/whiteboard content
    userId: v.id("users"),
    isSaved: v.boolean(),
    isArchived: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("byUserId", ["userId"])
    .index("byTitle", ["title"])
    .index("byUserAndSaved", ["userId", "isSaved"])
    .index("byUserAndArchived", ["userId", "isArchived"]),

  comments: defineTable({
    documentId: v.id("documents"),
    userId: v.id("users"),
    content: v.string(),
    position: v.optional(v.object({
      x: v.number(),
      y: v.number(),
    })),
    createdAt: v.number(),
    updatedAt: v.number(),
    isResolved: v.boolean(),
  })
    .index("byDocument", ["documentId"])
    .index("byUser", ["userId"])
    .index("byDocumentAndResolved", ["documentId", "isResolved"]),

  folders: defineTable({
    name: v.string(),
    userId: v.id("users"),
    parentId: v.optional(v.id("folders")),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("byUserId", ["userId"])
    .index("byParentId", ["parentId"]),

  documentFolders: defineTable({
    documentId: v.id("documents"),
    folderId: v.id("folders"),
    addedAt: v.number(),
  })
    .index("byDocument", ["documentId"])
    .index("byFolder", ["folderId"]),
});