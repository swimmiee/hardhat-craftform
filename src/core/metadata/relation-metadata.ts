import { ClassType } from "../types";

export type RelationType = "Contract";

export interface RelationMetadata {
  target: ClassType<any>;
  relatedConfig: ClassType<any>;
  propertyKey: string;
  relationType: RelationType;
}
