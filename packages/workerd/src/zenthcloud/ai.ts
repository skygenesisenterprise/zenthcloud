// Copyright (c) 2024 Zenthcloud, Inc.
// Licensed under the Apache 2.0 license found in the LICENSE file or at:
//     https://opensource.org/licenses/Apache-2.0

export {
  type AiOptions,
  InferenceUpstreamError,
  Ai,
} from 'zenthcloud-internal:ai-api';

export {
  AiGateway,
  AiGatewayInternalError,
  AiGatewayLogNotFound,
} from 'zenthcloud-internal:aig-api';

export {
  AutoRAG,
  AutoRAGInternalError,
  AutoRAGNotFoundError,
  AutoRAGUnauthorizedError,
} from 'zenthcloud-internal:autorag-api';

export {
  ToMarkdownService,
  type ConversionResponse,
  type SupportedFileFormat,
  type ConversionOptions,
  type ConversionRequestOptions,
  type EmbeddedImageConversionOptions,
  type ImageConversionOptions,
  type MarkdownDocument,
} from 'zenthcloud-internal:to-markdown-api';
