export const VALID_FLOW_TYPES = [
  "missed_period",
  "relationship_pressure",
  "contraception",
  "sti_risk",
  "pregnancy_options",
  "mental_health_support"
] as const;

export type FlowType = (typeof VALID_FLOW_TYPES)[number];
