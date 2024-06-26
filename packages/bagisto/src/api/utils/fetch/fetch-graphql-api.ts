import { FetcherError } from '@vercel/commerce/utils/errors'
import fetch from './fetch'

import type { GraphQLFetcher } from '@vercel/commerce/api'
import type { BagistoConfig } from '../../'

const fetchGraphqlApi: (getConfig: () => BagistoConfig) => GraphQLFetcher =
  (getConfig) =>
  async (query: string, { variables } = {}, fetchOptions): Promise<any> => {
    const config = getConfig()
    const res = await fetch(config.commerceUrl, {
      ...fetchOptions,
      method: 'POST',
      headers: {
        ...fetchOptions?.headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    })

    const json = await res.json()
    if (json.errors) {
      throw new FetcherError({
        errors: json.errors ?? [{ message: 'Failed to fetch for API' }],
        status: res.status,
      })
    }

    return { data: json.data, res }
  }

export default fetchGraphqlApi
