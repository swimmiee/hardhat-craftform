import { ClassType } from "../types";

export interface CraftMetadata {
  contractName: string;
  target: ClassType<any> | Function;
}
