#!/usr/bin/env node

/**
 * validateEnv.mjs
 * Zod-powered environment validator
 */

import { z } from "zod"
import chalk from "chalk"
import dotenv from "dotenv"

dotenv.config({ path: ".env.local" })

// ----------------------
// Environment Schema
// ----------------------

const envSchema = z.object({

  // Public vars
  NEXT_PUBLIC_APP_NAME: z.string().min(1),

  NEXT_PUBLIC_ENV: z.enum([
    "development",
    "production",
    "staging"
  ]),

  NEXT_PUBLIC_BASE_URL: z.string().url(),

  NEXT_PUBLIC_SUPABASE_URL: z
    .string()
    .url()
    .optional(),

  NEXT_PUBLIC_SUPABASE_ANON_KEY: z
    .string()
    .optional(),

  NEXT_PUBLIC_AI_API_ENDPOINT: z
    .string()
    .url()
    .optional(),

  NEXT_PUBLIC_EXPORT_BASE_PATH: z
    .string()
    .optional(),

  // Server-only vars
  SUPABASE_SERVICE_ROLE_KEY: z
    .string()
    .optional(),

  OPENAI_API_KEY: z
    .string()
    .regex(/^sk-/, "OPENAI_API_KEY must start with 'sk-'")
    .optional()

})

// ----------------------
// Parse + Validate
// ----------------------

const result = envSchema.safeParse(process.env)

if (!result.success) {

  const errors = result.error.flatten().fieldErrors

  console.error(
    chalk.red.bold("\n❌ Environment validation failed\n")
  )

  Object.entries(errors).forEach(([key, value]) => {
    console.error(
      chalk.red(` - ${key}: ${value?.join(", ")}`)
    )
  })

  if (process.env.NODE_ENV === "production") {
    process.exit(1)
  }

  console.warn(
    chalk.yellow(
      "\n⚠ Continuing because NODE_ENV is not production\n"
    )
  )

} else {

  console.log(
    chalk.green.bold(
      "\n✅ Environment variables validated successfully\n"
    )
  )

}