// Defaults for every post in src/blog/. A new post only needs
// title, description and date in its front matter.
export default {
  layout: "layouts/post.njk",
  tags: ["posts"],
  pageType: "post",
  permalink: "/blog/{{ page.fileSlug }}/",
};
