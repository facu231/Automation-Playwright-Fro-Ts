import { z } from 'zod';

const emptyToUndefined = (value: unknown): unknown =>
  typeof value === 'string' && value.trim() === '' ? undefined : value;

const booleanLike = z
  .string()
  .trim()
  .toLowerCase()
  .refine((value) => ['true', 'false', '1', '0', 'yes', 'no', 'y', 'n'].includes(value), {
    message: 'Expected boolean value: true, false, 1, 0, yes, no, y or n'
  })
  .transform((value) => ['true', '1', 'yes', 'y'].includes(value));

const positiveNumberLike = z
  .string()
  .trim()
  .regex(/^\d+$/, 'Expected a positive numeric value')
  .transform(Number);

const optionalBooleanLike = z.preprocess(emptyToUndefined, booleanLike.optional());
const optionalPositiveNumberLike = z.preprocess(emptyToUndefined, positiveNumberLike.optional());
const optionalUrl = z.preprocess(emptyToUndefined, z.string().url().optional());
const optionalNonEmptyString = z.preprocess(emptyToUndefined, z.string().min(1).optional());

const environmentName = z.preprocess(
  (value) => {
    if (typeof value !== 'string' || value.trim() === '') {
      return 'local';
    }

    return value.toLowerCase();
  },
  z.enum(['local', 'dev', 'qa', 'staging', 'prod'])
);

const browserName = z.preprocess(
  (value) => {
    if (typeof value !== 'string' || value.trim() === '') {
      return undefined;
    }

    return value.toLowerCase();
  },
  z.enum(['chromium', 'firefox', 'webkit']).optional()
);

export const runtimeEnvSchema = z.object({
  TEST_ENV: environmentName,
  BASE_URL: optionalUrl,
  BROWSER: browserName,
  HEADLESS: optionalBooleanLike,
  HIGHLIGHT: optionalBooleanLike,
  SCREENSHOT_ON_STEP: optionalBooleanLike,
  VIDEO: optionalBooleanLike,
  TRACE: optionalBooleanLike,
  SLOW_MO: optionalPositiveNumberLike,
  TEST_TIMEOUT: optionalPositiveNumberLike,
  ACTION_TIMEOUT: optionalPositiveNumberLike,
  NAVIGATION_TIMEOUT: optionalPositiveNumberLike,
  TEST_USERNAME: optionalNonEmptyString,
  TEST_PASSWORD: optionalNonEmptyString
});

export type RuntimeEnv = z.infer<typeof runtimeEnvSchema>;

export function parseRuntimeEnv(env: NodeJS.ProcessEnv = process.env): RuntimeEnv {
  const result = runtimeEnvSchema.safeParse(env);

  if (result.success) {
    return result.data;
  }

  const issues = result.error.issues
    .map((issue) => `- ${issue.path.join('.') || 'env'}: ${issue.message}`)
    .join('\n');

  throw new Error(`Invalid environment configuration:\n${issues}`);
}
