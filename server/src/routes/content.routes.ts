import { Router, type Request, type Response, type NextFunction } from "express";
import { z } from "zod";
import slugify from "slugify";
import { authMiddleware, isAdmin } from "../middleware/auth.middleware.js";
import { Module } from "../models/Module.js";
import { Article } from "../models/Article.js";
import { Video } from "../models/Video.js";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

export const contentRoutes = Router();

// ── Slug helper ────────────────────────────────────────────────────────────────
function toSlug(title: string): string {
  return slugify(title, { lower: true, strict: true });
}

// ── Validation Helpers ─────────────────────────────────────────────────────────
const coerceBool = z.preprocess((v) => v === "true" || v === true || v === 1 || v === "1", z.boolean());
const coerceNumber = z.coerce.number();
const optionalStr = z.string().optional().transform((v) => (v === "" ? undefined : v));

// ── Validation Schemas ─────────────────────────────────────────────────────────
const moduleBaseSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  icon: z.string().min(1),
  color: z.enum(["primary", "secondary", "tertiary"]),
  order: coerceNumber.int(),
  featured: coerceBool,
  published: coerceBool,
  content_markdown: optionalStr,
});

const moduleCreateSchema = moduleBaseSchema.extend({
  color: moduleBaseSchema.shape.color.default("primary"),
  order: moduleBaseSchema.shape.order.default(0),
  featured: coerceBool.default(false),
  published: coerceBool.default(false),
  content_markdown: optionalStr.default(""),
});

const moduleUpdateSchema = moduleBaseSchema.partial();

const articleBaseSchema = z.object({
  module_id: z.string().min(1, "module_id is required"),
  title: z.string().min(1),
  content_markdown: z.string().min(1),
  summary: z.string().min(1),
  badge: optionalStr,
  image_url: optionalStr,
  video_id: optionalStr,
  order: coerceNumber.int(),
  published: coerceBool,
});

const articleCreateSchema = articleBaseSchema.extend({
  badge: optionalStr.default(""),
  image_url: optionalStr.default(""),
  video_id: optionalStr.default(""),
  order: articleBaseSchema.shape.order.default(0),
  published: coerceBool.default(false),
});

const articleUpdateSchema = articleBaseSchema.partial();

const videoBaseSchema = z.object({
  module_id: z.string().min(1, "module_id is required"),
  title: z.string().min(1),
  description: z.string(),
  source_type: z.enum(["youtube", "local"]),
  source_url: z.string().min(1),
  thumbnail_url: z.string(),
  duration: z.string(),
  order: coerceNumber.int(),
  published: coerceBool,
});

const videoCreateSchema = videoBaseSchema.extend({
  description: videoBaseSchema.shape.description.default(""),
  source_type: videoBaseSchema.shape.source_type.default("youtube"),
  thumbnail_url: videoBaseSchema.shape.thumbnail_url.default(""),
  duration: videoBaseSchema.shape.duration.default(""),
  order: videoBaseSchema.shape.order.default(0),
  published: videoBaseSchema.shape.published.default(false),
});

const videoUpdateSchema = videoBaseSchema.partial();

// ══════════════════════════════════════════════════════════════════════════════
// MODULE ROUTES
// ══════════════════════════════════════════════════════════════════════════════

/**
 * @swagger
 * /api/v1/content/modules:
 *   get:
 *     summary: List published modules
 *     description: Returns all published modules with article and video counts.
 *     tags: [Content - Modules]
 *     responses:
 *       200:
 *         description: List of modules
 */
contentRoutes.get("/modules", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const modules = await Module.find({ published: true }).sort({ order: 1, created_at: -1 });

    // Attach article and video counts
    const withCounts = await Promise.all(
      modules.map(async (mod) => {
        const [articleCount, videoCount] = await Promise.all([
          Article.countDocuments({ module_id: mod._id, published: true }),
          Video.countDocuments({ module_id: mod._id, published: true }),
        ]);
        return { ...mod.toObject(), article_count: articleCount, video_count: videoCount };
      })
    );

    res.json({ data: withCounts });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/content/modules/all:
 *   get:
 *     summary: List all modules (admin)
 *     description: Returns all modules including drafts. Admin only.
 *     tags: [Content - Modules]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all modules including drafts
 *       403:
 *         description: Forbidden
 */
contentRoutes.get("/modules/all", authMiddleware, isAdmin, async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const modules = await Module.find().sort({ order: 1, created_at: -1 });
    const withCounts = await Promise.all(
      modules.map(async (mod) => {
        const [articleCount, videoCount] = await Promise.all([
          Article.countDocuments({ module_id: mod._id }),
          Video.countDocuments({ module_id: mod._id }),
        ]);
        return { ...mod.toObject(), article_count: articleCount, video_count: videoCount };
      })
    );
    res.json({ data: withCounts });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/content/modules/{slug}:
 *   get:
 *     summary: Get module detail
 *     description: Returns a module with its published articles and videos.
 *     tags: [Content - Modules]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Module with content
 *       404:
 *         description: Module not found
 */
contentRoutes.get("/modules/:slug", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const mod = await Module.findOne({ slug: req.params.slug, published: true });
    if (!mod) {
      return res.status(404).json({ error: { code: "NOT_FOUND", message: "Module not found" } });
    }

    const [articles, videos] = await Promise.all([
      Article.find({ module_id: mod._id, published: true }).sort({ order: 1 }),
      Video.find({ module_id: mod._id, published: true }).sort({ order: 1 }),
    ]);

    res.json({ data: { ...mod.toObject(), articles, videos } });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/content/modules:
 *   post:
 *     summary: Create a module (admin)
 *     tags: [Content - Modules]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description, icon]
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               icon: { type: string }
 *               color: { type: string, enum: [primary, secondary, tertiary] }
 *               order: { type: integer }
 *               featured: { type: boolean }
 *               published: { type: boolean }
 *     responses:
 *       201:
 *         description: Module created
 *       403:
 *         description: Forbidden
 */
contentRoutes.post("/modules", authMiddleware, isAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = moduleCreateSchema.parse(req.body);
    const slug = toSlug(data.title);

    const mod = await Module.create({ ...data, slug });
    res.status(201).json({ data: mod });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/content/modules/{id}:
 *   put:
 *     summary: Update a module (admin)
 *     tags: [Content - Modules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               icon: { type: string }
 *               color: { type: string, enum: [primary, secondary, tertiary] }
 *               order: { type: integer }
 *               featured: { type: boolean }
 *               published: { type: boolean }
 *               content_markdown: { type: string }
 *     responses:
 *       200:
 *         description: Module updated
 *       404:
 *         description: Module not found
 */
contentRoutes.put("/modules/:id", authMiddleware, isAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = moduleUpdateSchema.parse(req.body);
    const update: Record<string, any> = { ...data };
    if (data.title) update.slug = toSlug(data.title);

    const mod = await Module.findByIdAndUpdate(req.params.id, { $set: update }, { new: true });
    if (!mod) {
      return res.status(404).json({ error: { code: "NOT_FOUND", message: "Module not found" } });
    }
    res.json({ data: mod });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/content/modules/{id}:
 *   delete:
 *     summary: Delete a module (admin)
 *     description: Cascades and deletes all articles and videos in this module.
 *     tags: [Content - Modules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Module deleted
 *       404:
 *         description: Module not found
 */
contentRoutes.delete("/modules/:id", authMiddleware, isAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const mod = await Module.findByIdAndDelete(req.params.id);
    if (!mod) {
      return res.status(404).json({ error: { code: "NOT_FOUND", message: "Module not found" } });
    }
    // Cascade delete
    await Promise.all([
      Article.deleteMany({ module_id: mod._id }),
      Video.deleteMany({ module_id: mod._id }),
    ]);
    res.json({ data: { message: "Module and all its content deleted" } });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/content/modules/import:
 *   post:
 *     summary: Import module from Markdown file (admin)
 *     description: Creates or updates a module using a .md file. Metadata fields should be sent as form fields.
 *     tags: [Content - Modules]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [file, title, description, icon]
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The .md file containing the content
 *               title: { type: string }
 *               description: { type: string }
 *               icon: { type: string }
 *               color: { type: string, enum: [primary, secondary, tertiary] }
 *               order: { type: integer }
 *               published: { type: boolean }
 *               featured: { type: boolean }
 *     responses:
 *       201:
 *         description: Module imported
 */
contentRoutes.post("/modules/import", authMiddleware, isAdmin, upload.single("file"), async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const content_markdown = req.file.buffer.toString("utf-8");
    
    // Parse other fields from the body
    const payload = moduleCreateSchema.parse({
      ...req.body,
      content_markdown,
    });

    const slug = toSlug(payload.title);
    const mod = await Module.findOneAndUpdate(
      { slug },
      { $set: { ...payload, slug } },
      { upsert: true, new: true }
    );

    res.status(201).json({ data: mod });
  } catch (error) {
    next(error);
  }
});

// ══════════════════════════════════════════════════════════════════════════════
// ARTICLE ROUTES
// ══════════════════════════════════════════════════════════════════════════════

/**
 * @swagger
 * /api/v1/content/articles:
 *   get:
 *     summary: List articles
 *     description: Returns a list of articles. Can be filtered by module_id.
 *     tags: [Content - Articles]
 *     parameters:
 *       - in: query
 *         name: module_id
 *         schema:
 *           type: string
 *         description: Optional filter by module ID
 *       - in: query
 *         name: all
 *         schema:
 *           type: boolean
 *         description: If true (and admin), returns drafts as well.
 *     responses:
 *       200:
 *         description: List of articles
 */
contentRoutes.get("/articles", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { module_id, all } = req.query;
    const filter: Record<string, any> = {};
    
    if (module_id) filter.module_id = module_id;
    if (all !== "true") filter.published = true;

    const articles = await Article.find(filter)
      .sort({ order: 1, created_at: -1 })
      .populate("module_id", "title slug");
      
    res.json({ data: articles });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/content/articles/{slug}:
 *   get:
 *     summary: Get article by slug
 *     description: Returns a single published article with full markdown content.
 *     tags: [Content - Articles]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Article detail
 *       404:
 *         description: Article not found
 */
contentRoutes.get("/articles/:slug", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const article = await Article.findOne({ slug: req.params.slug, published: true })
      .populate("module_id", "title slug")
      .populate("video_id");
    if (!article) {
      return res.status(404).json({ error: { code: "NOT_FOUND", message: "Article not found" } });
    }
    res.json({ data: article });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/content/articles:
 *   post:
 *     summary: Create an article (admin)
 *     tags: [Content - Articles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [module_id, title, content_markdown, summary]
 *             properties:
 *               module_id: { type: string }
 *               title: { type: string }
 *               content_markdown: { type: string }
 *               summary: { type: string }
 *               badge: { type: string }
 *               image_url: { type: string }
 *               video_id: { type: string, nullable: true }
 *               order: { type: integer }
 *               published: { type: boolean }
 *     responses:
 *       201:
 *         description: Article created
 *       403:
 *         description: Forbidden
 */
contentRoutes.post("/articles", authMiddleware, isAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = articleCreateSchema.parse(req.body);
    const slug = toSlug(data.title);

    const article = await Article.create({ ...data, slug });
    res.status(201).json({ data: article });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/content/articles/{id}:
 *   put:
 *     summary: Update an article (admin)
 *     tags: [Content - Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               module_id: { type: string }
 *               title: { type: string }
 *               content_markdown: { type: string }
 *               summary: { type: string }
 *               badge: { type: string }
 *               image_url: { type: string }
 *               video_id: { type: string, nullable: true }
 *               order: { type: integer }
 *               published: { type: boolean }
 *     responses:
 *       200:
 *         description: Article updated
 *       404:
 *         description: Article not found
 */
contentRoutes.put("/articles/:id", authMiddleware, isAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = articleUpdateSchema.parse(req.body);
    const update: Record<string, any> = { ...data };
    if (data.title) update.slug = toSlug(data.title);

    const article = await Article.findByIdAndUpdate(req.params.id, { $set: update }, { new: true });
    if (!article) {
      return res.status(404).json({ error: { code: "NOT_FOUND", message: "Article not found" } });
    }
    res.json({ data: article });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/content/articles/{id}:
 *   delete:
 *     summary: Delete an article (admin)
 *     tags: [Content - Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Article deleted
 *       404:
 *         description: Article not found
 */
contentRoutes.delete("/articles/:id", authMiddleware, isAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) {
      return res.status(404).json({ error: { code: "NOT_FOUND", message: "Article not found" } });
    }
    res.json({ data: { message: "Article deleted" } });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/content/articles/import:
 *   post:
 *     summary: Import article from Markdown file (admin)
 *     description: Creates or updates an article using a .md file. Metadata fields should be sent as form fields.
 *     tags: [Content - Articles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [file, module_id, title, summary]
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The .md file containing the content
 *               module_id: { type: string }
 *               title: { type: string }
 *               summary: { type: string }
 *               badge: { type: string }
 *               image_url: { type: string }
 *               order: { type: integer }
 *               published: { type: boolean }
 *     responses:
 *       201:
 *         description: Article imported
 */
contentRoutes.post("/articles/import", authMiddleware, isAdmin, upload.single("file"), async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const content_markdown = req.file.buffer.toString("utf-8");

    // Parse other fields from the body
    const payload = articleCreateSchema.parse({
      ...req.body,
      content_markdown,
    });

    const slug = toSlug(payload.title);
    const article = await Article.findOneAndUpdate(
      { slug, module_id: payload.module_id },
      { $set: { ...payload, slug } },
      { upsert: true, new: true }
    );

    res.status(201).json({ data: article });
  } catch (error) {
    next(error);
  }
});

// ══════════════════════════════════════════════════════════════════════════════
// VIDEO ROUTES
// ══════════════════════════════════════════════════════════════════════════════

/**
 * @swagger
 * /api/v1/content/videos:
 *   get:
 *     summary: List videos
 *     description: Returns a list of videos. Can be filtered by module_id.
 *     tags: [Content - Videos]
 *     parameters:
 *       - in: query
 *         name: module_id
 *         schema:
 *           type: string
 *         description: Optional filter by module ID
 *       - in: query
 *         name: all
 *         schema:
 *           type: boolean
 *         description: If true (and admin), returns drafts as well.
 *     responses:
 *       200:
 *         description: List of videos
 */
contentRoutes.get("/videos", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { module_id, all } = req.query;
    const filter: Record<string, any> = {};
    
    if (module_id) filter.module_id = module_id;
    if (all !== "true") filter.published = true;

    const videos = await Video.find(filter)
      .sort({ order: 1, created_at: -1 })
      .populate("module_id", "title slug");
      
    res.json({ data: videos });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/content/videos/{id}:
 *   get:
 *     summary: Get video by ID
 *     tags: [Content - Videos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Video detail
 *       404:
 *         description: Video not found
 */
contentRoutes.get("/videos/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const video = await Video.findOne({ _id: req.params.id, published: true })
      .populate("module_id", "title slug");
    if (!video) {
      return res.status(404).json({ error: { code: "NOT_FOUND", message: "Video not found" } });
    }
    res.json({ data: video });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/content/videos:
 *   post:
 *     summary: Create a video (admin)
 *     tags: [Content - Videos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [module_id, title, source_url]
 *             properties:
 *               module_id: { type: string }
 *               title: { type: string }
 *               description: { type: string }
 *               source_type: { type: string, enum: [youtube, local] }
 *               source_url: { type: string }
 *               thumbnail_url: { type: string }
 *               duration: { type: string }
 *               order: { type: integer }
 *               published: { type: boolean }
 *     responses:
 *       201:
 *         description: Video created
 *       403:
 *         description: Forbidden
 */
contentRoutes.post("/videos", authMiddleware, isAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = videoCreateSchema.parse(req.body);
    const video = await Video.create(data);
    res.status(201).json({ data: video });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/content/videos/{id}:
 *   put:
 *     summary: Update a video (admin)
 *     tags: [Content - Videos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               module_id: { type: string }
 *               title: { type: string }
 *               description: { type: string }
 *               source_type: { type: string, enum: [youtube, local] }
 *               source_url: { type: string }
 *               thumbnail_url: { type: string }
 *               duration: { type: string }
 *               order: { type: integer }
 *               published: { type: boolean }
 *     responses:
 *       200:
 *         description: Video updated
 *       404:
 *         description: Video not found
 */
contentRoutes.put("/videos/:id", authMiddleware, isAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = videoUpdateSchema.parse(req.body);
    const video = await Video.findByIdAndUpdate(req.params.id, { $set: data }, { new: true });
    if (!video) {
      return res.status(404).json({ error: { code: "NOT_FOUND", message: "Video not found" } });
    }
    res.json({ data: video });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/content/videos/{id}:
 *   delete:
 *     summary: Delete a video (admin)
 *     tags: [Content - Videos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Video deleted
 *       404:
 *         description: Video not found
 */
contentRoutes.delete("/videos/:id", authMiddleware, isAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const video = await Video.findByIdAndDelete(req.params.id);
    if (!video) {
      return res.status(404).json({ error: { code: "NOT_FOUND", message: "Video not found" } });
    }
    res.json({ data: { message: "Video deleted" } });
  } catch (error) {
    next(error);
  }
});
