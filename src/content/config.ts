// 1. Import utilities from `astro:content`
import { z, defineCollection } from 'astro:content';

const pages = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    heroImage: z.string().optional(),   // optional hero image on home
    navLabel: z.string().optional(),    // optional label for navbar
    order: z.number().optional(),       // optional sort for nav
  }),
});

export const collections = { pages };

/*
// 2. Define your collection(s)
const blogCollection = defineCollection({
  schema: z.object({
    draft: z.boolean(),
    title: z.string(),
    snippet: z.string(),
    image: z.object({
      src: z.string(),
      alt: z.string(),
    }),
    publishDate: z.string().transform(str => new Date(str)),
    author: z.string().default('Astroship'),
    category: z.string(),
    tags: z.array(z.string()),
  }),
});

const teamCollection = defineCollection({
  schema: z.object({
    draft: z.boolean(),
    name: z.string(),
    title: z.string(),
    avatar: z.object({
      src: z.string(),
      alt: z.string(),
    }),
    publishDate: z.string().transform(str => new Date(str)),
  }),
});
*/

// 3. Export a single `collections` object to register your collection(s)
//    This key should match your collection directory name in "src/content"
/*
export const collections = {
  'blog': blogCollection,
  'team': teamCollection,
};
*/