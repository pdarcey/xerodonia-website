// /llms.txt: see lib/llms.js
import { llmsTxt } from "../lib/llms.js";

export const data = { permalink: "/llms.txt", eleventyExcludeFromCollections: true };
export const render = (data) => llmsTxt(data);
