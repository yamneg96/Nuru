import mongoose from "mongoose";
import slugify from "slugify";
import { env } from "./config/env.js";
import { Module } from "./models/Module.js";
import { Article } from "./models/Article.js";
import { Video } from "./models/Video.js";

function toSlug(title: string): string {
  return slugify(title, { lower: true, strict: true });
}

async function seedContent() {
  try {
    console.log("Connecting to MongoDB for content seeding...");
    await mongoose.connect(env.MONGODB_URI);

    // 1. Clear existing content
    console.log("Clearing existing content...");
    await Promise.all([
      Module.deleteMany({}),
      Article.deleteMany({}),
      Video.deleteMany({}),
    ]);

    // 2. Create Modules
    console.log("Seeding Modules...");
    const modules = await Module.create([
      {
        title: "Healthy Relationships",
        slug: toSlug("Healthy Relationships"),
        description: "Understanding consent, boundaries, and mutual respect.",
        icon: "favorite",
        color: "primary",
        order: 1,
        featured: true,
        published: true,
      },
      {
        title: "Puberty & Growth",
        slug: toSlug("Puberty & Growth"),
        description: "What to expect as your body changes.",
        icon: "height",
        color: "secondary",
        order: 2,
        featured: true,
        published: true,
      },
      {
        title: "Contraception Methods",
        slug: toSlug("Contraception Methods"),
        description: "A guide to safe sex and preventing pregnancy.",
        icon: "shield",
        color: "tertiary",
        order: 3,
        featured: false,
        published: true,
      }
    ]);

    const relationshipMod = modules[0];
    const pubertyMod = modules[1];

    // 3. Create Articles
    console.log("Seeding Articles...");
    await Article.create([
      {
        module_id: relationshipMod._id,
        title: "The Pillars of Consent",
        slug: toSlug("The Pillars of Consent"),
        content_markdown: "# Consent\n\nConsent is the most important part of any relationship. It must be:\n\n1. **Freely Given**: No pressure or influence.\n2. **Reversible**: You can change your mind at any time.\n3. **Informed**: You know exactly what is happening.\n4. **Enthusiastic**: It should be a 'hell yes'!",
        summary: "Understanding the FRIES model of consent.",
        badge: "4 min read",
        image_url: "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=800",
        order: 1,
        published: true,
      },
      {
        module_id: relationshipMod._id,
        title: "Spotting Red Flags",
        slug: toSlug("Spotting Red Flags"),
        content_markdown: "# Red Flags\n\nWatch out for these signs in a relationship:\n\n* **Isolation**: They try to keep you away from friends.\n* **Jealousy**: Constant questioning of your whereabouts.\n* **Control**: Dictating what you wear or who you talk to.",
        summary: "How to identify unhealthy behavior early on.",
        badge: "3 min read",
        image_url: "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=800",
        order: 2,
        published: true,
      },
      {
        module_id: pubertyMod._id,
        title: "Skin Care during Puberty",
        slug: toSlug("Skin Care during Puberty"),
        content_markdown: "# Puberty and Acne\n\nHormonal changes often lead to breakouts. Here's how to manage it:\n\n1. Wash your face twice a day.\n2. Don't pop pimples.\n3. Stay hydrated.",
        summary: "Managing acne and skin changes.",
        badge: "2 min read",
        image_url: "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=800",
        order: 1,
        published: true,
      }
    ]);

    // 4. Create Videos
    console.log("Seeding Videos...");
    await Video.create([
      {
        module_id: relationshipMod._id,
        title: "Tea and Consent",
        description: "The famous tea analogy for understanding consent.",
        source_type: "youtube",
        source_url: "https://www.youtube.com/watch?v=pZwvrxVavnQ",
        duration: "2:50",
        order: 1,
        published: true,
      },
      {
        module_id: pubertyMod._id,
        title: "How Puberty Works",
        description: "An animated guide to the changes in your body.",
        source_type: "youtube",
        source_url: "https://www.youtube.com/watch?v=uFekBQ18CXU",
        duration: "5:15",
        order: 1,
        published: true,
      }
    ]);

    console.log("✅ Content seeded successfully!");
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Content seeding failed:", error);
    process.exit(1);
  }
}

seedContent();
