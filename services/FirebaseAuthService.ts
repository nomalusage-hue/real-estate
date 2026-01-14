// import { GoogleAuthProvider, signInWithPopup, signInWithRedirect } from "firebase/auth";
// import { firebaseAuth } from "@/config/firebase";
// import { DataResult } from "@/core/types";
// import { normalizeError } from "@/core/errors";

// export class FirebaseAuthService {
//   async loginWithGoogle(): Promise<DataResult<{ email: string }>> {
//     try {
//       const provider = new GoogleAuthProvider();
//       const res = await signInWithPopup(firebaseAuth, provider); 
//       // const res = await signInWithRedirect(firebaseAuth, provider);

//       return {
//         ok: true,
//         data: { email: res.user.email ?? "" },
//       };
//     } catch (e) {
//       return { ok: false, error: normalizeError(e) };
//     }
//   }
// }


import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { firebaseAuth } from "@/config/firebase";
import { DataResult } from "@/core/types";
import { normalizeError } from "@/core/errors";
import { signOut } from "firebase/auth";

export class FirebaseAuthService {

  async loginWithGooglePopup(): Promise<DataResult<{ email: string }>> {
    try {
      const provider = new GoogleAuthProvider();
      const res = await signInWithPopup(firebaseAuth, provider);

      return {
        ok: true,
        data: { email: res.user.email ?? "" },
      };
    } catch (e) {
      return { ok: false, error: normalizeError(e) };
    }
  }

  async loginWithGoogleRedirect(): Promise<DataResult<null>> {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithRedirect(firebaseAuth, provider);

      // execution stops here due to redirect
      return { ok: true, data: null };
    } catch (e) {
      return { ok: false, error: normalizeError(e) };
    }
  }

  // async handleRedirectResult(): Promise<DataResult<{ email: string }>> {
  //   try {
  //     const res = await getRedirectResult(firebaseAuth);

  //     if (!res || !res.user) {
  //       return { ok: false, error: "No redirect result" };
  //     }

  //     return {
  //       ok: true,
  //       data: { email: res.user.email ?? "" },
  //     };
  //   } catch (e) {
  //     return { ok: false, error: normalizeError(e) };
  //   }
  // }

    async handleRedirectResult(): Promise<DataResult<{ email: string } | null>> {
        try {
            // getRedirectResult returns 'null' if there's no pending redirect result to process.
            const res = await getRedirectResult(firebaseAuth);
            
            if (res === null) {
                // If null, it just means the app loaded normally, not via a redirect callback.
                // We should return gracefully without an error.
                return { ok: true, data: null }; 
            }

            // If we get here, we successfully processed a redirect result.
            if (!res.user) {
                 return { ok: false, error: "Redirect result but no user found" };
            }

            return { ok: true, data: { email: res.user.email ?? "" }, };
        } catch (e) {
            return { ok: false, error: normalizeError(e) };
        }
    }

  async logout() {
    await signOut(firebaseAuth);
  }




  async registerWithEmail(
    email: string,
    password: string
  ): Promise<DataResult<{ email: string }>> {
    try {
      const res = await createUserWithEmailAndPassword(
        firebaseAuth,
        email,
        password
      );

      return {
        ok: true,
        data: { email: res.user.email ?? "" },
      };
    } catch (e) {
      return { ok: false, error: normalizeError(e) };
    }
  }

  async loginWithEmail(
    email: string,
    password: string
  ): Promise<DataResult<{ email: string }>> {
    try {
      const res = await signInWithEmailAndPassword(
        firebaseAuth,
        email,
        password
      );

      return {
        ok: true,
        data: { email: res.user.email ?? "" },
      };
    } catch (e) {
      return { ok: false, error: normalizeError(e) };
    }
  }

}
