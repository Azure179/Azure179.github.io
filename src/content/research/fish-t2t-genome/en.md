---
{
  "translationKey": "fish-t2t-genome",
  "archiveId": "A2-01",
  "locale": "en",
  "slug": "fish-t2t-genome",
  "title": "Reference-Quality Genome Resources for Greater Amberjack",
  "summary": "Two sex-labelled genome assemblies provide a foundation for annotation, comparative genomics and future studies in greater amberjack. The published resource reports telomere-to-telomere assemblies from one female and one male.",
  "draft": false,
  "verified": true,
  "visibility": "public",
  "revision": "release-v1",
  "updatedAt": "2026-10-23",
  "verifiedAt": "2026-10-23",
  "evidenceRefs":
    [
      "https://doi.org/10.1038/s41597-026-07505-8",
      "docs/CONTENT_SOURCE_REGISTER.md",
    ],
  "tags": ["Genome assembly", "T2T", "Comparative genomics"],
  "study":
    {
      "stage": "published-review",
      "area": "A2",
      "overview":
        [
          "Two sex-labelled genome assemblies provide a foundation for annotation, comparative genomics and future studies in greater amberjack. The published resource reports telomere-to-telomere assemblies from one female and one male.",
        ],
      "background":
        [
          "Fragmented assemblies can obscure repeat-rich regions and gene neighborhoods. Combining complementary sequencing technologies improves continuity while independent checks assess base accuracy and gene completeness.",
        ],
      "design":
        [
          "One female and one male were assembled using PacBio HiFi, ultra-long Oxford Nanopore, short reads and Hi-C, providing two individual reference genomes.",
        ],
      "analysis":
        [
          "HiFi / ONT assembly with hifiasm and Verkko is followed by assembly integration, scaffolding, gap closure and polishing. Hi-C / HapHiC supports chromosome organization.",
          "The workflow combines continuity and completeness checks with repeat annotation, gene prediction and functional annotation. Published accessions include BioProjects PRJCA047743 and PRJNA1443653; annotation files are linked through Figshare.",
        ],
      "findings":
        [
          {
            "status": "published",
            "text": "The assemblies each contain 24 chromosomes: approximately 685.5 Mb in the female and 683.2 Mb in the male, with genome BUSCO completeness of 99.4% and 99.3%, respectively.",
            "evidenceRefs": ["https://doi.org/10.1038/s41597-026-07505-8"],
          },
        ],
      "publicationIds": ["amberjack-t2t"],
      "species": "Seriola dumerili",
    },
  "figures":
    [
      {
        "id": "fish-t2t-genome-workflow",
        "src": "/media/diagrams/fish-t2t-genome-workflow.svg",
        "title": "Analysis workflow",
        "alt": "Female + male specimens → Complementary reads → Assembly and refinement → Chromosome organization → Quality and annotation → Reusable reference resources",
        "caption": "Concept & workflow",
        "source": "https://doi.org/10.1038/s41597-026-07505-8",
        "permission": "Original artwork created for this portfolio",
        "kind": "diagram",
        "placement": "analysis",
        "width": 1000,
        "height": 790,
      },
      {
        "id": "figure-1",
        "src": "/media/research/fish-t2t-genome/Fig 1.png",
        "title": "Genome landscape",
        "alt": "Genome landscape",
        "caption": "Published research figure",
        "source": "Owner-provided PNG, 23 October 2026",
        "permission": "Provided by the site owner for inclusion in this portfolio; no additional reuse license granted.",
        "kind": "research-result",
        "placement": "figures",
        "width": 969,
        "height": 486,
        "sourceUrl": "https://doi.org/10.1038/s41597-026-07505-8",
      },
      {
        "id": "figure-2",
        "src": "/media/research/fish-t2t-genome/Fig 2.png",
        "title": "Chromosomes and telomeres",
        "alt": "Chromosomes and telomeres",
        "caption": "Published research figure",
        "source": "Owner-provided PNG, 23 October 2026",
        "permission": "Provided by the site owner for inclusion in this portfolio; no additional reuse license granted.",
        "kind": "research-result",
        "placement": "figures",
        "width": 1450,
        "height": 661,
        "sourceUrl": "https://doi.org/10.1038/s41597-026-07505-8",
      },
    ],
  "links":
    [
      {
        "label": "Published annotation files · Figshare",
        "url": "https://doi.org/10.6084/m9.figshare.30334594.v1",
      },
    ],
  "mediaSlots": [],
}
---
