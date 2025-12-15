import { User } from "../../models/User";
import { UserPairTransaction } from "../userPairTransactions";

export async function UserPairAction<T>(params: {
  uid: string;
  targetUid: string;
  action: (user: User, target: User) => T | Promise<T>;
}): Promise<T> {
  const { uid, targetUid, action } = params;

  return UserPairTransaction({
    actorUid: uid,
    targetUid,
    action,
  });
}
