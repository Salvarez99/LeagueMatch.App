import { BaseTransaction } from "./baseTransaction";
import { User } from "../models/User";
import type { UserTxOptions } from "./options/UserTxOptions";
import * as Error from "../utils/AppError";
import { DocumentReference, DocumentData } from "firebase-admin/firestore";
import { getCallerName } from "../utils/getCallerName";

const baseTx = new BaseTransaction();

export async function UserTransaction<TResult>(
  userRef: DocumentReference<DocumentData>,
  uid: string,
  options: UserTxOptions,
  action: (user: User) => TResult | Promise<TResult>
): Promise<TResult> {
  const context = getCallerName(4);

  return baseTx.run<User, TResult>(
    userRef,
    (snap) => User.fromFirestore(snap),
    (user) => user.toFirestore(),
    async (user) => {
      if (uid !== user.id)
        throw new Error.UnauthorizedError(
          `[${context}] Only the user can perform this action`
        );
      return action(user);
    }
  );
}
