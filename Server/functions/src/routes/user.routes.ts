// routes/user.routes.ts
import { userController } from "../controllers/userController";
import { RouteDefinition } from "../utils/route.types";

export const userRoutes: RouteDefinition[] = [
  {
    method: "post",
    path: "/add",
    handler: userController.addUser.bind(userController),
    meta: {
      summary: "Add a new user",
      tags: ["User"],
    },
  },
  {
    method: "patch",
    path: "/update",
    handler: userController.updateUser.bind(userController),
    meta: {
      summary: "Update user profile",
      tags: ["User"],
    },
  },
  {
    method: "post",
    path: "/sendFriendRequest",
    handler: userController.sendFriendRequest.bind(userController),
    meta: {
      summary: "Send a friend request",
      tags: ["User"],
    },
  },
  {
    method: "post",
    path: "/respondFriendRequest",
    handler: userController.respondFriendRequest.bind(userController),
    meta: {
      summary: "Respond to a friend request",
      tags: ["User"],
    },
  },
  {
    method: "delete",
    path: "/removeFriend",
    handler: userController.removeFriend.bind(userController),
    meta: {
      summary: "Remove a friend",
      tags: ["User"],
    },
  },
  {
    method: "patch",
    path: "/toggleBlock",
    handler: userController.toggleBlock.bind(userController),
    meta: {
      summary: "Block or unblock a user",
      tags: ["User"],
    },
  },
];
