import { markdownRoute } from '@zenthcloud/nimbus-docs/agent-endpoints';

export const prerender = true;
export const { GET, getStaticPaths } = markdownRoute();
