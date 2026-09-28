# KERNOVA SYSTEMS — BUILD

> **Build the website as a single, immersive digital experience.**
>
> `rules.md` defines identity and behavior.
> `design.md` defines visual language.
> `funnel.md` defines the visitor journey.
> This document defines implementation principles.

---

## 1. PRIMARY OBJECTIVE

Build a production-quality, highly immersive one-page Kernova Systems website.

The result must feel:

* Premium
* Cinematic
* Fast
* Technologically advanced
* Intentional
* Responsive
* Original

Do not build a generic agency landing page.

---

## 2. SOURCE OF TRUTH

Follow the documents in this order:

```text
rules.md
↓
design.md
↓
funnel.md
↓
build.md
```

If implementation decisions conflict with the identity, experience, or funnel, **do not silently compromise the higher-level specification**.

When exact visual designs, assets, scenes, or instructions are provided separately, treat those as authoritative for their specific implementation.

Do not invent major sections, interactions, branding, or functionality that has not been requested.

---

## 3. ARCHITECTURE

Build the website as a cohesive single-page experience.

Use:

* Reusable components
* Clear component boundaries
* Maintainable code
* Consistent naming
* Modular sections
* Reusable animation systems
* Centralized design values where appropriate

Avoid unnecessary abstraction.

Do not create complexity merely to make the code appear sophisticated.

---

## 4. EXPERIENCE FIRST

The implementation must preserve the intended psychological journey:

```text
Attention
→ Curiosity
→ Vision
→ Problem
→ Realization
→ Kernova
→ Capability
→ System
→ Proof
→ Offer
→ Desire
→ Contact
```

Do not allow technical implementation to flatten this journey into ordinary scrolling sections.

The website should feel continuous.

---

## 5. MOTION

Motion is a core part of the implementation.

Prioritize:

* Smooth transitions
* Spatial continuity
* Scroll-linked interactions where appropriate
* Depth
* Transformation
* Cinematic timing
* Intentional entrance and exit states

Do not animate everything.

Animation should communicate meaning, hierarchy, or progression.

Avoid:

* gratuitous effects
* repetitive motion
* distracting loops
* excessive easing
* animation that delays useful interaction

---

## 6. 3D

3D is a major part of the Kernova experience.

3D assets must be:

* Optimized
* Properly loaded
* Responsive to viewport/device capability
* Integrated with the environment
* Visually consistent with the design

Use progressive loading and appropriate fallbacks.

If a device cannot reasonably support the full experience, preserve the **concept and atmosphere**, not necessarily every effect.

---

## 7. PERFORMANCE

Maximum visual spectacle does **not** mean maximum technical waste.

Prioritize:

* Optimized assets
* Lazy loading
* Efficient rendering
* Compressed media
* Minimal blocking resources
* Efficient animation
* Proper code splitting
* Fast initial interaction
* Sensible caching

Avoid unnecessary libraries.

Do not introduce a dependency when a simple implementation is sufficient.

---

## 8. RESPONSIVE IMPLEMENTATION

Primary priority:

**Desktop → Laptop → Mobile → Tablet**

Do not simply scale the desktop design down.

Adapt:

* layout
* typography
* animation
* 3D
* interaction
* spacing
* navigation

Mobile must remain a deliberate experience.

Where an effect cannot perform properly on mobile, replace or simplify it intelligently.

---

## 9. ACCESSIBILITY

The experience must remain usable.

Implement appropriate:

* semantic HTML
* keyboard navigation
* focus states
* readable typography
* color contrast
* accessible forms
* reduced-motion behavior
* meaningful labels

Accessibility should be integrated into the system, not added as an afterthought.

---

## 10. CONTENT

Never invent factual content.

Do not fabricate:

* clients
* testimonials
* statistics
* awards
* case studies
* results
* partnerships
* technical capabilities

Use placeholders only when explicitly instructed.

Keep copy concise.

Do not add generic filler copy to fill empty space.

---

## 11. CONTACT SYSTEM

The primary conversion is contact.

The implementation should support the defined contact flow without creating unnecessary friction.

The contact experience should feel like a continuation of the website rather than a generic embedded form.

Where integrations are not yet configured, create clean integration points rather than fake functionality.

---

## 12. SEO & METADATA

Implement appropriate:

* Page title
* Meta description
* Open Graph metadata
* Structured semantic content
* Favicon
* Canonical URL
* Basic structured data where appropriate

SEO must not distort the visual or narrative experience.

---

## 13. ANALYTICS

The architecture should allow analytics to be added cleanly.

Track meaningful interactions such as:

* Page entry
* Major experience milestones
* CTA interaction
* Contact initiation
* Form submission
* Important interactive elements

Do not track unnecessary events simply because they are technically possible.

---

## 14. ERROR & LOADING STATES

Loading is part of the experience.

Create intentional:

* Initial loading state
* Asset loading behavior
* 3D loading behavior
* Form states
* Success states
* Error states
* Unsupported-device fallbacks

Never allow broken assets, empty screens, or unhandled errors to become visible parts of the experience.

---

## 15. CODE QUALITY

Code must be:

* readable
* maintainable
* modular
* predictable
* production-oriented

Avoid:

* duplicated logic
* giant components
* hardcoded repeated values
* unnecessary abstractions
* dead code
* temporary hacks left in production

Do not optimize code at the expense of understanding it.

---

## 16. AI DEVELOPMENT RULE

AI is the implementation tool, not the designer.

Do not let the AI:

* invent the brand
* redesign the experience
* add generic agency sections
* replace specified interactions with simpler ones
* introduce generic UI patterns
* fabricate content
* make major creative decisions without instruction

When information is missing, prefer the simplest implementation consistent with the existing specifications.

**Do not hallucinate requirements.**

---

## 17. QUALITY BAR

Before considering the website complete, verify:

### Experience

Does it feel like Kernova?

### Design

Does it feel premium and intentional?

### Psychology

Does the journey create curiosity, understanding, trust, and action?

### Motion

Does animation enhance the experience?

### Performance

Does the spectacle remain usable?

### Mobile

Does the experience remain coherent?

### Conversion

Is the path to contact clear?

### Technical quality

Is the implementation production-ready?

---

# FINAL RULE

**Do not build a website that merely looks impressive.**

Build the experience that Kernova is selling.

The website itself must be evidence of Kernova's philosophy:

**Experience. Systems. Speed.**
