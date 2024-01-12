import parseArgs from "minimist";
import { GithubClient } from "./client/github/github-client";
import { Workflow } from "./model/workflow";
import { ProviderRepositoryInformation } from "./model/provider-repository-information";
import { AzureClient } from "./client/azure/azure-client";

enum Providers {
  GITHUB = "github",
  AZURE = "azure",
}

interface Job {
  total_count: number;
  workflow: {
    id: number;
    name: string;
  };
  jobs: {
    started_at: string;
    completed_at: string;
    name: string;
    steps: {
      name: string;
      number: number;
      started_at: string;
      completed_at: string;
    }[];
  }[];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface ScriptParameters {
  saveCsv: boolean;
}

interface Config {
  owner: string;
  repo: string;
  token: string;
  max: number;
  provider: string;
}

const getParameters = (): Config => {
  const { owner, repo, token, max, provider } = parseArgs<
    Omit<Config, "max"> & { max: string }
  >(process.argv, {
    alias: { o: "owner", r: "repo", t: "token", m: "max", p: "provider" },
    string: ["owner", "repo", "token", "max"],
    default: { provider: Providers.GITHUB.valueOf() },
  });
  if (
    owner !== "" &&
    repo !== "" &&
    token !== "" &&
    max !== "" &&
    !isNaN(parseInt(max)) &&
    (Object.values(Providers) as string[]).includes(provider)
  ) {
    return { owner, repo, token, max: parseInt(max), provider };
  }
  if (
    provider !== Providers.GITHUB.valueOf() ||
    provider !== Providers.AZURE.valueOf()
  ) {
    throw new Error("Only github and azure are supported for now");
  }
  throw new Error("Missing parameter");
};

const { owner, repo, token, max, provider } = getParameters();
const repositoryInformation: ProviderRepositoryInformation = {
  token,
  owner,
  repo,
};

const MAX_NUMBER_OF_NEW_WORKFLOWS = max;

const doAll = async () => {
  await new Promise((resolve) => setTimeout(resolve, 5000));
  let workflows = new Array<Workflow>();
  switch (provider) {
    case Providers.GITHUB:
      workflows = await new GithubClient().getWorkflows(repositoryInformation);
      break;
    case Providers.AZURE:
      workflows = await new AzureClient().getWorkflows(repositoryInformation);
      break;
    default:
      break;
  }
  console.table(workflows);
};

void doAll();
