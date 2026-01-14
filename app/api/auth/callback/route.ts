// import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
// import { cookies } from 'next/headers'
// import { NextResponse } from 'next/server'

// export async function GET(request: Request) {
//   const requestUrl = new URL(request.url)
//   const code = requestUrl.searchParams.get('code')

//   if (code) {
//     const supabase = createRouteHandlerClient({ cookies })
//     await supabase.auth.exchangeCodeForSession(code)
//   }

//   // URL to redirect to after sign in process completes
//   return NextResponse.redirect(requestUrl.origin)
// }


import { createClient } from '@/lib/supabase/supabase'
import { NextResponse } from 'next/server'
// import { createClient } from '@/utils/supabase/server'  // Server-side client

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // Note: Docs use 'next', but your login code uses 'redirect'—change to match
  let redirectUrl = searchParams.get('redirect') ?? '/'  // Use 'redirect' param from your code
  if (!redirectUrl.startsWith('/')) {
    redirectUrl = '/'
  }

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // Handle forwarded host for production/load balancers
      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${redirectUrl}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${redirectUrl}`)
      } else {
        return NextResponse.redirect(`${origin}${redirectUrl}`)
      }
    }
  }
  // Error handling
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}