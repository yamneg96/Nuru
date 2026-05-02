import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { v4 as uuidv4 } from "uuid";
import { User } from "../src/models/User";
import { ChatLog } from "../src/models/ChatLog";
import { DecisionSession } from "../src/models/DecisionSession";
import { UserProgress } from "../src/models/UserProgress";
import { findOrCreateUser, hashEmail } from "../src/services/auth.service";

describe("Anonymous-to-User Migration Logic", () => {
  const testEmail = "migration_test@nuru.app";
  const emailHash = hashEmail(testEmail);
  
  let permanentUserAnonymousId: string;
  let tempAnonymousId: string;

  beforeAll(async () => {
    const { connectDB } = await import("../src/config/db.js");
    await connectDB();
    
    // Clean up before starting
    await User.deleteMany({ email_hash: emailHash });
    await ChatLog.deleteMany({});
    await DecisionSession.deleteMany({});
    await UserProgress.deleteMany({});
  });

  afterAll(async () => {
    await User.deleteMany({ email_hash: emailHash });
    await ChatLog.deleteMany({});
    await DecisionSession.deleteMany({});
    await UserProgress.deleteMany({});
  });

  it("Scenario A: Upgrades a temporary user to a permanent user (Brand New Signup)", async () => {
    // 1. Create a temporary user
    tempAnonymousId = uuidv4();
    const tempUser = await User.create({
      anonymous_id: tempAnonymousId,
      role: "user",
      preferences: { language: "english", save_history: true },
    });

    // 2. Give them some chat history
    await ChatLog.create({
      anonymous_id: tempAnonymousId,
      conversation_id: uuidv4(),
      messages: [{ role: "user", content: "Hello", timestamp: new Date() }],
    });

    // 3. User signs in with Google (calls findOrCreateUser with their temp ID)
    const user = await findOrCreateUser(emailHash, tempAnonymousId);

    // Assertions
    expect(user).toBeDefined();
    expect(user.email_hash).toBe(emailHash);
    expect(user.anonymous_id).toBe(tempAnonymousId); // ID should NOT change

    // Ensure the chat log is still linked to the same ID
    const logs = await ChatLog.find({ anonymous_id: tempAnonymousId });
    expect(logs.length).toBe(1);

    // Save for Scenario B
    permanentUserAnonymousId = user.anonymous_id!;
  });

  it("Scenario B: Merges a new temporary user's data into an existing permanent account", async () => {
    // 1. Create a new temporary user on a "new device"
    const newDeviceAnonymousId = uuidv4();
    await User.create({
      anonymous_id: newDeviceAnonymousId,
      role: "user",
      preferences: { language: "oromo", save_history: true },
    });

    // 2. Give them some decision session history on the new device
    await DecisionSession.create({
      session_id: uuidv4(),
      anonymous_id: newDeviceAnonymousId,
      flow_type: "relationship",
      steps: [],
      current_step: 0,
      total_steps: 5,
      completed: false,
    });

    // 3. User signs in with Google on the new device (calls findOrCreateUser with the new device ID)
    const user = await findOrCreateUser(emailHash, newDeviceAnonymousId);

    // Assertions
    expect(user).toBeDefined();
    expect(user.anonymous_id).toBe(permanentUserAnonymousId); // Should return the permanent ID!

    // Ensure the decision session was moved to the permanent ID
    const sessionsForPermanent = await DecisionSession.find({ anonymous_id: permanentUserAnonymousId });
    expect(sessionsForPermanent.length).toBe(1);

    // Ensure the temporary account was deleted
    const ghostUser = await User.findOne({ anonymous_id: newDeviceAnonymousId });
    expect(ghostUser).toBeNull();
  });

  it("Scenario C: Regular login/signup works perfectly when no previousAnonymousId is provided", async () => {
    // A fresh user signs in with Google on a browser that has no anonymous ID
    const freshEmail = "fresh_user@nuru.app";
    const freshHash = hashEmail(freshEmail);

    const user = await findOrCreateUser(freshHash);

    // Assertions
    expect(user).toBeDefined();
    expect(user.email_hash).toBe(freshHash);
    expect(user.anonymous_id).toBeDefined();

    // If they log in again, they should get the same user
    const returningUser = await findOrCreateUser(freshHash);
    expect(returningUser._id.toString()).toBe(user._id.toString());
    expect(returningUser.anonymous_id).toBe(user.anonymous_id);
  });
});
