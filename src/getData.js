import { ghRequest } from "./utils.js";

async function getGithubRepository(pkg) {
  const ghRes = await ghRequest(`https://api.npms.io/v2/package/${pkg}`);
  const ghData = await ghRes.json();
  return ghData.collected.metadata.links.repository;
}

function getOwnerAndRepository(repository) {
  // repository sample https://github.com/facebook/react
  return repository.replace("https://github.com/", "");
}

async function getLastCommit(repo) {
  const ghRes = await ghRequest(`https://api.github.com/repos/${repo}/commits`);
  const ghData = await ghRes.json();
  const date = ghData[0].commit.author.date;
  return new Date(date);
}

async function getNumberofContributors(repo) {
  const ghRes = await ghRequest(
    `https://api.github.com/repos/${repo}/contributors?per_page=1&anon=true`
  );

  // <https://api.github.com/repositories/10270250/contributors?per_page=1&anon=true&page=2>; rel="next", <https://api.github.com/repositories/10270250/contributors?per_page=1&anon=true&page=1746>; rel="last"

  const linkHeader = ghRes.headers.get("link");
  const linkHeaderStr = linkHeader
    .split(",")
    .find((link) => link.includes("last"));
  const lastPageUrl = linkHeaderStr.match(/<.*page=(\d+).*>/)[0].slice(1, -1);

  const numberOfContributors = new URLSearchParams(lastPageUrl).get("page");

  return numberOfContributors;
}

async function getLicense(repo) {
  const ghRes = await ghRequest(
    `https://api.github.com/repos/${repo}/community/profile`
  );
  const ghData = await ghRes.json();
  const { files } = ghData;

  if (Object.hasOwn(files, "license")) {
    return JSON.stringify(files.license, null, 2);
  } else {
    return "No license found";
  }
}

export async function getData(pkgName) {
  const pkg = encodeURIComponent(pkgName);
  const repository = await getGithubRepository(pkg);
  const repo = getOwnerAndRepository(repository);
  const lastCommit = await getLastCommit(repo);
  const numberOfContributors = await getNumberofContributors(repo);
  const license = await getLicense(repo);

  const data = {
    repository,
    lastCommit,
    numberOfContributors,
    license,
  };

  return data;
}
