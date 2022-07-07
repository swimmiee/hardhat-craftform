export type RelationType = "Contract";

export interface RelationMetadata {
  craft: () => (new () => any);
  target: Function;
  propertyKey: string;
  relationType: RelationType;
}
