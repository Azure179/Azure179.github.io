import { z } from "astro/zod";

const text = z.array(z.string().min(1)).min(1);
export const figureSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  src: z
    .string()
    .regex(
      /^\/media\/(?:research|software|diagrams)\/[a-zA-Z0-9/_. -]+\.(?:svg|png|webp|jpg)$/,
    )
    .refine((value) => !value.includes("..")),
  title: z.string().min(1),
  alt: z.string().min(1),
  caption: z.string().min(1),
  source: z.string().min(1),
  sourceUrl: z
    .url()
    .refine((url) => url.startsWith("https://"))
    .optional(),
  permission: z.string().min(1),
  kind: z.enum(["research-result", "screenshot", "diagram", "placeholder"]),
  placement: z
    .enum(["overview", "analysis", "architecture", "implementation", "figures"])
    .default("figures"),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});
export const studySchema = z
  .object({
    stage: z.enum(["outline", "published-review", "verified-study"]),
    area: z.enum(["A1", "A2", "A3"]),
    species: z.string().optional(),
    overview: text,
    background: text,
    design: text,
    analysis: text,
    findings: z
      .array(
        z.object({
          status: z.enum(["published", "unpublished", "hypothesis"]),
          text: z.string().min(1),
          evidenceRefs: text,
        }),
      )
      .default([]),
    publicationIds: z.array(z.string().min(1)).default([]),
  })
  .superRefine((study, ctx) => {
    if (
      study.stage === "published-review" &&
      (!study.publicationIds.length ||
        !study.findings.length ||
        study.findings.some((finding) => finding.status !== "published"))
    )
      ctx.addIssue({
        code: "custom",
        message:
          "A published review requires linked publications and exclusively published findings.",
      });
    if (
      study.stage === "outline" &&
      (study.findings.length || study.publicationIds.length)
    )
      ctx.addIssue({
        code: "custom",
        message:
          "An outline cannot claim findings or publications; verify the study first.",
      });
  });
export const caseStudySchema = z.object({
  stage: z.enum(["source-review", "local-development"]),
  overview: text,
  solution: text,
  architecture: text,
  implementation: text,
  workflow: text,
  workflowSource: z.string().min(1),
  validation: text,
  galleryNote: z.string().min(1),
});
