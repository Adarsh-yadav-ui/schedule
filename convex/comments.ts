// convex/comments.ts
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get document comments
export const getDocumentComments = query({
  args: { 
    documentId: v.id("documents"),
    includeResolved: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("comments")
      .withIndex("byDocument", (q) => q.eq("documentId", args.documentId));

    if (!args.includeResolved) {
      query = query.filter((q) => q.eq(q.field("isResolved"), false));
    }

    const comments = await query.order("desc").collect();

    // Fetch user details for each comment
    const commentsWithUsers = await Promise.all(
      comments.map(async (comment) => {
        const user = await ctx.db.get(comment.userId);
        return { ...comment, user };
      })
    );

    return commentsWithUsers;
  },
});

// Get user's comments across all documents
export const getUserComments = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("comments")
      .withIndex("byUser", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

// Get single comment
export const getComment = query({
  args: { commentId: v.id("comments") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.commentId);
  },
});

// Create comment
export const createComment = mutation({
  args: {
    documentId: v.id("documents"),
    userId: v.id("users"),
    content: v.string(),
    position: v.optional(v.object({
      x: v.number(),
      y: v.number(),
    })),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    return await ctx.db.insert("comments", {
      documentId: args.documentId,
      userId: args.userId,
      content: args.content,
      position: args.position,
      createdAt: now,
      updatedAt: now,
      isResolved: false,
    });
  },
});

// Update comment
export const updateComment = mutation({
  args: {
    commentId: v.id("comments"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.commentId, {
      content: args.content,
      updatedAt: Date.now(),
    });

    return args.commentId;
  },
});

// Resolve comment
export const resolveComment = mutation({
  args: { commentId: v.id("comments") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.commentId, {
      isResolved: true,
      updatedAt: Date.now(),
    });
  },
});

// Unresolve comment
export const unresolveComment = mutation({
  args: { commentId: v.id("comments") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.commentId, {
      isResolved: false,
      updatedAt: Date.now(),
    });
  },
});

// Delete comment
export const deleteComment = mutation({
  args: { commentId: v.id("comments") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.commentId);
  },
});

// Delete all comments for a document
export const deleteDocumentComments = mutation({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    const comments = await ctx.db
      .query("comments")
      .withIndex("byDocument", (q) => q.eq("documentId", args.documentId))
      .collect();

    for (const comment of comments) {
      await ctx.db.delete(comment._id);
    }
  },
});