import { logger } from "../../../utils/logger.js";
// later: import Professional model

export const escalateToHuman = async (
  userId: string,
  context: string
) => {
  try {
    logger.info(
      { userId, context },
      "Escalation triggered (doctor/support)"
    );

    // TODO:
    // 1. Save to DB
    // 2. Notify admin/doctor
    // 3. Create appointment / ticket

  } catch (err) {
    logger.error(err, "Escalation failed");
  }
};