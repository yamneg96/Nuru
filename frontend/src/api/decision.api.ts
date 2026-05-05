import api from "./client"
import type {
  DecisionStartResponse,
  DecisionStepResponse,
  DecisionResult,
  DecisionAnalysis,
  DecisionOptionItem,
  DecisionResourceCategory,
  DecisionReferralResult,
  FlowType,
} from "@/types"

export async function startFlow(
  flowType: FlowType
): Promise<DecisionStartResponse> {
  const { data } = await api.post<DecisionStartResponse>("/decision/start", {
    flow_type: flowType,
  })
  return data
}

export async function submitStep(
  sessionId: string,
  answer: string | string[]
): Promise<DecisionStepResponse> {
  const { data } = await api.post<DecisionStepResponse>("/decision/step", {
    session_id: sessionId,
    answer,
  })
  return data
}

export async function getResult(sessionId: string): Promise<DecisionResult> {
  const { data } = await api.get<DecisionResult>(
    `/decision/result/${sessionId}`
  )
  return data
}

export async function analyzeDecision(
  situationType: FlowType,
  context?: string,
  sessionId?: string
): Promise<DecisionAnalysis> {
  const { data } = await api.post<DecisionAnalysis>("/decision/analyze", {
    situation_type: situationType,
    context,
    session_id: sessionId,
  })
  return data
}

export async function getDecisionOptions(): Promise<DecisionOptionItem[]> {
  const { data } = await api.get<DecisionOptionItem[]>("/decision/options")
  return data
}

export async function getDecisionResources(
  situationType?: string
): Promise<DecisionResourceCategory[]> {
  const { data } = await api.get<DecisionResourceCategory[]>(
    "/decision/resources",
    { params: situationType ? { situation_type: situationType } : undefined }
  )
  return data
}

export async function createReferral(
  situationType: FlowType,
  preferredType?: string,
  specialization?: string
): Promise<DecisionReferralResult> {
  const { data } = await api.post<DecisionReferralResult>(
    "/decision/referral",
    {
      situation_type: situationType,
      preferred_type: preferredType,
      specialization,
    }
  )
  return data
}
