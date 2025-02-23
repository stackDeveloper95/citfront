import { query } from "./_generated/server";
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("project").collect();
  },
});


export const getByFileId = query({
  args: {
    fileId: v.string(), // Validate fileId as a string
  },
  handler: async (ctx,args) => {
    // Log the arguments to debug
   
    return await ctx.db.query("project").filter((q) => q.eq(q.field("fileId"), args.fileId)).collect();
  },
});



export const createTask = mutation({
    args: {   projectName: v.string(),
        desc: v.string(),
        images:v.string(),
        pdf:v.string(),
        type:v.string(),
        fileId:v.string(),
        no1:v.string(),
        no2:v.string(),
        no3:v.string(),
        no4:v.string(),
        department:v.string() 
      },
    handler: async (ctx, args) => {
      const taskId = await ctx.db.insert("project", { projectName: args.projectName,
        desc: args.desc,
        images: args.images,
        pdf: args.pdf,
        type: args.type,
        fileId:args.fileId,
        no1: args.desc,
        no2: args.no2,
        no3: args.no3,
        no4: args.no4,
        department:args.department});
      // do something with `taskId`
    },
  });

  

 