import { ProviderRepositoryInformation } from "../model/provider-repository-information";
import { Workflow } from "../model/workflow";

export interface ProviderClientInterface {
  getWorkflows(
    providerRepositoryInformation: ProviderRepositoryInformation
  ): Promise<Workflow[]>;
}
