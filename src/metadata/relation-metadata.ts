export type RelationType = "Contract";

export interface RelationMetadata {
  craft: (type?: any) => Function;
  target: Function;
  propertyKey: string;
  relationType: RelationType;
}
