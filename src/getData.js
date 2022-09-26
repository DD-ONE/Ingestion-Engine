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

export async function getData(pkg) {
  const repository = await getGithubRepository(pkg);
  const lastCommit = await getLastCommit(repository);

  const data = {
    repository,
    lastCommit,
  };

  return data;
}
