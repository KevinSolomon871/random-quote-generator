# Atmospheric Quote Generator ⚡

<p align="center">
  <img src="https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Web_Audio_API-Procedural-F59E0B?style=for-the-badge" alt="Web Audio API" />
  <img src="https://img.shields.io/badge/Web_Speech_API-Native_TTS-10B981?style=for-the-badge" alt="Web Speech API" />
  <img src="https://img.shields.io/badge/Deployment-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
</p>

An atmospheric, responsive Single Page Application built for the **IEEE-VIT Recruitment Task 2026** (Web Development Domain). Designed with an obsidian glass aesthetic, GPU-accelerated kinetic particles, real-time procedural chord synthesis, dynamic audio waveform visualization, and a resilient, offline-first fallback architecture.

---

## 🔗 Live Links & Deliverables

- **Live Application**: [https://kevinquotegenerator.netlify.app/]
- **GitHub Repository**: [https://github.com/KevinSolomon871/random-quote-generator](https://github.com/KevinSolomon871/random-quote-generator)
- **Technical Report (Google Doc)**: [Insert your Public Google Doc Link here]

---

## 🌟 Key Features

### 1. Resilient Data Engine (`useQuote` Hook)
- **Zero-Blank-Screen Guarantee**: The UI never crashes or renders empty containers. If public APIs face CORS blocks, rate limiting, or network timeouts, the app gracefully switches to an internal fallback dataset (`fallbackQuotes.js`).
- **Network Lifecycle Awareness**: Listens to browser `online` and `offline` events, rendering an amber "Cached" badge during disconnected sessions.
- **Race Condition & Memory Leak Guard**: Implements `isMountedRef` lifecycle tracking and state cleanup to prevent updates on unmounted components.

### 2. Atmospheric Realms & Procedural Sound Synthesis
- **Dynamic Realm Morphing**: Switch between 4 distinct visual realms (**Emerald Aurora**, **Cosmic Indigo**, **Rose Sunset**, and **Cyber Cyan**). Each realm dynamically shifts particle colors, ambient glow, and harmonic chord tunings.
- **Procedural Web Audio API Engine**: Zero audio asset files or heavy third-party libraries. When a quote materializes, the app synthesizes polyphonic chords ($A\text{maj7}$, $C\text{maj7}$, $D\text{maj7}$, $F\text{maj7}$) in real time using native browser oscillators and gain ramps.
- **Sound Toggle**: An audio state control in the navigation bar allows users to mute or enable chord feedback at will.

### 3. Kinetic Word Cascade & 3D Tilt
- **Staggered Word Reveal**: Incoming quote content splits into tokens that cascade onto the screen with staggered spring physics and a gentle blur-to-focus transition.
- **Zero-Lag Specular Tilt**: Mouse tracking updates a 3D perspective matrix on the card while projecting a radial light spotlight that traces cursor position without frame drops.

### 4. Interactive Canvases
- **Particle Dynamics (60 FPS)**: An HTML5 `<canvas>` creates an interactive background particle field that gently repels away from the cursor.
- **Real-Time Frequency Waveform**: A secondary canvas renders an oscillating sine wave above the quote, pulsing into dynamic amplitude whenever Text-to-Speech is active.

### 5. Native Text-to-Speech & Clipboard Actions
- **Web Speech Synthesis**: Reads quotes aloud with natural cadence using `window.speechSynthesis`, complete with active state indicators and error traps.
- **One-Click Clipboard Copy**: Copies formatted quote and author strings with toast notification feedback.

---

## 📐 System Architecture

```text
 ┌────────────────────────────────────────────────────────────────────────┐
 │                              USER VIEWPORT                             │
 │   [Interactive Particle Canvas]  <--->  [Dynamic Atmosphere Ambient]   │
 └────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
 ┌────────────────────────────────────────────────────────────────────────┐
 │                          MAIN PRESENTATION                             │
 │   - Header: Realm Switcher, Audio FX Toggle, Cached/Offline Indicator  │
 │   - Card: 3D Tilt + Specular Spotlight + Live Frequency Wave Canvas    │
 │   - Typography: Staggered Word Reveal Engine + Author Meta             │
 │   - Control Dock: Speech Synthesizer (TTS), Copy Clipboard, Fetch      │
 └────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
 ┌────────────────────────────────────────────────────────────────────────┐
 │                    STATE & DATA LAYER (useQuote Hook)                  │
 │   - Network Status Listener (online / offline)                         │
 │   - Loading, Error, and Quote States                                   │
 └────────────────────────────────────────────────────────────────────────┘
                    │                                   │
         [Fetch Remote Endpoint]             [Network Block / Offline]
                    │                                   │
                    ▼                                   ▼
      ┌───────────────────────────┐       ┌───────────────────────────┐
      │  DummyJSON REST API       │       │  Embedded Fallback Store  │
      │  (Live Network Response)  │       │  (Guaranteed Instant UI)  │
      └───────────────────────────┘       └───────────────────────────┘
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **React 18** | Functional component architecture, custom hooks, and declarative state |
| **Vite** | Next-generation frontend tooling and fast HMR build pipeline |
| **Tailwind CSS** | Utility-first styling, responsive layout grids, and backdrop glassmorphism |
| **HTML5 Canvas API** | Procedural particle engine and audio frequency visualizer |
| **Web Audio API** | Zero-dependency real-time harmonic chord synthesis |
| **Web Speech API** | Native in-browser text-to-speech accessibility |
| **Lucide React** | Clean, lightweight SVG iconography |
| **Vercel** | Edge deployment and continuous integration via GitHub |

---

## 📋 Task Requirements Compliance

| Rubric Criterion | Implementation Proof | Status |
| :--- | :--- | :--- |
| **React / Modern JS** | Built entirely in React 18 using modern hook patterns (`useCallback`, `useRef`, `useEffect`). | **COMPLETED** |
| **Initial Quote on Load** | Automated lifecycle fetch resolves and renders a verified quote upon component mount. | **COMPLETED** |
| **Fetch API Integration** | Asynchronous `fetch()` call pulls from dynamic REST endpoints with JSON parsing. | **COMPLETED** |
| **Loading State** | Custom animated skeleton placeholders prevent layout shifts while waiting for response. | **COMPLETED** |
| **Defensive Error Handling** | Structured `try/catch/finally` intercepts CORS, timeouts, and offline status with local data fallback. | **COMPLETED** |
| **Responsive Design** | Fluid layout tested and optimized across mobile, tablet, and desktop viewports. | **COMPLETED** |

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js (v18.x or higher recommended)
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/KevinSolomon871/random-quote-generator.git
   ```

2. Navigate to the project root:
   ```bash
   cd random-quote-generator
   ```

3. Install project dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`.

---

## ⚙️ Build for Production

To create an optimized production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

---

## 👤 Author

**C Kevin Solomon**  
- **Degree**: B.Tech in Computer Science and Engineering Core  
- **Institution**: Vellore Institute of Technology (VIT), Vellore  
- **GitHub**: [@KevinSolomon871](https://github.com/KevinSolomon871)  
- **Email**: [kevinsolomon871@gmail.com](mailto:kevinsolomon871@gmail.com)