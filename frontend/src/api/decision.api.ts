import api from "./client"
import type {
  DecisionStartResponse,
  DecisionStepResponse,
  DecisionResult,
  FlowType,
} from "@shared/types"

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
