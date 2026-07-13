export const SUPABASE_ENV_KEYS = Object.freeze({
  URL: 'VITE_SUPABASE_URL',
  ANON_KEY: 'VITE_SUPABASE_ANON_KEY',
})

function readEnvValue(key) {
  return String(import.meta.env[key] ?? '').trim()
}

function getUrlDetails(value) {
  if (!value) {
    return {
      isValid: false,
      host: null,
    }
  }

  try {
    const parsedUrl = new URL(value)
    const isValid = ['http:', 'https:'].includes(parsedUrl.protocol)

    return {
      isValid,
      host: isValid ? parsedUrl.host : null,
    }
  } catch {
    return {
      isValid: false,
      host: null,
    }
  }
}

export const supabaseConfig = Object.freeze({
  url: readEnvValue(SUPABASE_ENV_KEYS.URL),
  anonKey: readEnvValue(SUPABASE_ENV_KEYS.ANON_KEY),
})

const urlDetails = getUrlDetails(supabaseConfig.url)

export const supabaseEnvStatus = Object.freeze({
  isConfigured:
    Boolean(supabaseConfig.url && supabaseConfig.anonKey) &&
    urlDetails.isValid,
  projectHost: urlDetails.host,
  missingKeys: Object.entries(SUPABASE_ENV_KEYS)
    .filter(([, envKey]) => !readEnvValue(envKey))
    .map(([, envKey]) => envKey),
  invalidKeys:
    supabaseConfig.url && !urlDetails.isValid
      ? [SUPABASE_ENV_KEYS.URL]
      : [],
})

export function getSupabaseSetupMessage() {
  if (supabaseEnvStatus.invalidKeys.length > 0) {
    return 'Supabase URL is not valid.'
  }

  if (supabaseEnvStatus.missingKeys.length > 0) {
    return 'Supabase environment values are missing.'
  }

  return 'Supabase is configured.'
}
