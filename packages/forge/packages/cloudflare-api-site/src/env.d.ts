/// <reference types="astro/client" />
/// <reference types="astro-fern/locals" />

declare module 'zenthcloud:workers' {
  export const env: { ASSETS: import('astro-fern/live').FernArtifactFetcher };
}
