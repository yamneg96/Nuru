import { detectIntent } from "./intent.service.js";
import { generateResponse } from "./response.service.js";
import { escalateToHuman } from "./escalation.service.js";
import { logger } from "../../../utils/logger.js";

interface RouteMessageInput {
  text: string;
  userId: string;
  platform: string;
}

export const routeMessage = async ({
  text,
  userId,
  platform,
}: RouteMessageInput): Promise<string> => {
  try {
    const intent = await detectIntent(text);

    if (intent === "DOCTOR") {
      await escalateToHuman(userId, text);
    }

    const response = await generateResponse(intent);

    logger.info(
      { userId, platform, intent },
      "Message processed"
    );

    return response;
  } catch (err) {
    logger.error(err, "Message routing failed");
    return "⚠️ Something went wrong.";
  }
};