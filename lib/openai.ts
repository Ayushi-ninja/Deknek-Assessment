import OpenAI from 'openai'

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function searchModelsWithAI(
  query: string,
  models: { id: string; name: string; description: string | null; category: string | null; tags: string[] | null; price: number }[]
): Promise<string[]> {
  const modelList = models
    .map(m => `ID:${m.id} | Name:${m.name} | Category:${m.category ?? 'N/A'} | Tags:${(m.tags ?? []).join(',')} | Price:₹${m.price} | Desc:${m.description ?? ''}`)
    .join('\n')

  const completion = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are a search assistant for a 3D model marketplace called DekNek 3D.
Given a list of available models and a user search query, return ONLY a JSON object with a single key "ids" containing an array of model IDs that best match the query.
Consider name, description, category, tags and price range when matching.
Return format: { "ids": ["id1", "id2"] }
Return empty array if nothing matches.
Never return anything except valid JSON.`,
      },
      {
        role: 'user',
        content: `Available models:\n${modelList}\n\nUser query: "${query}"`,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.2,
    max_tokens: 512,
  })

  const text = completion.choices[0]?.message?.content ?? '{}'
  const parsed = JSON.parse(text)
  return Array.isArray(parsed.ids) ? parsed.ids : []
}
