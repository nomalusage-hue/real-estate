// // utils/checkIfAdmin.ts
// import { User } from "firebase/auth";

// export async function checkIfAdmin(user: User): Promise<boolean> {
//   const tokenResult = await user.getIdTokenResult();
//   // console.log("User token claims:", tokenResult.claims);
//   // console.log("User admin:", tokenResult.claims.role === 'admin');
//   return tokenResult.claims.role === 'admin';
// }




// // utils/checkIfAdmin.ts (updated for Supabase)
// import { createClient } from '@/lib/supabase/supabase';

// export async function checkIfAdmin(userId: string): Promise<boolean> {
//   const supabase = createClient();
  
//   // Query the 'profiles' table instead of 'users'
//   const { data, error } = await supabase
//     .from('profiles') // Changed from 'users' to 'profiles'
//     .select('role')
//     .eq('id', userId)
//     .single();
    
//   if (error || !data) {
//     console.error('Error fetching user role:', error);
//     return false;
//   }
  
//   return data.role === 'admin' || data.role === 'superadmin';
// }

// export async function getCurrentUser() {
//   const supabase = createClient();
//   const { data: { session } } = await supabase.auth.getSession();
  
//   if (!session) {
//     return null;
//   }
  
//   return session.user;
// }






// utils/checkIfAdmin.ts
import { createClient } from '@/lib/supabase/supabase';

export async function checkIfAdmin(userId: string): Promise<boolean> {
  console.log('checkIfAdmin - Checking for user:', userId);
  
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();
    
  console.log('checkIfAdmin - Result:', { data, error });
  
  if (error || !data) {
    console.error('Error fetching user role:', error);
    return false;
  }
  
  const isAdmin = data.role === 'admin' || data.role === 'superadmin';
  console.log('checkIfAdmin - Is admin?', isAdmin);
  
  return isAdmin;
}

export async function getCurrentUser() {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    return null;
  }
  
  return session.user;
}