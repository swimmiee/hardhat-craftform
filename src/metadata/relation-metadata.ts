import { ClassType } from "../craftform/class/interfaces";

export type RelationType = "Contract";

export interface RelationMetadata {
  target: ClassType<any> | Function;
  relatedConfig: ClassType<any>;
  propertyKey: string;
  relationType: RelationType;
}
