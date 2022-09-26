import fetch from "node-fetch";

async function getGithubRepository(pkg) {
  const ghRes = await fetch(`https://api.npms.io/v2/package/${pkg}`);
  const ghData = await ghRes.json();
  return ghData.collected.metadata.links.repository;
}

export async function getData(pkg) {
  const repository = await getGithubRepository(pkg);

  const data = {
    repository,
  };

  return data;
}
