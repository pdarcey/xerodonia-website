// /llms-full.txt: see lib/llms.js
import { llmsFullTxt } from "../lib/llms.js";

export const data = { permalink: "/llms-full.txt", eleventyExcludeFromCollections: true };
export const render = (data) => llmsFullTxt(data);
