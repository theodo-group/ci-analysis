import { ProviderRepositoryInformation } from "../../model/provider-repository-information";
import { Workflow } from "../../model/workflow";
import { ProviderClientInterface } from "../provider-client-interface";
import axios from "axios";

export class GithubClient implements ProviderClientInterface {
  async getWorkflows(
    providerRepositoryInformation: ProviderRepositoryInformation
  ): Promise<Workflow[]> {
    const headers = {
      Authorization: `token ${providerRepositoryInformation.token}`,
    };
    const { data } = await axios.get<{ workflow: Workflow[] }>(
      `https://api.github.com/repos/${providerRepositoryInformation.owner}/${providerRepositoryInformation.repo}/actions/runs`,
      {
        headers,
        params: {
          per_page: 100,
          page: 1,
        },
      }
    );
    return data.workflow;
  }
}
