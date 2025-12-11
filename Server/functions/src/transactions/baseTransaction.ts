import { db } from "../firebaseConfig";
import * as Error from "../utils/AppError";
import type { DocumentReference, DocumentData } from "firebase-admin/firestore";

export class BaseTransaction {
  async run<TData, TResult>(
    ref: DocumentReference<DocumentData>,
    load: (raw: DocumentData) => TData,
    save: (data: TData) => DocumentData,
    action: (data: TData) => TResult | Promise<TResult>
  ): Promise<TResult> {
    return db.runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      if (!snap.exists) throw new Error.NotFoundError("Document not found");

      const raw = snap.data()!;
      const data = load(raw); 

      const result = await action(data); 

      tx.set(ref, save(data), { merge: true }); 

      return result; 
    });
  }
}
