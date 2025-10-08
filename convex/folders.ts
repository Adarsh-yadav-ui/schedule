// convex/folders.ts
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get user folders
export const getUserFolders = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("folders")
      .withIndex("byUserId", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

// Get root folders (no parent)
export const getRootFolders = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const allFolders = await ctx.db
      .query("folders")
      .withIndex("byUserId", (q) => q.eq("userId", args.userId))
      .collect();

    return allFolders.filter(folder => !folder.parentId);
  },
});

// Get subfolders of a parent folder
export const getSubfolders = query({
  args: { parentId: v.id("folders") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("folders")
      .withIndex("byParentId", (q) => q.eq("parentId", args.parentId))
      .collect();
  },
});

// Get single folder
export const getFolder = query({
  args: { folderId: v.id("folders") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.folderId);
  },
});

// Create folder
export const createFolder = mutation({
  args: {
    name: v.string(),
    userId: v.id("users"),
    parentId: v.optional(v.id("folders")),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    return await ctx.db.insert("folders", {
      name: args.name,
      userId: args.userId,
      parentId: args.parentId,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update folder
export const updateFolder = mutation({
  args: {
    folderId: v.id("folders"),
    name: v.optional(v.string()),
    parentId: v.optional(v.id("folders")),
  },
  handler: async (ctx, args) => {
    const { folderId, ...updates } = args;
    
    await ctx.db.patch(folderId, {
      ...updates,
      updatedAt: Date.now(),
    });

    return folderId;
  },
});

// Delete folder
export const deleteFolder = mutation({
  args: { folderId: v.id("folders") },
  handler: async (ctx, args) => {
    // Delete all document-folder associations
    const docFolders = await ctx.db
      .query("documentFolders")
      .withIndex("byFolder", (q) => q.eq("folderId", args.folderId))
      .collect();
    
    for (const df of docFolders) {
      await ctx.db.delete(df._id);
    }

    // Delete all subfolders recursively
    const subfolders = await ctx.db
      .query("folders")
      .withIndex("byParentId", (q) => q.eq("parentId", args.folderId))
      .collect();
    
    for (const subfolder of subfolders) {
      await ctx.db.delete(subfolder._id);
    }

    // Delete the folder
    await ctx.db.delete(args.folderId);
  },
});

// Get documents in folder
export const getFolderDocuments = query({
  args: { folderId: v.id("folders") },
  handler: async (ctx, args) => {
    const docFolders = await ctx.db
      .query("documentFolders")
      .withIndex("byFolder", (q) => q.eq("folderId", args.folderId))
      .collect();

    const documents = await Promise.all(
      docFolders.map(async (df) => await ctx.db.get(df.documentId))
    );

    return documents.filter(Boolean);
  },
});

// Add document to folder
export const addDocumentToFolder = mutation({
  args: {
    documentId: v.id("documents"),
    folderId: v.id("folders"),
  },
  handler: async (ctx, args) => {
    // Check if already exists
    const existing = await ctx.db
      .query("documentFolders")
      .withIndex("byDocument", (q) => q.eq("documentId", args.documentId))
      .filter((q) => q.eq(q.field("folderId"), args.folderId))
      .first();

    if (existing) {
      throw new Error("Document already in this folder");
    }

    return await ctx.db.insert("documentFolders", {
      documentId: args.documentId,
      folderId: args.folderId,
      addedAt: Date.now(),
    });
  },
});

// Remove document from folder
export const removeDocumentFromFolder = mutation({
  args: {
    documentId: v.id("documents"),
    folderId: v.id("folders"),
  },
  handler: async (ctx, args) => {
    const docFolder = await ctx.db
      .query("documentFolders")
      .withIndex("byDocument", (q) => q.eq("documentId", args.documentId))
      .filter((q) => q.eq(q.field("folderId"), args.folderId))
      .first();

    if (docFolder) {
      await ctx.db.delete(docFolder._id);
    }
  },
});

// Get all folders containing a document
export const getDocumentFolders = query({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    const docFolders = await ctx.db
      .query("documentFolders")
      .withIndex("byDocument", (q) => q.eq("documentId", args.documentId))
      .collect();

    const folders = await Promise.all(
      docFolders.map(async (df) => await ctx.db.get(df.folderId))
    );

    return folders.filter(Boolean);
  },
});

// Move document to different folder
export const moveDocumentToFolder = mutation({
  args: {
    documentId: v.id("documents"),
    fromFolderId: v.id("folders"),
    toFolderId: v.id("folders"),
  },
  handler: async (ctx, args) => {
    // Remove from old folder
    const oldDocFolder = await ctx.db
      .query("documentFolders")
      .withIndex("byDocument", (q) => q.eq("documentId", args.documentId))
      .filter((q) => q.eq(q.field("folderId"), args.fromFolderId))
      .first();

    if (oldDocFolder) {
      await ctx.db.delete(oldDocFolder._id);
    }

    // Add to new folder
    return await ctx.db.insert("documentFolders", {
      documentId: args.documentId,
      folderId: args.toFolderId,
      addedAt: Date.now(),
    });
  },
});