"use client";

import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";


import { apiVersion, dataset, projectId } from "./sanity/env";
import { schema } from "./sanity/schemaTypes";
import { markdownSchema } from "sanity-plugin-markdown";

export default defineConfig({
  basePath: "/studio",
  projectId,
  dataset,
  schema,
  plugins: [
    visionTool({ defaultApiVersion: apiVersion }),
    markdownSchema(),
  ],
});