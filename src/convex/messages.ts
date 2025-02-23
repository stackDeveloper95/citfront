import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const generateUploadUrl = mutation(async ({ storage }) => {
  const url = await storage.generateUploadUrl();
  return url;
});


export const getUrl = mutation({
    args: {   
      storageId:v.string()
     },
    handler: async (ctx, args) => {
      const url=await ctx.storage.getUrl(args.storageId)
      return url;
      // do something with `taskId`
    },
  });