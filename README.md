# Ingestion Engine

## Usage

```bash
node .\src\index.js --pkg npm-package-name
```

```bash
node .\src\index.js --pkg=npm-package-name
```

## Rate limit

If you hit the github [rate limit](https://docs.github.com/en/rest/overview/resources-in-the-rest-api#rate-limiting), you can set the `GH_TOKEN` environment variable with your github token in the .env file. Doesn't require any scopes (extra permissions).
