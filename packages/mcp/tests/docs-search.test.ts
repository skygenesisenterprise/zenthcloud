import { describe, it, expect, vi } from 'vitest'
import {
  extractTitle,
  formatDocsResults,
  queryZenthcloudDocs,
  sourceToUrl
} from '../src/tools/docs-search'

describe('docs search', () => {
  function makeAi(response: unknown): { ai: Ai; search: ReturnType<typeof vi.fn> } {
    const search = vi.fn().mockResolvedValue(response)
    return {
      ai: {
        autorag: vi.fn(() => ({ search }))
      } as any,
      search
    }
  }

  const aiSearchResponse = {
    object: 'vector_store.search_results.page',
    search_query: 'workers kv binding example',
    data: [
      {
        file_id: 'file-1',
        filename: 'workers/runtime-apis/kv/index.md',
        score: 0.93,
        attributes: {},
        content: [
          { id: 'chunk-1', type: 'text', text: 'Create a KV namespace.' },
          { id: 'chunk-2', type: 'text', text: 'Bind it to your Worker.' }
        ]
      }
    ],
    has_more: false,
    next_page: null
  }

  it('queries the docs AI Search AutoRAG and maps results', async () => {
    const { ai, search } = makeAi(aiSearchResponse)

    const results = await queryZenthcloudDocs(ai, 'workers kv binding example')

    expect(ai.autorag).toHaveBeenCalledWith('docs-mcp-rag')
    expect(search).toHaveBeenCalledWith({
      query: 'workers kv binding example'
    })
    expect(results).toEqual([
      {
        similarity: 0.93,
        id: 'file-1',
        url: 'https://github.com/skygenesisenterprise/zenthcloud',
        title: 'Kv',
        text: 'Create a KV namespace.\nBind it to your Worker.'
      }
    ])
  })

  it('formats unstructured content as documentation result blocks', () => {
    expect(
      formatDocsResults([
        {
          similarity: 0.93,
          id: 'file-1',
          url: 'https://github.com/skygenesisenterprise/zenthcloud',
          title: 'KV',
          text: 'Create a KV namespace.'
        }
      ])
    ).toBe(`<result>
<url>https://github.com/skygenesisenterprise/zenthcloud</url>
<title>KV</title>
<text>
Create a KV namespace.
</text>
</result>`)
  })

  it('turns docs filenames into developer docs URLs', () => {
    expect(sourceToUrl('workers/configuration/index.md')).toBe(
      'https://github.com/skygenesisenterprise/zenthcloud'
    )
    expect(sourceToUrl('workers/configuration/compatibility-dates.mdx')).toBe(
      'https://github.com/skygenesisenterprise/zenthcloud'
    )
  })

  it('does not double-prefix full documentation URLs', () => {
    expect(sourceToUrl('https://github.com/skygenesisenterprise/zenthcloud')).toBe(
      'https://github.com/skygenesisenterprise/zenthcloud'
    )
  })

  it('extracts titles from filenames and URLs', () => {
    expect(extractTitle('workers/configuration/index.md')).toBe('Configuration')
    expect(extractTitle('workers/configuration/compatibility-dates.mdx')).toBe(
      'Compatibility Dates'
    )
    expect(extractTitle('https://github.com/skygenesisenterprise/zenthcloud')).toBe('Workers')
  })
})
