# Sentry Release Github Action

GitHub Action for send releases to [Sentry](https://docs.sentry.io/workflow/releases/). 

## Usage

Basic usage

```yaml
steps:
  - name: Send Release to Sentry
    uses: dmandrade/sentry-release-github-action@v1
    env:
      SENTRY_AUTH_TOKEN: ${{ secrets.SENTRY_AUTH_TOKEN }}
      SENTRY_ORG: foo
      SENTRY_PROJECT: bar
    with:
      version: ${{ github.ref }}
```

If you use Sentry self-hosted you can use ``SENTRY_URL`` env variable to set host url.

```yaml
steps:
  - name: Send Release to Sentry
    uses: dmandrade/sentry-release-github-action@v1
    env:
      SENTRY_URL: https://mysentry.invalid/
      SENTRY_AUTH_TOKEN: ${{ secrets.SENTRY_AUTH_TOKEN }}
      SENTRY_ORG: foo
      SENTRY_PROJECT: bar
    with:
      environment: production
      version: ${{ github.ref }}
```

A example using [Semantic Release Github Action](https://github.com/dmandrade/semantic-release-github-action/).

```yaml
steps:
  - name: Semantic Release
    uses: dmandrade/semantic-release-github-action@v1
    id: release
    env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
      
  - name: Send Release to Sentry
    if: steps.release.outputs.published == 'true'
    uses: dmandrade/sentry-release-github-action@v1
    env:
      SENTRY_AUTH_TOKEN: ${{ secrets.SENTRY_AUTH_TOKEN }}
      SENTRY_ORG: foo
      SENTRY_PROJECT: bar
    with:
      environment: production
      version: steps.release.outputs.version
```
