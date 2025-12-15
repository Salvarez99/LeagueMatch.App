import { UserTransaction } from "../userTransaction";
import { db } from "../../firebaseConfig";
import { User } from "../../models/User";

export function UserAction<T>(params: {
  uid: string;
  action: (user: User) => T | Promise<T>;
}) {
  const { uid, action } = params;
  const ref = db.collection("users").doc(uid);

  return UserTransaction(ref, uid, {}, action);
}
