// import { doc, getDoc, addDoc, collection } from "firebase/firestore";
// import { firestore } from "@/config/firebase";
// import { DataSource } from "@/core/DataSource";
// import { DataResult } from "@/core/types";
// import { normalizeError } from "@/core/errors";

// export class FirebaseDataSource<T extends { id?: string }>
//   implements DataSource<T>
// {
//   constructor(private collectionName: string) {}

//   async getById(id: string): Promise<DataResult<T>> {
//     try {
//       const ref = doc(firestore, this.collectionName, id);
//       const snap = await getDoc(ref);

//       if (!snap.exists()) {
//         return { ok: false, error: "Item not found" };
//       }

//       return {
//         ok: true,
//         data: { id: snap.id, ...(snap.data() as T) },
//       };
//     } catch (e) {
//       return { ok: false, error: normalizeError(e) };
//     }
//   }

//   async create(data: T): Promise<DataResult<string>> {
//     try {
//       const ref = await addDoc(
//         collection(firestore, this.collectionName),
//         data
//       );
//       return { ok: true, data: ref.id };
//     } catch (e) {
//       return { ok: false, error: normalizeError(e) };
//     }
//   }
// }



// services/FirebaseDataSource.ts
import { collection, addDoc, getDocs, getDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { firestore } from '@/config/firebase';

export class FirebaseDataSource<T> {
  constructor(private collectionName: string) {}

  async create(data: T): Promise<string> {
    const docRef = await addDoc(collection(firestore, this.collectionName), data);
    return docRef.id;
  }

  async getAll(): Promise<T[]> {
    const snapshot = await getDocs(collection(firestore, this.collectionName));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
  }

  async getById(id: string): Promise<T | null> {
    const docRef = doc(firestore, this.collectionName, id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? ({ id: docSnap.id, ...docSnap.data() } as T) : null;
  }

  async update(id: string, data: Partial<T>): Promise<void> {
    const docRef = doc(firestore, this.collectionName, id);
    await updateDoc(docRef, data);
  }

  async delete(id: string): Promise<void> {
    const docRef = doc(firestore, this.collectionName, id);
    await deleteDoc(docRef);
  }
}