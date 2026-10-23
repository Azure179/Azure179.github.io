---
{
  "translationKey": "fish-t2t-genome",
  "archiveId": "A2-01",
  "locale": "zh",
  "slug": "fish-t2t-genome",
  "title": "高体鰤高质量参考基因组资源",
  "summary": "雌雄两套基因组为高体鰤功能注释、比较基因组及后续研究提供参考资源。正式论文报告了来自一尾雌鱼和一尾雄鱼的端粒到端粒组装。",
  "draft": false,
  "verified": true,
  "visibility": "public",
  "revision": "release-v1",
  "sourceRevision": "release-v1",
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
          "雌雄两套基因组为高体鰤功能注释、比较基因组及后续研究提供参考资源。正式论文报告了来自一尾雌鱼和一尾雄鱼的端粒到端粒组装。",
        ],
      "background":
        [
          "碎片化组装会限制重复区域和基因邻域的分析。互补测序技术用于提高连续性，独立评价用于检验碱基准确性与基因完整性。",
        ],
      "design":
        [
          "结合 PacBio HiFi、超长 Oxford Nanopore、短读长与 Hi-C，分别构建一个雌性和一个雄性个体的参考基因组。",
        ],
      "analysis":
        [
          "利用 hifiasm 与 Verkko 进行 HiFi / ONT 组装，随后整合、挂载、补洞和抛光；Hi-C / HapHiC 支持染色体组织。",
          "通过连续性和完整性评价，结合重复序列注释、基因预测及功能注释形成参考资源。公开 BioProject 为 PRJCA047743 与 PRJNA1443653，注释文件通过 Figshare 提供。",
        ],
      "findings":
        [
          {
            "status": "published",
            "text": "雌雄组装均包含 24 条染色体，大小分别约为 685.5 Mb 和 683.2 Mb；基因组 BUSCO 完整度分别为 99.4% 和 99.3%。",
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
        "src": "/media/diagrams/fish-t2t-genome-workflow-zh.svg",
        "title": "分析工作流程",
        "alt": "高体鰤参考基因组构建。雌雄个体 → 互补测序数据 → 组装与精修 → 染色体组织 → 质量评价与注释 → 可复用参考资源",
        "caption": "概念与流程示意",
        "source": "https://doi.org/10.1038/s41597-026-07505-8",
        "permission": "为本作品集原创绘制",
        "kind": "diagram",
        "placement": "analysis",
        "width": 1000,
        "height": 790,
      },
      {
        "id": "figure-1",
        "src": "/media/research/fish-t2t-genome/Fig 1.png",
        "title": "基因组特征概览",
        "alt": "基因组特征概览",
        "caption": "已发表科研图片",
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
        "title": "染色体与端粒",
        "alt": "染色体与端粒",
        "caption": "已发表科研图片",
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
