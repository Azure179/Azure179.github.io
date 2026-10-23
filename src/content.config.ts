import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import {
  figureSchema,
  studySchema,
  caseStudySchema,
} from "./lib/portfolio-schema";

const httpsUrl = z
  .url()
  .refine((url) => url.startsWith("https://"), "Use a public HTTPS URL.");
const shared = z.object({
  translationKey: z.string().min(1),
  archiveId: z.string().min(1),
  locale: z.enum(["en", "zh"]),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().min(1),
  summary: z.string().min(1),
  draft: z.boolean().default(true),
  verified: z.boolean().default(false),
  visibility: z.enum(["public", "private"]).default("private"),
  revision: z.string().min(1),
  sourceRevision: z.string().optional(),
  updatedAt: z.iso.date().optional(),
  verifiedAt: z.iso.date().optional(),
  evidenceRefs: z.array(z.string().min(1)).default([]),
  tags: z.array(z.string()).default([]),
  role: z.string().optional(),
  contributions: z.array(z.string()).default([]),
  figures: z.array(figureSchema).default([]),
  mediaSlots: z
    .array(
      z.object({
        id: z.string().regex(/^[a-z0-9-]+$/),
        title: z.string().min(1),
        description: z.string().min(1),
      }),
    )
    .default([]),
  links: z
    .array(z.object({ label: z.string().min(1), url: httpsUrl }))
    .default([]),
});

const publishable = (data: z.infer<typeof shared>, ctx: z.RefinementCtx) => {
  if (!data.draft && data.verified && data.visibility === "public") {
    if (!data.verifiedAt || !data.updatedAt || !data.evidenceRefs.length) {
      ctx.addIssue({
        code: "custom",
        message: "Public entries need dates and traceable evidence.",
      });
    }
    if (
      /\[TODO|placeholder|待补充/i.test(
        `${data.title} ${data.summary} ${data.role ?? ""}`,
      )
    ) {
      ctx.addIssue({
        code: "custom",
        message: "Placeholder content cannot be published as a real record.",
      });
    }
  }
};

const research = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/research",
    generateId: ({ entry }) => entry.replace(/\.md$/, ""),
  }),
  schema: shared
    .extend({
      researchStatus: z.enum(["ongoing", "completed", "paused"]).optional(),
      methods: z.array(z.string()).default([]),
      study: studySchema.optional(),
    })
    .superRefine((data, ctx) => {
      publishable(data, ctx);
      if (
        !data.draft &&
        data.verified &&
        data.visibility === "public" &&
        !["outline", "published-review"].includes(data.study?.stage ?? "") &&
        (!data.role || !data.researchStatus || !data.contributions.length)
      ) {
        ctx.addIssue({
          code: "custom",
          message:
            "Public research needs a confirmed role, status and contributions.",
        });
      }
      if (
        data.study?.stage === "outline" &&
        (data.role ||
          data.contributions.length ||
          data.figures.some(
            (figure) => !["diagram", "placeholder"].includes(figure.kind),
          ) ||
          data.researchStatus)
      ) {
        ctx.addIssue({
          code: "custom",
          message:
            "Scope-only outlines cannot assert roles, contributions, research status or result figures; conceptual diagrams and explicit image placeholders are allowed.",
        });
      }
    }),
});
const software = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/software",
    generateId: ({ entry }) => entry.replace(/\.md$/, ""),
  }),
  schema: shared
    .extend({
      projectStatus: z.enum(["prototype", "maintained", "archived"]).optional(),
      stack: z.array(z.string()).default([]),
      caseStudy: caseStudySchema.optional(),
    })
    .superRefine((data, ctx) => {
      publishable(data, ctx);
      if (
        !data.draft &&
        data.verified &&
        data.visibility === "public" &&
        !data.caseStudy &&
        (!data.role || !data.projectStatus || !data.contributions.length)
      ) {
        ctx.addIssue({
          code: "custom",
          message:
            "Public software needs a confirmed role, status and contributions.",
        });
      }
    }),
});
const publications = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/publications",
    generateId: ({ entry }) => entry.replace(/\.md$/, ""),
  }),
  schema: shared
    .extend({
      originalTitle: z.string().optional(),
      authors: z.array(z.string()).default([]),
      publicationStatus: z
        .enum(["preprint", "submitted", "accepted", "published"])
        .optional(),
      venue: z.string().optional(),
      year: z.number().int().optional(),
      citationNote: z.string().optional(),
      doi: z
        .string()
        .regex(/^10\.\d{4,9}\/\S+$/)
        .optional(),
      url: httpsUrl.optional(),
    })
    .superRefine((data, ctx) => {
      publishable(data, ctx);
      if (!data.draft && data.verified && data.visibility === "public") {
        if (
          !data.originalTitle ||
          !data.authors.length ||
          !data.publicationStatus
        ) {
          ctx.addIssue({
            code: "custom",
            message:
              "A publication needs its original title, authors and confirmed status.",
          });
        }
        if (
          ["accepted", "published"].includes(data.publicationStatus ?? "") &&
          (!data.venue || !data.year)
        ) {
          ctx.addIssue({
            code: "custom",
            message: "Accepted/published papers need a venue and year.",
          });
        }
      }
    }),
});
export const collections = { research, software, publications };
