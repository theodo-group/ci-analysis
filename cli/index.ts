import parseArgs from 'minimist';

enum Providers {
  GITHUB = 'github',
}

interface Workflow {
  id: number;
  jobs_url: string;
  status: string;
  conclusion: string;
  name: string;
  created_at: string;
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

interface ScriptParameters {
  saveCsv: boolean;
}

const getParameters = (
  env: Record<string, unknown>
): { owner: string, repo: string, token: string, max: number, provider: Providers } => {
  const { owner, repo, token, max, provider } = parseArgs(process.argv, { alias: { o: 'owner', r: 'repo', t: 'token', m: 'max', p: 'provider' }, string: ['owner', 'repo', 'token', 'max'], default: { provider: Providers.GITHUB } });

  if (
    owner !== "" &&
    repo !== "" &&
    token !== "" &&
    max !== "" &&
    !isNaN(parseInt(max)) && 
    Object.values(Providers).includes(provider)
  ) {
    return { owner, repo, token, max: parseInt(max), provider };
  }

  throw new Error("Missing parameter");
};

const { owner, repo, token, max, provider } = getParameters(process.env);

if (provider !== Providers.GITHUB) { 
  throw new Error("Only github is supported for now");
}

const GITHUB_BASE_URL = `https://api.github.com/repos/${owner}/${repo}`;
const DEFAULT_HEADERS = {
  Authorization: `token ${token}`,
};
const MAX_NUMBER_OF_NEW_WORKFLOWS = max;

const doAll = async () => {};

void doAll();