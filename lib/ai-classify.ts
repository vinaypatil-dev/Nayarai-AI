import Anthropic from '@anthropic-ai/sdk'

export interface ResourceClassification {
  productType: string
  country: string
  shortDescription: string
  resourceType: string
}

let client: Anthropic | null = null

function getClient(): Anthropic | null {
  if (!process.env.ANTHROPIC_API_KEY) return null
  if (!client) client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  return client
}

function agencyToCountry(agency: string): string {
  const map: Record<string, string> = {
    FDA: 'United States',
    EMA: 'European Union',
    ISO: 'International',
    TGA: 'Australia',
    CDSCO: 'India',
    OTHER: 'International',
  }
  return map[agency] ?? 'International'
}

export async function classifyResource(
  title: string,
  description: string,
  agency: string
): Promise<ResourceClassification> {
  const fallback: ResourceClassification = {
    productType: 'Regulatory',
    country: agencyToCountry(agency),
    shortDescription: description.slice(0, 150).trim() || title.slice(0, 150),
    resourceType: 'ARTICLE',
  }

  const ai = getClient()
  if (!ai) return fallback

  try {
    const msg = await ai.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 400,
      messages: [
        {
          role: 'user',
          content: `You are a medical device regulatory expert. Classify this regulatory resource and respond ONLY with valid JSON — no markdown, no explanation, no code fences.

Agency: ${agency}
Title: ${title}
Description: ${description.slice(0, 500)}

Respond with exactly this JSON structure:
{
  "productType": "one of: Medical Devices, Pharmaceuticals, Biologics, Diagnostics, Combination Products, General Regulatory",
  "country": "country or region name where this regulation applies",
  "shortDescription": "one sentence summary under 150 characters",
  "resourceType": "one of: ARTICLE, GUIDANCE, REGULATION, NOTICE"
}`,
        },
      ],
    })

    const block = msg.content[0]
    const text = block?.type === 'text' ? block.text.trim() : ''
    const parsed = JSON.parse(text) as ResourceClassification

    // Validate resourceType
    const validTypes = ['ARTICLE', 'GUIDANCE', 'REGULATION', 'NOTICE']
    if (!validTypes.includes(parsed.resourceType)) {
      parsed.resourceType = 'ARTICLE'
    }

    return parsed
  } catch {
    return fallback
  }
}
