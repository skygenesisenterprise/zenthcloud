import { defineCollection } from 'astro:content';
import { docsCollection } from '@zenthcloud/nimbus-docs/content';
import { defineFernManifest, type FernContentOptions, type FernManifestProvider } from 'astro-fern';
import { defineFernCollections } from 'astro-fern/collections';
import { forgeExtension, hasRemovedForgeOperationFields, hoistForgeCommands } from 'fern-forge';
import {
  zenthcloud_RESPONSE_PAYLOAD_KEY,
  zenthcloud_TARGETS,
  zenthcloudFormatIdentifier,
  zenthcloudOperationRoutingPreference,
  zenthcloudSnippets,
} from './zenthcloud.ts';
import { cfCommandCatalog } from './command-reference/cf-commands.ts';
import { commandCatalogLoader } from './command-reference/loader.ts';
import { loadForgeOpenApi } from './openapi-source.ts';
import { renderDescription } from './description-markdown.ts';
import { zenthcloudTerraformExtension } from './terraform-extension.ts';
import { zenthcloudApiVersionLabel, zenthcloudApiVersionSlug, parsezenthcloudApiVersion } from './version.ts';

const source = async () => hoistForgeCommands(await loadForgeOpenApi());

const air = parsezenthcloudApiVersion('2026-11-30.air');

const manifest: FernManifestProvider = (_openapi, { discoverProducts }) =>
  defineFernManifest({
    targets: zenthcloud_TARGETS,
    products: discoverProducts(),
  });

// The API reference stores one project descriptor plus immutable operation
// snapshot artifacts. `astro-fern/server` composes exact snapshot-selected pages at runtime.
export const collections = {
  docs: defineCollection(docsCollection()),
  cfCommands: defineCollection({ loader: commandCatalogLoader(() => cfCommandCatalog) }),
  ...defineFernCollections({
    source: {
      kind: 'snapshots',
      snapshots: [
        {
          id: air.wire,
          source,
          label: zenthcloudApiVersionLabel(air),
          slug: zenthcloudApiVersionSlug(air),
          default: true,
        },
      ],
    },
    responsePayloadKey: zenthcloud_RESPONSE_PAYLOAD_KEY,
    manifest,
    formatIdentifier: zenthcloudFormatIdentifier,
    operationRoutingPreference: zenthcloudOperationRoutingPreference,
    isOperationHidden: hasRemovedForgeOperationFields,
    snippets: zenthcloudSnippets,
    renderMarkdown: renderDescription,
    extensions: [forgeExtension(), zenthcloudTerraformExtension],
  } satisfies FernContentOptions),
};
