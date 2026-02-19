#!/usr/bin/env node

/**
 * validateEnv.mjs
 *
 * Fully robust environment validator for AI App Builder Pro
 * - ES module compatible
 * - Checks required keys
 * - Validates URLs and key formats
 * - Warns if server-only keys are exposed
 * - Color-coded messages
 */

import chalk from "chalk";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

// --------------------
// Required keys
// --------------------
const requiredPublicKeys = [
  "NEXT_PUBLIC_APP_NAME",
  "NEXT_PUBLIC_ENV",
  "NEXT_PUBLIC_BASE_URL",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "NEXT_PUBLIC_AI_API_ENDPOINT",
  "NEXT_PUBLIC_EXPORT_BASE_PATH",
];

const requiredServerKeys = [
  "SUPABASE_SERVICE_ROLE_KEY",
  "OPENAI_API_KEY",
];

const allKeys = [...requiredPublicKeys, ...requiredServerKeys];

// --------------------
// Helper validators
// --------------------
const isValidURL = (str) => {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
};

const isValidSupabaseUrl = (url) => /^https:\/\/[a-z0-9]+\.supabase\.co$/.test(url);
const isValidOpenAIKey = (key) => /^sk-[A-Za-z0-9_\-]{32,}$/.test(key);

// --------------------
// Check for missing keys
// --------------------
let missing = [];
allKeys.forEach((key) => {
  if (!process.env[key] || process.env[key].trim() === "") missing.push(key);
});

if (missing.length > 0) {
  console.error(chalk.red.bold("\n❌ Missing required environment variables:"));
  missing.forEach((key) => console.error(chalk.red(` - ${key}`)));
  console.error(chalk.yellow("\nPlease fill them in your `.env.local` before starting the app.\n"));
  process.exit(1);
}

// --------------------
// Check for server keys exposed to client
// --------------------
const exposedServerKeys = requiredServerKeys.filter((key) => key.startsWith("NEXT_PUBLIC_"));
if (exposedServerKeys.length > 0) {
  console.warn(chalk.yellow.bold("\n⚠️ Warning: Server-only keys should NOT start with NEXT_PUBLIC_:"));
  exposedServerKeys.forEach((key) => console.warn(chalk.yellow(` - ${key}`)));
  console.warn(chalk.yellow("These keys may be exposed to clients!\n"));
}

// --------------------
// Validate formats
// --------------------
let formatErrors = [];

if (!isValidURL(process.env.NEXT_PUBLIC_BASE_URL)) {
  formatErrors.push("NEXT_PUBLIC_BASE_URL is not a valid URL");
}

if (!isValidSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL)) {
  formatErrors.push("NEXT_PUBLIC_SUPABASE_URL is not a valid Supabase URL (https://<project-ref>.supabase.co)");
}

if (!isValidOpenAIKey(process.env.OPENAI_API_KEY)) {
  formatErrors.push("OPENAI_API_KEY does not look valid (should start with 'sk-')");
}

if (formatErrors.length > 0) {
  console.error(chalk.red.bold("\n❌ Environment variable format errors:"));
  formatErrors.forEach((err) => console.error(chalk.red(` - ${err}`)));
  process.exit(1);
}

// --------------------
// Success
// --------------------
console.log(chalk.green.bold("\n✅ All required environment variables are set and valid!\n"));
