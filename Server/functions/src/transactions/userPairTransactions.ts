import { db } from "./../firebaseConfig";
import { User } from "../models/User";
import * as Error from "../utils/AppError";

export async function UserPairTransaction<TResult>(params: {
  actorUid: string;
  targetUid: string;
  action: (actor: User, target: User) => TResult | Promise<TResult>;
}): Promise<TResult> {
  const { actorUid, targetUid, action } = params;

  if (actorUid === targetUid) {
    throw new Error.BadRequestError("Cannot target self");
  }

  const actorRef = db.collection("users").doc(actorUid);
  const targetRef = db.collection("users").doc(targetUid);

  return db.runTransaction(async (tx) => {
    const [actorSnap, targetSnap] = await Promise.all([
      tx.get(actorRef),
      tx.get(targetRef),
    ]);

    if (!actorSnap.exists) {
      throw new Error.NotFoundError("Actor user not found");
    }

    if (!targetSnap.exists) {
      throw new Error.NotFoundError("Target user not found");
    }

    const actor = User.fromFirestore(actorSnap);
    const target = User.fromFirestore(targetSnap);

    const result = await action(actor, target);

    tx.set(actorRef, actor.toFirestore(), { merge: true });
    tx.set(targetRef, target.toFirestore(), { merge: true });

    return result;
  });
}
