/**
 * Where the GitHub API lives.
 *
 * Every GitHub call in the platform used to name api.github.com outright,
 * which is right for github.com and wrong for everything else: a GitHub
 * Enterprise Server install serves its REST API at <host>/api/v3 and its
 * GraphQL API at <host>/api/graphql, and a local emulator serves both at
 * whatever it is told. GITHUB_API_URL names the REST base; the GraphQL URL
 * is derived from it by the enterprise convention, so one variable covers
 * both. Unset, both resolve to github.com and nothing changes.
 *
 * Env vars:
 *   GITHUB_API_URL — REST API base, e.g. https://ghes.example.com/api/v3
 *                    (default https://api.github.com)
 *
 * @module shared/server/github-host
 */

const DEFAULT_API_URL = 'https://api.github.com';

/**
 * REST API base URL, without a trailing slash.
 * @returns {string}
 */
function githubApiUrl() {
  const configured = (process.env.GITHUB_API_URL || '').trim();
  return (configured || DEFAULT_API_URL).replace(/\/+$/, '');
}

/**
 * GraphQL endpoint for the configured REST base.
 *
 * github.com:  https://api.github.com          -> https://api.github.com/graphql
 * enterprise:  https://host/api/v3             -> https://host/api/graphql
 * anything else appends /graphql to the base.
 * @returns {string}
 */
function githubGraphqlUrl() {
  const base = githubApiUrl();
  if (/\/api\/v3$/.test(base)) {
    return base.replace(/\/api\/v3$/, '/api/graphql');
  }
  return `${base}/graphql`;
}

module.exports = { githubApiUrl, githubGraphqlUrl, DEFAULT_API_URL };
