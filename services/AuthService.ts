import { signOut } from "firebase/auth";
import { firebaseAuth } from "@/config/firebase";

export class AuthService {
  async logout() {
    await signOut(firebaseAuth);
  }
}
