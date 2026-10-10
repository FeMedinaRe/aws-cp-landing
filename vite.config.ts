import { defineConfig } from 'vite';

// Subpath-safe base for GitHub Pages (project pages served under /<repo>/).
// Default './' works both at domain root and under a subpath.
// Override with env BASE_PATH if needed, e.g. BASE_PATH=/mi-repo/ npm run build
const base = process.env.BASE_PATH ?? './';

export default defineConfig({
  base,
});
