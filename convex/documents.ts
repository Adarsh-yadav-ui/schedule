// convex/documents.ts
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all documents for a user
export const getUserDocuments = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("documents")
      .withIndex("byUserId", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("isArchived"), false))
      .order("desc")
      .collect();
  },
});

// Get saved documents
export const getSavedDocuments = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("documents")
      .withIndex("byUserAndSaved", (q) => 
        q.eq("userId", args.userId).eq("isSaved", true)
      )
      .filter((q) => q.eq(q.field("isArchived"), false))
      .collect();
  },
});

// Get archived documents
export const getArchivedDocuments = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("documents")
      .withIndex("byUserAndArchived", (q) => 
        q.eq("userId", args.userId).eq("isArchived", true)
      )
      .collect();
  },
});

// Get single document by ID
export const getDocument = query({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.documentId);
  },
});

// Search documents by title
export const searchDocuments = query({
  args: { 
    userId: v.id("users"),
    searchTerm: v.string(),
  },
  handler: async (ctx, args) => {
    const documents = await ctx.db
      .query("documents")
      .withIndex("byUserId", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("isArchived"), false))
      .collect();

    return documents.filter(doc => 
      doc.title.toLowerCase().includes(args.searchTerm.toLowerCase()) ||
      doc.description?.toLowerCase().includes(args.searchTerm.toLowerCase())
    );
  },
});

// Create new document
export const createDocument = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    type: v.union(
      v.literal("editor"),
      v.literal("whiteboard"),
      v.literal("editorPlusWhiteboard")
    ),
    userId: v.id("users"),
    data: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    const documentId = await ctx.db.insert("documents", {
      title: args.title,
      description: args.description,
      type: args.type,
      userId: args.userId,
      data: args.data || {},
      isSaved: false,
      isArchived: false,
      createdAt: now,
      updatedAt: now,
    });

    return documentId;
  },
});

// Update document
export const updateDocument = mutation({
  args: {
    documentId: v.id("documents"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    data: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const { documentId, ...updates } = args;
    
    await ctx.db.patch(documentId, {
      ...updates,
      updatedAt: Date.now(),
    });

    return documentId;
  },
});

// Update document data only (for frequent saves)
export const updateDocumentData = mutation({
  args: {
    documentId: v.id("documents"),
    data: v.any(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.documentId, {
      data: args.data,
      updatedAt: Date.now(),
    });

    return args.documentId;
  },
});

// Save/Unsave document
export const toggleSaveDocument = mutation({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    const document = await ctx.db.get(args.documentId);
    if (!document) throw new Error("Document not found");

    await ctx.db.patch(args.documentId, {
      isSaved: !document.isSaved,
      updatedAt: Date.now(),
    });

    return !document.isSaved;
  },
});

// Archive document
export const archiveDocument = mutation({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.documentId, {
      isArchived: true,
      updatedAt: Date.now(),
    });
  },
});

// Restore archived document
export const restoreDocument = mutation({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.documentId, {
      isArchived: false,
      updatedAt: Date.now(),
    });
  },
});

// Delete document permanently
export const deleteDocument = mutation({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    // Delete associated comments
    const comments = await ctx.db
      .query("comments")
      .withIndex("byDocument", (q) => q.eq("documentId", args.documentId))
      .collect();
    
    for (const comment of comments) {
      await ctx.db.delete(comment._id);
    }

    // Delete document-folder associations
    const docFolders = await ctx.db
      .query("documentFolders")
      .withIndex("byDocument", (q) => q.eq("documentId", args.documentId))
      .collect();
    
    for (const df of docFolders) {
      await ctx.db.delete(df._id);
    }

    // Delete the document
    await ctx.db.delete(args.documentId);
  },
});

// Duplicate document
export const duplicateDocument = mutation({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    const document = await ctx.db.get(args.documentId);
    if (!document) throw new Error("Document not found");

    const now = Date.now();
    
    const newDocumentId = await ctx.db.insert("documents", {
      title: `${document.title} (Copy)`,
      description: document.description,
      type: document.type,
      userId: document.userId,
      data: document.data,
      isSaved: false,
      isArchived: false,
      createdAt: now,
      updatedAt: now,
    });

    return newDocumentId;
  },
});