import { DataAPIClient } from "@datastax/astra-db-ts";
import OpenAI from "openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import "dotenv/config";
import * as fs from "fs";
import * as path from "path";

type SimilarityMetric = "cosine" | "euclidean" | "dot_product";

const {
  ASTRA_DB_NAMESPACE,
  ASTRA_DB_COLLECTION,
  ASTRA_DB_API_ENDPOINT,
  ASTRA_DB_APPLICATION_TOKEN,
  OPENAI_API_KEY,
} = process.env;

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);
const db = client.db(ASTRA_DB_API_ENDPOINT!, { namespace: ASTRA_DB_NAMESPACE });

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 512,
  chunkOverlap: 100,
});

/** Load MHDTech company data from JSON and convert to plain text chunks */
const loadMHDTechData = (): string => {
  const dataPath = path.join(__dirname, "../app/data/mhdtech.json");
  const raw = fs.readFileSync(dataPath, "utf-8");
  const data = JSON.parse(raw);

  // Flatten the JSON into readable text chunks
  const lines: string[] = [];

  // Company info
  const c = data.company;
  lines.push(`Company: ${c.name}. ${c.tagline}. ${c.about}`);
  lines.push(`Location: ${c.headquarters}. Phone: ${c.phone}. Email: ${c.email}.`);
  lines.push(`Website: ${c.website}. Working Hours: ${c.working_hours}.`);

  // Products
  for (const p of data.products) {
    lines.push(`Product: ${p.name} (${p.category}). ${p.description}. Features: ${p.features.join(", ")}.`);
    lines.push(`Pricing for ${p.name}: ${JSON.stringify(p.price)}`);
  }

  // Pricing plans
  for (const plan of data.pricing_plans) {
    lines.push(`Plan: ${plan.name}. ${plan.description}. Price: ${JSON.stringify(plan.price)}. Includes: ${plan.includes.join(", ")}.`);
  }

  // FAQ
  for (const item of data.faq) {
    lines.push(`FAQ - Q: ${item.question} A: ${item.answer}`);
  }

  // Policies
  const pol = data.policies;
  lines.push(`Refund Policy: ${pol.refund_policy.details.join(". ")}`);
  lines.push(`Privacy Policy: ${pol.privacy_policy.details.join(". ")}`);
  lines.push(`Terms of Service: ${pol.terms_of_service.key_points.join(". ")}`);
  lines.push(`Warranty: Software: ${pol.warranty.software} Custom Dev: ${pol.warranty.custom_development}`);

  // Support
  for (const s of data.support_channels) {
    lines.push(`Support - ${s.channel}: ${s.contact}. Hours: ${s.hours}. Available for: ${s.availability}.`);
  }

  return lines.join("\n\n");
};

const createCollection = async (
  similarityMetric: SimilarityMetric = "dot_product"
) => {
  try {
    const res = await db.createCollection(ASTRA_DB_COLLECTION!, {
      vector: {
        dimension: 1536,
        metric: similarityMetric,
      },
    });
    console.log("✅ Collection created:", res);
  } catch (err: any) {
    if (err?.message?.includes("already exists")) {
      console.log("ℹ️  Collection already exists, skipping creation.");
    } else {
      throw err;
    }
  }
};

const loadData = async () => {
  const collection = await db.collection(ASTRA_DB_COLLECTION!);
  console.log("📄 Loading MHDTech data from JSON...");

  const content = loadMHDTechData();
  const chunks = await splitter.splitText(content);

  console.log(`📦 Splitting into ${chunks.length} chunks...`);

  for (const [i, chunk] of chunks.entries()) {
    const embedding = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: chunk,
      encoding_format: "float",
    });

    const vector = embedding.data[0].embedding;
    const res = await collection.insertOne({
      text: chunk,
      $vector: vector,
    });

    console.log(`✅ Inserted chunk ${i + 1}/${chunks.length}:`, res);
  }

  console.log("🎉 Database seeded successfully with MHDTech data!");
};

createCollection().then(() => {
  loadData();
}).catch(console.error);
