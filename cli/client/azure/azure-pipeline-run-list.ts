import { AzurePipelineRun } from "./azure-pipeline-run";

export interface AzurePipelineRunList {
  count: number;
  value: AzurePipelineRun[];
}
