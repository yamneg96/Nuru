import { v4 as uuidv4 } from "uuid";
import { DecisionSession } from "../models/DecisionSession.js";
import { generateResponse } from "./ai.service.js";

// ── Flow Definitions ─────────────────────────────────────────

interface FlowQuestion {
  id: string;
  text: string;
  subtitle?: string;
  type: "single_choice" | "multiple_choice";
  options: { value: string; label: string; icon?: string }[];
}

const FLOWS: Record<string, { questions: FlowQuestion[]; computeResult: (answers: Record<string, string | string[]>) => { risk_level: "low" | "moderate" | "high"; summary: string; advice: string[]; next_steps: { title: string; description: string; icon: string; action: string; action_type: string }[]; ai_explanation?: string; } }> = {
  missed_period: {
    questions: [
      {
        id: "last_period",
        text: "When was the first day of your last period?",
        type: "single_choice",
        options: [
          { value: "within_4", label: "Within the last 4 weeks" },
          { value: "4_6_weeks", label: "4-6 weeks ago" },
          { value: "more_than_6", label: "More than 6 weeks ago" },
          { value: "not_sure", label: "I'm not sure" },
        ],
      },
      {
        id: "symptoms",
        text: "Are you experiencing any symptoms?",
        subtitle: "Select all that apply",
        type: "multiple_choice",
        options: [
          { value: "nausea", label: "Nausea", icon: "sick" },
          { value: "fatigue", label: "Fatigue", icon: "bedtime" },
          { value: "sore_breasts", label: "Sore breasts", icon: "favorite" },
          { value: "none", label: "None", icon: "do_not_disturb_on" },
        ],
      },
      {
        id: "sexual_activity",
        text: "Have you been sexually active in the last 2 months?",
        type: "single_choice",
        options: [
          { value: "yes_unprotected", label: "Yes, without protection" },
          { value: "yes_protected", label: "Yes, with protection" },
          { value: "no", label: "No" },
          { value: "prefer_not_say", label: "Prefer not to say" },
        ],
      },
      {
        id: "stress_level",
        text: "Have you experienced unusual stress recently?",
        type: "single_choice",
        options: [
          { value: "high_stress", label: "Yes, a lot of stress" },
          { value: "some_stress", label: "Some stress" },
          { value: "no_stress", label: "Not really" },
        ],
      },
    ],
    computeResult: (answers) => {
      let riskScore = 0;

      // Period timing
      if (answers.last_period === "more_than_6") riskScore += 3;
      else if (answers.last_period === "4_6_weeks") riskScore += 2;
      else if (answers.last_period === "not_sure") riskScore += 2;

      // Symptoms
      const symptoms = Array.isArray(answers.symptoms) ? answers.symptoms : [];
      if (symptoms.includes("nausea")) riskScore += 2;
      if (symptoms.includes("fatigue")) riskScore += 1;
      if (symptoms.includes("sore_breasts")) riskScore += 2;

      // Sexual activity
      if (answers.sexual_activity === "yes_unprotected") riskScore += 4;
      else if (answers.sexual_activity === "yes_protected") riskScore += 1;

      // Stress
      if (answers.stress_level === "high_stress") riskScore -= 1;

      const risk_level: "low" | "moderate" | "high" = riskScore >= 7 ? "high" : riskScore >= 4 ? "moderate" : "low";

      const advice: string[] = [];
      const next_steps: { title: string; description: string; icon: string; action: string; action_type: string }[] = [];

      if (risk_level === "high") {
        advice.push(
          "Based on your answers, it may be worth taking a pregnancy test.",
          "A missed period combined with symptoms and unprotected activity suggests you should seek guidance.",
          "Remember — whatever the result, you have options and support available."
        );
        next_steps.push(
          { title: "Learn about tests", description: "How and when to take a home test", icon: "science", action: "/explore", action_type: "navigate" },
          { title: "Find nearby clinic", description: "Youth-friendly clinics near you", icon: "location_on", action: "/services", action_type: "navigate" },
          { title: "Talk to someone", description: "Anonymous chat with a counselor", icon: "chat_bubble", action: "/chat", action_type: "navigate" }
        );
      } else if (risk_level === "moderate") {
        advice.push(
          "Your situation could have several explanations.",
          "Stress, lifestyle changes, and hormonal shifts are common causes of irregular periods.",
          "If your period doesn't return within a week or two, consider taking a test or visiting a clinic."
        );
        next_steps.push(
          { title: "Learn about tests", description: "When testing makes sense", icon: "science", action: "/explore", action_type: "navigate" },
          { title: "Stress & lifestyle", description: "How stress affects your cycle", icon: "self_improvement", action: "/explore", action_type: "navigate" },
          { title: "Talk to Nuru", description: "Get personalized guidance", icon: "chat", action: "/chat", action_type: "navigate" }
        );
      } else {
        advice.push(
          "Based on your answers, your missed period is likely due to normal variations.",
          "Stress, diet, exercise, and sleep changes can all affect your cycle.",
          "Keep tracking and don't hesitate to seek help if you're worried."
        );
        next_steps.push(
          { title: "Track your cycle", description: "Understanding your body's patterns", icon: "calendar_month", action: "/explore", action_type: "navigate" },
          { title: "Self-care tips", description: "Managing stress and wellness", icon: "spa", action: "/explore", action_type: "navigate" }
        );
      }

      return {
        risk_level,
        summary:
          risk_level === "high"
            ? "Your answers suggest a higher possibility. We recommend taking the next step."
            : risk_level === "moderate"
              ? "There are several possibilities. Let's explore them together."
              : "Your situation looks manageable. Here are some helpful resources.",
        advice,
        next_steps,
      };
    },
  },
  relationship_pressure: {
    questions: [
      {
        id: "pressure_type",
        text: "What kind of pressure are you experiencing?",
        type: "single_choice",
        options: [
          { value: "sexual", label: "Sexual pressure" },
          { value: "emotional", label: "Emotional manipulation" },
          { value: "physical", label: "Physical intimidation" },
          { value: "other", label: "Something else" },
        ],
      },
      {
        id: "safety",
        text: "Do you feel safe right now?",
        type: "single_choice",
        options: [
          { value: "yes", label: "Yes, I feel safe" },
          { value: "mostly", label: "Mostly, but worried" },
          { value: "no", label: "No, I don't feel safe" },
        ],
      },
    ],
    computeResult: (answers) => {
      const isUnsafe = answers.safety === "no";
      const risk_level: "low" | "moderate" | "high" = isUnsafe ? "high" : answers.safety === "mostly" ? "moderate" : "low";

      return {
        risk_level,
        summary: isUnsafe
          ? "Your safety is the most important thing. Please reach out for help immediately."
          : "You deserve to feel safe and respected in any relationship.",
        advice: [
          "No one has the right to pressure you into anything you're not comfortable with.",
          "Setting boundaries is healthy and shows self-respect.",
          isUnsafe ? "Please contact a trusted adult or emergency helpline right away." : "Consider talking to someone you trust about what you're experiencing.",
        ],
        next_steps: [
          { title: "Talk to someone", description: "Anonymous, confidential chat", icon: "chat_bubble", action: "/chat", action_type: "navigate" },
          { title: "Find help nearby", description: "Counseling services near you", icon: "location_on", action: "/services", action_type: "navigate" },
          { title: "Learn about boundaries", description: "Understanding healthy relationships", icon: "favorite", action: "/explore", action_type: "navigate" },
        ],
      };
    },
  },
  contraception: {
    questions: [
      {
        id: "current_method",
        text: "Are you currently using any method of contraception?",
        type: "single_choice",
        options: [
          { value: "yes_consistent", label: "Yes, consistently" },
          { value: "yes_inconsistent", label: "Yes, but sometimes I forget" },
          { value: "no", label: "No, I'm not using any" },
        ],
      },
      {
        id: "goal",
        text: "What is your main goal right now?",
        type: "single_choice",
        options: [
          { value: "prevent_pregnancy", label: "Prevent pregnancy" },
          { value: "sti_protection", label: "Protect against STIs" },
          { value: "both", label: "Both pregnancy and STI protection" },
          { value: "learn", label: "Just want to learn my options" },
        ],
      },
    ],
    computeResult: (answers) => {
      let riskScore = 0;
      if (answers.current_method === "no") riskScore += 3;
      if (answers.current_method === "yes_inconsistent") riskScore += 2;
      
      const risk_level = riskScore >= 3 ? "high" : riskScore >= 2 ? "moderate" : "low";
      
      const summary = risk_level === "high" 
        ? "It looks like you could benefit from learning about reliable contraception options."
        : "You're taking good steps, but there might be more suitable or reliable methods for you.";
        
      const advice = [
        "Finding the right contraception method is a personal choice.",
        "Condoms are the only method that protect against both pregnancy and STIs.",
        "Long-acting reversible contraceptives (LARCs) like implants or IUDs are very effective and easy to use."
      ];
      
      return {
        risk_level,
        summary,
        advice,
        next_steps: [
          { title: "Explore Methods", description: "Compare different options", icon: "search", action: "/explore", action_type: "navigate" },
          { title: "Find a Clinic", description: "Talk to a healthcare provider", icon: "local_hospital", action: "/services", action_type: "navigate" },
          { title: "Chat with Nuru", description: "Get personalized advice", icon: "chat", action: "/chat", action_type: "navigate" }
        ],
      };
    },
  },
};

// ── Service Functions ────────────────────────────────────────

export async function startDecisionFlow(anonymousId: string, flowType: string) {
  const flow = FLOWS[flowType];
  if (!flow) throw new Error(`Unknown flow type: ${flowType}`);

  const session = await DecisionSession.create({
    session_id: uuidv4(),
    anonymous_id: anonymousId,
    flow_type: flowType,
    steps: [],
    current_step: 0,
    total_steps: flow.questions.length,
    completed: false,
  });

  return {
    session_id: session.session_id,
    flow_type: flowType,
    current_step: 0,
    total_steps: flow.questions.length,
    question: flow.questions[0],
  };
}

export async function submitDecisionStep(sessionId: string, answer: string | string[]) {
  const session = await DecisionSession.findOne({ session_id: sessionId });
  if (!session) throw new Error("Session not found");
  if (session.completed) throw new Error("Session already completed");

  const flow = FLOWS[session.flow_type];
  if (!flow) throw new Error("Invalid flow type");

  const currentQuestion = flow.questions[session.current_step];
  session.steps.push({
    question_id: currentQuestion.id,
    answer,
    timestamp: new Date(),
  });
  session.current_step += 1;

  if (session.current_step >= session.total_steps) {
    // Compute result
    const answerMap: Record<string, string | string[]> = {};
    for (const step of session.steps) {
      answerMap[step.question_id] = step.answer;
    }
    const result = flow.computeResult(answerMap);
    session.risk_level = result.risk_level;
    session.completed = true;

    // Try to get AI explanation
    try {
      const aiPrompt = `A young person answered a health assessment about "${session.flow_type}". Their risk level is "${result.risk_level}". Summary: "${result.summary}". Please provide a brief, supportive, culturally sensitive explanation in 2-3 sentences. Do NOT provide medical diagnosis.`;
      const aiExplanation = await generateResponse(aiPrompt);
      result.ai_explanation = aiExplanation;
    } catch {
      // AI explanation is optional
    }

    session.result = result;
    await session.save();

    return { session_id: sessionId, current_step: session.current_step, total_steps: session.total_steps, completed: true };
  }

  await session.save();
  return {
    session_id: sessionId,
    current_step: session.current_step,
    total_steps: session.total_steps,
    question: flow.questions[session.current_step],
    completed: false,
  };
}

export async function getDecisionResult(sessionId: string) {
  const session = await DecisionSession.findOne({ session_id: sessionId });
  if (!session) throw new Error("Session not found");
  if (!session.completed) throw new Error("Session not yet completed");

  return {
    session_id: session.session_id,
    flow_type: session.flow_type,
    risk_level: session.risk_level,
    ...session.result,
  };
}
