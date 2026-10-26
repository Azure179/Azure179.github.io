import type { Locale } from "../lib/routes";

interface Profile {
  displayName: string | null;
  verified: boolean;
  biography: Record<Locale, string> | null;
  email: string | null;
  cvPath: string | null;
  professionalResumePath: string | null;
  education: Record<Locale, string> | null;
  researchInterests: Record<Locale, string> | null;
  technicalSkills: Record<Locale, string> | null;
  githubUrl: string;
  scholarUrl: string | null;
}

// Unknown personal facts remain null. UI labels are explicit placeholders.
export const profile: Profile = {
  displayName: null,
  verified: false,
  biography: null,
  email: "duanbw.sz@qq.com",
  cvPath: null,
  professionalResumePath: null,
  education: null,
  researchInterests: null,
  technicalSkills: null,
  githubUrl: "https://github.com/Azure179",
  scholarUrl: null,
};
