import { createBrowserClient } from '@supabase/ssr'

export const createClient = () => 
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )


// import { createBrowserClient } from '@supabase/ssr'
// import { createServerClient } from '@supabase/ssr'
// import { cookies } from 'next/headers'

// // For client components (like your login page)
// export const createClient = () => 
//   createBrowserClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
//   )

// // For server components/actions
// export const createServerSupabaseClient = () => {
//   const cookieStore = cookies()
//   return createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     {
//       cookies: {
//         get(name: string) {
//           return cookieStore.get(name)?.value
//         },
//       },
//     }
//   )
// }