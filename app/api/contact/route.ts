import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = body || {}

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const payload = {
      name: String(name).trim(),
      email: String(email).trim(),
      subject: subject ? String(subject).trim() : null,
      message: String(message).trim(),
      created_at: new Date().toISOString()
    }

    const { error } = await supabase.from('messages').insert([payload])

    if (error) {
      console.error('Supabase insert error', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Contact API error', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
