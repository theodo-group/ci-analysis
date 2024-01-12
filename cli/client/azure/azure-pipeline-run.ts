import { AzurePipeline } from "./azure-pipeline";

export interface AzurePipelineRun {
  id: number;
  name: string;
  state: string;
  result: string;
  createdDate: string;
  pipeline: AzurePipeline;
}
