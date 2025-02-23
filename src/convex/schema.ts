import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  project: defineTable({
    projectName: v.string(),
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
  }),
  documents: defineTable({
    embedding: v.array(v.number()),
    text: v.string(),
    metadata: v.any(),
  }).vectorIndex("byEmbedding", {
    vectorField: "embedding",
    dimensions: 768,
  }),
  
});