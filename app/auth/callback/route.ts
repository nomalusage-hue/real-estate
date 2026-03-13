// import { NextResponse } from "next/server";
// import { cookies } from "next/headers";
// import { createServerClient } from "@supabase/ssr";

// export async function GET(request: Request) {
//   const { searchParams, origin } = new URL(request.url);
//   const code = searchParams.get("code");

//   if (!code) {
//     return NextResponse.redirect(origin);
//   }

//   // ✅ cookies() IS ASYNC IN NEXT 16
//   const cookieStore = await cookies();

//   const supabase = createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     {
//       cookies: {
//         get(name: string) {
//           return cookieStore.get(name)?.value;
//         },
//         set(name: string, value: string, options: any) {
//           cookieStore.set({ name, value, ...options });
//         },
//         remove(name: string, options: any) {
//           cookieStore.set({ name, value: "", ...options });
//         },
//       },
//     }
//   );

//   // 🔴 THIS WAS NEVER RUNNING BEFORE
//   await supabase.auth.exchangeCodeForSession(code);

//   return NextResponse.redirect(origin);
// }




// // app/auth/callback/route.ts
// import { NextResponse } from "next/server";
// import { cookies } from "next/headers";
// import { createServerClient } from "@supabase/ssr";

// export async function GET(request: Request) {
//   const { searchParams, origin } = new URL(request.url);
//   const code = searchParams.get("code");

//   if (!code) {
//     return NextResponse.redirect(origin);
//   }

//   const cookieStore = await cookies();

//   const supabase = createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     {
//       cookies: {
//         get(name: string) {
//           return cookieStore.get(name)?.value;
//         },
//         set(name: string, value: string, options: any) {
//           cookieStore.set({ name, value, ...options });
//         },
//         remove(name: string, options: any) {
//           cookieStore.set({ name, value: "", ...options });
//         },
//       },
//     }
//   );

//   // Exchange OAuth code
//   const { data, error } = await supabase.auth.exchangeCodeForSession(code);

//   if (!error && data.session?.user) {
//     const userId = data.session.user.id;

//     const guestId = cookieStore.get("guest_id")?.value;

//     if (guestId) {
//       await supabase
//         .from("guests")
//         .update({ profile_id: userId })
//         .eq("id", guestId)
//         .is("profile_id", null);
//     }
//   }

//   return NextResponse.redirect(origin);
// }





import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(origin);
  }

  const cookieStore = await cookies();

  const rawRedirect = cookieStore.get("auth_redirect")?.value;
  const next = rawRedirect ? decodeURIComponent(rawRedirect) : "/";

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: "", ...options });
        },
      },
    }
  );

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (!error && data.session?.user) {
    const userId = data.session.user.id;
    const guestId = cookieStore.get("guest_id")?.value;

    if (guestId) {
      await supabase
        .from("guests")
        .update({ profile_id: userId })
        .eq("id", guestId)
        .is("profile_id", null);
    }

    cookieStore.set({ name: "auth_redirect", value: "", maxAge: 0, path: "/" });

    return NextResponse.redirect(`${origin}${next}`);
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}