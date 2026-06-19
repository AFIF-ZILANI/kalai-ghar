# Graph Report - .  (2026-06-17)

## Corpus Check
- Corpus is ~7,189 words - fits in a single context window. You may not need a graph.

## Summary
- 357 nodes · 397 edges · 34 communities (28 shown, 6 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 30 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_App Pages & SEO|App Pages & SEO]]
- [[_COMMUNITY_Bilingual i18n Routing|Bilingual i18n Routing]]
- [[_COMMUNITY_Package Dependencies|Package Dependencies]]
- [[_COMMUNITY_TypeScript Configuration|TypeScript Configuration]]
- [[_COMMUNITY_Bengali Reserve Translations|Bengali Reserve Translations]]
- [[_COMMUNITY_English Reserve Translations|English Reserve Translations]]
- [[_COMMUNITY_Dev Tools & Agent Rules|Dev Tools & Agent Rules]]
- [[_COMMUNITY_Bengali Menu Categories|Bengali Menu Categories]]
- [[_COMMUNITY_Bengali Visit Info|Bengali Visit Info]]
- [[_COMMUNITY_English Menu Categories|English Menu Categories]]
- [[_COMMUNITY_English Visit Info|English Visit Info]]
- [[_COMMUNITY_Bengali Story Sections|Bengali Story Sections]]
- [[_COMMUNITY_English Story Sections|English Story Sections]]
- [[_COMMUNITY_Bengali Navigation Labels|Bengali Navigation Labels]]
- [[_COMMUNITY_English Navigation Labels|English Navigation Labels]]
- [[_COMMUNITY_Bengali Hero Section|Bengali Hero Section]]
- [[_COMMUNITY_English Hero Section|English Hero Section]]
- [[_COMMUNITY_Bengali Footer Content|Bengali Footer Content]]
- [[_COMMUNITY_English Footer Content|English Footer Content]]
- [[_COMMUNITY_WhatsApp Reservation Flow|WhatsApp Reservation Flow]]
- [[_COMMUNITY_Bengali SEO Metadata|Bengali SEO Metadata]]
- [[_COMMUNITY_English SEO Metadata|English SEO Metadata]]
- [[_COMMUNITY_Heritage Tease Section|Heritage Tease Section]]
- [[_COMMUNITY_Claude Permissions|Claude Permissions]]
- [[_COMMUNITY_Globe Icon Assets|Globe Icon Assets]]
- [[_COMMUNITY_Next.js Brand Assets|Next.js Brand Assets]]
- [[_COMMUNITY_Vercel Brand Assets|Vercel Brand Assets]]
- [[_COMMUNITY_Browser Window Icon|Browser Window Icon]]
- [[_COMMUNITY_ESLint Configuration|ESLint Configuration]]
- [[_COMMUNITY_PostCSS Configuration|PostCSS Configuration]]
- [[_COMMUNITY_File Icon Asset|File Icon Asset]]
- [[_COMMUNITY_Package JSON|Package JSON]]
- [[_COMMUNITY_Local Settings|Local Settings]]

## God Nodes (most connected - your core abstractions)
1. `siteConfig` - 17 edges
2. `compilerOptions` - 16 edges
3. `reserve` - 15 edges
4. `reserve` - 15 edges
5. `visit` - 12 edges
6. `visit` - 12 edges
7. `story` - 9 edges
8. `story` - 9 edges
9. `Bilingual Locale Routing (bn/en)` - 9 edges
10. `nav` - 8 edges

## Surprising Connections (you probably didn't know these)
- `Next.js Agent Rules (AGENTS.md)` --semantically_similar_to--> `Next.js Framework`  [INFERRED] [semantically similar]
  AGENTS.md → README.md
- `siteConfig` --shares_data_with--> `JSON-LD Restaurant Schema Injection`  [INFERRED]
  content/site-config.ts → src/app/[locale]/page.tsx
- `Next.js Breaking Changes Warning` --conceptually_related_to--> `Next.js Framework`  [INFERRED]
  AGENTS.md → README.md
- `generateMetadata()` --references--> `siteConfig`  [EXTRACTED]
  src/app/[locale]/gallery/page.tsx → content/site-config.ts
- `generateMetadata()` --references--> `siteConfig`  [EXTRACTED]
  src/app/[locale]/layout.tsx → content/site-config.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Bilingual Locale Routing System (routing + request + messages)** — i18n_routing, i18n_request, messages_bn, messages_en, next_config [EXTRACTED 0.95]
- **Owner-Editable Content Pattern (site-config drives all pages)** — content_site_config_siteconfig, content_site_config_menuitems, page_homepage, menu_page, gallery_page [INFERRED 0.85]
- **WhatsApp Ordering Flow (config + pages + messages)** — content_site_config_siteconfig, concept_whatsapp_ordering, page_homepage, menu_page [INFERRED 0.85]
- **Site Navigation Components (Header + Footer + MobileBottomBar)** — layout_header, layout_footer, layout_mobilebottombar [INFERRED 0.95]
- **SEO Infrastructure (robots + sitemap + siteConfig)** — app_robots, app_sitemap, concept_seo_routes [INFERRED 0.85]
- **Bilingual Page Rendering (locale-aware pages)** — reserve_page, story_page, visit_page, concept_bilingual_locale_routing [INFERRED 0.85]
- **Kalai Ghor Next.js + Vercel Project Setup** — readme_md_kalai_ghor_project, readme_md_nextjs_framework, readme_md_vercel_platform [EXTRACTED 1.00]
- **Next.js Agent Rules and Documentation Cluster** — agents_md_nextjs_agent_rules, claude_md_agents_reference, agents_md_nextjs_breaking_changes_warning [EXTRACTED 1.00]

## Communities (34 total, 6 thin omitted)

### Community 0 - "App Pages & SEO"
Cohesion: 0.06
Nodes (29): locales, pages, Bilingual Locale Routing (bn/en), JSON-LD Restaurant Schema Injection, Owner-Editable Content Pattern, SEO Metadata Routes (robots + sitemap), WhatsApp-based Ordering (no account/payment needed), MenuItem (+21 more)

### Community 1 - "Bilingual i18n Routing"
Cohesion: 0.05
Nodes (43): Bilingual i18n Pattern (bn/en locale routing), routing, common, perPiece, perPortion, todoPriceShort, featured, title (+35 more)

### Community 2 - "Package Dependencies"
Cohesion: 0.07
Nodes (29): dependencies, lucide-react, next, next-intl, react, react-dom, devDependencies, eslint (+21 more)

### Community 3 - "TypeScript Configuration"
Cohesion: 0.09
Nodes (21): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+13 more)

### Community 4 - "Bengali Reserve Translations"
Cohesion: 0.13
Nodes (15): reserve, dateLabel, datePlaceholder, disclaimer, itemsLabel, itemsPlaceholder, nameLabel, namePlaceholder (+7 more)

### Community 5 - "English Reserve Translations"
Cohesion: 0.13
Nodes (15): reserve, dateLabel, datePlaceholder, disclaimer, itemsLabel, itemsPlaceholder, nameLabel, namePlaceholder (+7 more)

### Community 6 - "Dev Tools & Agent Rules"
Cohesion: 0.19
Nodes (14): Next.js Agent Rules (AGENTS.md), Next.js Breaking Changes Warning, CLAUDE.md Agent Rules Reference, Prettier CSS/SCSS/Less Override (singleQuote false), Prettier JSON Override (trailingComma none), Prettier Markdown Override (proseWrap, printWidth 80), Prettier Configuration (.prettierrc.yaml), prettier-plugin-packagejson Plugin (+6 more)

### Community 7 - "Bengali Menu Categories"
Cohesion: 0.17
Nodes (12): bhorta, combo, curry, drink, ruti, menu, categories, orderWhatsApp (+4 more)

### Community 8 - "Bengali Visit Info"
Cohesion: 0.17
Nodes (12): visit, addressTitle, bestTimeBody, bestTimeTitle, callBtn, dhakaOutlet, directionsBtn, hoursTitle (+4 more)

### Community 9 - "English Menu Categories"
Cohesion: 0.17
Nodes (12): bhorta, combo, curry, drink, ruti, menu, categories, orderWhatsApp (+4 more)

### Community 10 - "English Visit Info"
Cohesion: 0.17
Nodes (12): visit, addressTitle, bestTimeBody, bestTimeTitle, callBtn, dhakaOutlet, directionsBtn, hoursTitle (+4 more)

### Community 11 - "Bengali Story Sections"
Cohesion: 0.22
Nodes (9): story, section1Body, section1Title, section2Body, section2Title, section3Body, section3Title, subtitle (+1 more)

### Community 12 - "English Story Sections"
Cohesion: 0.22
Nodes (9): story, section1Body, section1Title, section2Body, section2Title, section3Body, section3Title, subtitle (+1 more)

### Community 13 - "Bengali Navigation Labels"
Cohesion: 0.25
Nodes (8): nav, gallery, home, menu, reserve, story, switchLang, visit

### Community 14 - "English Navigation Labels"
Cohesion: 0.25
Nodes (8): nav, gallery, home, menu, reserve, story, switchLang, visit

### Community 15 - "Bengali Hero Section"
Cohesion: 0.29
Nodes (7): hero, ctaCall, ctaDirections, ctaWhatsApp, headline, headlineHighlight, subheadline

### Community 16 - "English Hero Section"
Cohesion: 0.29
Nodes (7): hero, ctaCall, ctaDirections, ctaWhatsApp, headline, headlineHighlight, subheadline

### Community 17 - "Bengali Footer Content"
Cohesion: 0.33
Nodes (6): footer, contact, copyright, followUs, quickLinks, tagline

### Community 18 - "English Footer Content"
Cohesion: 0.33
Nodes (6): footer, contact, copyright, followUs, quickLinks, tagline

### Community 19 - "WhatsApp Reservation Flow"
Cohesion: 0.50
Nodes (3): WhatsApp-Based Reservation Pattern, buildWhatsAppURL Function, Props

### Community 20 - "Bengali SEO Metadata"
Cohesion: 0.40
Nodes (5): metadata, description, ogDescription, ogTitle, title

### Community 21 - "English SEO Metadata"
Cohesion: 0.40
Nodes (5): metadata, description, ogDescription, ogTitle, title

### Community 22 - "Heritage Tease Section"
Cohesion: 0.50
Nodes (4): heritageTease, body, cta, title

### Community 24 - "Globe Icon Assets"
Cohesion: 0.67
Nodes (3): Globe / World Icon, Web / Internet Symbol, Globe SVG Icon

### Community 25 - "Next.js Brand Assets"
Cohesion: 0.67
Nodes (3): Next.js Brand Identity, Static Public Asset, Next.js Wordmark Logo (SVG)

### Community 26 - "Vercel Brand Assets"
Cohesion: 1.00
Nodes (3): Upward-Pointing Triangle Icon, Vercel Brand / Logo Mark, Vercel Logo SVG

### Community 27 - "Browser Window Icon"
Cohesion: 0.67
Nodes (3): Browser Window UI Concept, UI Icon Asset, Window SVG Icon

## Knowledge Gaps
- **235 isolated node(s):** `allow`, `eslintConfig`, `title`, `description`, `ogTitle` (+230 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Bilingual i18n Pattern (bn/en locale routing)` connect `Bilingual i18n Routing` to `App Pages & SEO`?**
  _High betweenness centrality (0.201) - this node is a cross-community bridge._
- **Why does `reserve` connect `Bengali Reserve Translations` to `Bilingual i18n Routing`?**
  _High betweenness centrality (0.057) - this node is a cross-community bridge._
- **What connects `allow`, `eslintConfig`, `title` to the rest of the system?**
  _238 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `App Pages & SEO` be split into smaller, more focused modules?**
  _Cohesion score 0.05536723163841808 - nodes in this community are weakly interconnected._
- **Should `Bilingual i18n Routing` be split into smaller, more focused modules?**
  _Cohesion score 0.04591836734693878 - nodes in this community are weakly interconnected._
- **Should `Package Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.06666666666666667 - nodes in this community are weakly interconnected._
- **Should `TypeScript Configuration` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._