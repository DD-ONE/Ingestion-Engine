import fetch from "node-fetch";

async function getGithubRepository(pkg) {
  const ghRes = await fetch(`https://api.npms.io/v2/package/${pkg}`);
  const ghData = await ghRes.json();
  return ghData.collected.metadata.links.repository;
}

async function getLastCommit(repository) {
  // repository sample https://github.com/facebook/react
  const repo = repository.replace("https://github.com/", "");
  const ghRes = await fetch(`https://api.github.com/repos/${repo}/commits`);
  const ghData = await ghRes.json();
  const date = ghData[0].commit.author.date;
  return new Date(date);
}

async function getNumberofContributors(repository) {
  // repository sample https://github.com/facebook/react
  const repo = repository.replace("https://github.com/", "");
  const ghRes = await fetch(
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

export async function getData(pkgName) {
  const pkg = encodeURIComponent(pkgName);
  const repository = await getGithubRepository(pkg);
  const lastCommit = await getLastCommit(repository);
  const numberOfContributors = await getNumberofContributors(repository);

  const data = {
    repository,
    lastCommit,
    numberOfContributors,
  };

  return data;
}
