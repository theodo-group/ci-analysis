import axios from "axios";
import { ProviderRepositoryInformation } from "../../model/provider-repository-information";
import { Workflow } from "../../model/workflow";
import { ProviderClientInterface } from "../provider-client-interface";
import { AzurePipelineList } from "./azure-pipeline-list";
import { AzurePipelineRunList } from "./azure-pipeline-run-list";
import { AzurePipelineRun } from "./azure-pipeline-run";

export class AzureClient implements ProviderClientInterface {
  async getWorkflows(
    providerRepositoryInformation: ProviderRepositoryInformation
  ): Promise<Workflow[]> {
    const headers = {
      Authorization: `Basic ${providerRepositoryInformation.token}`,
    };
    const { data } = await axios.get<AzurePipelineList>(
      `https://dev.azure.com/${providerRepositoryInformation.owner}/${providerRepositoryInformation.repo}/_apis/pipelines`,
      {
        headers,
        params: {
          $top: 100,
        },
      }
    );
    let workflows: Workflow[] = [];
    for (const pipeline of data.value) {
      const pipelineDetails = await this.getPipelineDetails(
        providerRepositoryInformation,
        pipeline.id
      );
      for (const pipelineDetail of pipelineDetails) {
        const workflow = this.mapAzurePipelineRunToWorkflow(pipelineDetail);
        workflows.push(workflow);
      }
    }

    return workflows;
  }

  private async getPipelineDetails(
    providerRepositoryInformation: ProviderRepositoryInformation,
    pipelineId: number
  ): Promise<AzurePipelineRun[]> {
    const headers = {
      Authorization: `Basic ${providerRepositoryInformation.token}`,
    };
    const { data } = await axios.get<AzurePipelineRunList>(
      `https://dev.azure.com/{${providerRepositoryInformation.owner}/${providerRepositoryInformation.repo}/_apis/pipelines/${pipelineId}/runs`,
      {
        headers,
      }
    );
    return data.value;
  }

  private mapAzurePipelineRunToWorkflow(
    azurePipelineRun: AzurePipelineRun
  ): Workflow {
    return {
      id: azurePipelineRun.id,
      jobs_url: "",
      status: azurePipelineRun.state,
      conclusion: azurePipelineRun.result,
      name: azurePipelineRun.name,
      created_at: azurePipelineRun.createdDate,
    };
  }
}
