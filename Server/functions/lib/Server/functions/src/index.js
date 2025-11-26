import { lobbyController } from "./controllers/lobbyController";
import { userController } from "./controllers/userController";
import { exportFunctions } from "./utils/exportFunctions";
Object.assign(exports, exportFunctions(lobbyController, "lobby"));
Object.assign(exports, exportFunctions(userController, "user"));
