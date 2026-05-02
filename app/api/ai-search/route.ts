import { NextRequest, NextResponse } from 'next/server'
import { searchModelsWithAI } from '@/lib/openai'

export async function POST(req: NextRequest) {
  try {
    const { query, models } = await req.json()

    if (!query || typeof query !== 'string') {
      return NextResponse.json({ ids: [] })
    }

    if (!Array.isArray(models) || models.length === 0) {
      return NextResponse.json({ ids: [] })
    }

    const ids = await searchModelsWithAI(query, models)
    return NextResponse.json({ ids })
  } catch (err: any) {
    console.error('[AI Search Error]', err.message)
    return NextResponse.json({ ids: [], error: err.message }, { status: 500 })
  }
}
