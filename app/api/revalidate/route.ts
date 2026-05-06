import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function GET(request: NextRequest) {
const secret = request.headers.get('Revalidate-Cache-Auth-Token')
  const authToken = process.env.REVALIDATE_CACHE_AUTH_TOKEN

  if (!authToken || secret !== authToken) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
  }

  try {
    revalidatePath('/resources')
    revalidatePath('/careers')
    
    return NextResponse.json({ revalidated: true, now: Date.now() })
  } catch (err) {
    return NextResponse.json({ message: 'Error revalidating' }, { status: 500 })
  }
}
