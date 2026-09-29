import { describe, it, expect, beforeEach, afterEach } from 'vitest'

const { githubApiUrl, githubGraphqlUrl } = require('../github-host')

describe('github-host', () => {
  let saved

  beforeEach(() => {
    saved = process.env.GITHUB_API_URL
    delete process.env.GITHUB_API_URL
  })

  afterEach(() => {
    if (saved === undefined) delete process.env.GITHUB_API_URL
    else process.env.GITHUB_API_URL = saved
  })

  it('defaults to github.com', () => {
    expect(githubApiUrl()).toBe('https://api.github.com')
    expect(githubGraphqlUrl()).toBe('https://api.github.com/graphql')
  })

  it('honours GITHUB_API_URL and strips a trailing slash', () => {
    process.env.GITHUB_API_URL = 'https://ghes.example.com/api/v3/'
    expect(githubApiUrl()).toBe('https://ghes.example.com/api/v3')
  })

  it('derives the enterprise GraphQL endpoint from the REST base', () => {
    process.env.GITHUB_API_URL = 'https://ghes.example.com/api/v3'
    expect(githubGraphqlUrl()).toBe('https://ghes.example.com/api/graphql')
  })

  it('appends /graphql to a base that is not the enterprise shape', () => {
    process.env.GITHUB_API_URL = 'http://localhost:8080'
    expect(githubGraphqlUrl()).toBe('http://localhost:8080/graphql')
  })

  it('treats a blank value as unset', () => {
    process.env.GITHUB_API_URL = '   '
    expect(githubApiUrl()).toBe('https://api.github.com')
  })
})
