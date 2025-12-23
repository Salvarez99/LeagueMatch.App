import { db } from "./../firebaseConfig";
import * as Error from "../utils/AppError";
import type { DocumentReference, DocumentData, DocumentSnapshot } from "firebase-admin/firestore";

export class BaseTransaction {
  async run<TData, TResult>(
    ref: DocumentReference<DocumentData>,
    load: (raw: DocumentSnapshot<DocumentData>) => TData,
    save: (data: TData) => DocumentData,
    action: (data: TData) => TResult | Promise<TResult>
  ): Promise<TResult> {
    return db.runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      if (!snap.exists) throw new Error.NotFoundError("Document not found");

      const data = load(snap); 

      const result = await action(data); 

      tx.set(ref, save(data), { merge: true }); 

      return result; 
    });
  }
}
