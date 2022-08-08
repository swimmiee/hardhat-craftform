import { ClassType } from "../types";

export interface ConfigMetadata {
  contract: string;
  target: ClassType<any>;
}
