# KERNOVA SYSTEMS — SKILLS REFERENCE

> **Workspace Agent Skills Architecture**
>
> This document provides the complete, dedicated index of all skills available in the `.agents/skills` tree, organized by operational domain.

---

## 1. 3D & WebGL (Three.js / React Three Fiber)

These skills govern all 3D scene construction, mathematical transforms, WebGL rendering, and shader execution.

| Skill | Path | Description & Trigger Scenarios |
| :--- | :--- | :--- |
| **threejs** | `.agents/skills/threejs` | Comprehensive 3D development: scenes, cameras, renderers, materials, animations, and lighting. |
| **threejs-fundamentals** | `.agents/skills/threejs-fundamentals` | Scene graph setup, coordinate spaces, camera frustums, and Object3D hierarchies. |
| **threejs-geometry** | `.agents/skills/threejs-geometry` | Geometric structures, `BufferGeometry`, custom vertex attributes, and instanced meshes. |
| **threejs-materials** | `.agents/skills/threejs-materials` | Physical materials (`MeshPhysicalMaterial`), PBR parameters, roughness, transmission, and clearcoat. |
| **threejs-lighting** | `.agents/skills/threejs-lighting` | Atmospheric lighting, directional lights, point lights, and shadow optimization. |
| **threejs-animation** | `.agents/skills/threejs-animation` | Procedural frame-based rotation (`useFrame`), dampening, keyframes, and delta-timed animation. |
| **threejs-interaction** | `.agents/skills/threejs-interaction` | Pointer parallax, raycasting, interactive hover targets, and camera navigation. |
| **threejs-loaders** | `.agents/skills/threejs-loaders` | Asynchronous asset loading (GLTF, textures, HDR) and loading fallbacks. |
| **threejs-postprocessing** | `.agents/skills/threejs-postprocessing` | Post-processing effects: bloom, depth of field, noise, and screen-space shaders. |
| **threejs-shaders** | `.agents/skills/threejs-shaders` | Custom GLSL vertex and fragment shaders, uniforms, and procedural effects. |
| **threejs-textures** | `.agents/skills/threejs-textures` | Texture maps, UV mapping, normal maps, and roughness maps. |

---

## 2. Motion & Animation (GSAP, Motion, Lenis)

These skills govern spatial transitions, momentum-based scrolling, UI tactile feedback, and cinematic choreography.

| Skill | Path | Description & Trigger Scenarios |
| :--- | :--- | :--- |
| **ai-ui-ux-motion-engine** | `.agents/skills/ai-ui-ux-motion-engine` | Cinematic scroll reveals, camera choreography, and multi-pass motion refinement. |
| **animate** | `.agents/skills/animate` | Micro-motion design: timing, easing curves, entrance/exit states, and interruptible transitions. |
| **improve-animations** | `.agents/skills/improve-animations` | Motion audits, frame pacing, jank identification, and optimization roadmaps. |
| **review-animations** | `.agents/skills/review-animations` | Motion craft evaluation against high design engineering standards (Emil Kowalski bar). |

---

## 3. Frontend UI Engineering & Design

These skills guide component architecture, design system tokens, typography, and accessibility.

| Skill | Path | Description & Trigger Scenarios |
| :--- | :--- | :--- |
| **frontend-ui-engineering** | `.agents/skills/frontend-ui-engineering` | Production-grade React/Next.js components, state separation, and composable architectures. |
| **frontend-design** | `.agents/skills/frontend-design` | Visual direction, typographic hierarchy, negative space, and avoiding generic AI aesthetics. |
| **accessibility** | `.agents/skills/accessibility` | WCAG 2.2 AA standards, semantic HTML, keyboard focus management, and `prefers-reduced-motion`. |

---

## 4. Performance & Visibility

These skills ensure visual spectacle does not degrade runtime speed or search discoverability.

| Skill | Path | Description & Trigger Scenarios |
| :--- | :--- | :--- |
| **performance-optimization** | `.agents/skills/performance-optimization` | Web Vitals, code splitting, dynamic imports (`ssr: false`), and low draw-call counts. |
| **seo** | `.agents/skills/seo` | Title tags, meta descriptions, OpenGraph protocols, canonical URLs, and JSON-LD structured data. |

---

## 5. Testing & Quality Assurance

These skills handle automated testing, browser automation, and runtime inspection.

| Skill | Path | Description & Trigger Scenarios |
| :--- | :--- | :--- |
| **playwright** | `.agents/skills/playwright` | E2E test suites, multi-browser validation (Chromium, WebKit), and mobile viewport emulation. |
| **browser-testing-with-devtools** | `.agents/skills/browser-testing-with-devtools` | Real-time DOM inspection, console logs, network request auditing, and live runtime validation. |

---

## 6. How Skills Map to Kernova Systems Implementation

```text
[Architecture & Structure]
       └── Next.js 16 + React 19 + TypeScript  --> frontend-ui-engineering

[Visual & Spatial]
       ├── Tailwind CSS (Design Tokens)         --> frontend-design
       └── Three.js + R3F + Drei                --> threejs, threejs-fundamentals, threejs-materials

[Movement & Interaction]
       ├── GSAP ScrollTrigger                   --> ai-ui-ux-motion-engine
       ├── Motion (UI States)                  --> animate
       └── Lenis Smooth Scroll                  --> performance-optimization

[Quality & Delivery]
       ├── Playwright E2E                       --> playwright
       ├── WCAG Accessibility                   --> accessibility
       └── OpenGraph & JSON-LD                  --> seo
```
