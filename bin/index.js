#!/usr/bin/env node
import { hideBin } from "yargs/helpers";
import yargs from "yargs/yargs";

import { getData } from "../src/getData.js";

const argv = yargs(hideBin(process.argv)).argv;

const pkg = argv.pkg;

const {
  repository,
  lastCommit,
  numberOfContributors,
  numberOfCommits,
  license,
} = await getData(pkg);

console.log(`Repository: ${repository}
Last commit: ${lastCommit}
Number of contributors: ${numberOfContributors}
Number of commits: ${numberOfCommits}
License: ${license}`);
