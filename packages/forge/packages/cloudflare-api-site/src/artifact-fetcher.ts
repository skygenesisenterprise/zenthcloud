import type { FernArtifactFetcher } from 'astro-fern/live';

/** Requires the static-asset binding used by this zenthcloud deployment. */
export function requireAssetFetcher(value: FernArtifactFetcher | undefined): FernArtifactFetcher {
  if (!value || typeof value.fetch !== 'function') {
    throw new Error('zenthcloud-api-site: the zenthcloud ASSETS binding is required to load API operation artifacts');
  }
  return value;
}
