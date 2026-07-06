# AI Prompt Preparation

This folder prepares future AI prompt policy only. It does not install OpenAI or Gemini SDKs and does not call any AI API.

## Boundary

Future AI calls must receive compact Saju JSON only. Prompts must not include:

- `birthDate`
- `birthTime`
- `email`
- `user_id`
- `input_hash`

## Policy

- `free_summary`: max 1500 Korean characters, temperature `0.4`
- `pro`: max 2200 Korean characters per section, temperature `0.5`
- Forbid medical diagnosis
- Forbid financial guarantees
- Forbid deterministic relationship claims
- Require disclaimers for health, wealth, and relationship sections

## Prompt Builder

`buildSajuPrompt` returns:

- `system`
- `user`
- `metadata`

`compactSajuForPrompt` includes only:

- `pillars`
- `fiveElements`
- `tenGods`
- `twelveShinsal`
- `daewoon`
- `sewoon`
- `warnings`
