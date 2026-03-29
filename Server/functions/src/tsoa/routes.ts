/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import type { TsoaRoute } from '@tsoa/runtime';
import {  fetchMiddlewares, ExpressTemplateService } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { UserController } from './../controllers/userController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { LobbyController } from './../controllers/lobbyController';
import { expressAuthentication } from './../auth/expressAuth';
// @ts-ignore - no great way to install types from subpackage
import type { Request as ExRequest, Response as ExResponse, RequestHandler, Router } from 'express';

const expressAuthenticationRecasted = expressAuthentication as (req: ExRequest, securityName: string, scopes?: string[], res?: ExResponse) => Promise<any>;


// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "Friend": {
        "dataType": "refObject",
        "properties": {
            "username": {"dataType":"string","required":true},
            "uid": {"dataType":"string","required":true},
            "availability": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["Online"]},{"dataType":"enum","enums":["Away"]},{"dataType":"enum","enums":["Offline"]}],"required":true},
            "statusMessage": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "FriendRequest": {
        "dataType": "refObject",
        "properties": {
            "username": {"dataType":"string","required":true},
            "uid": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AddUserRequestDTO": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"email":{"dataType":"string","required":true},"username":{"dataType":"string","required":true},"id":{"dataType":"string","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IUser": {
        "dataType": "refObject",
        "properties": {
            "username": {"dataType":"string","required":true},
            "email": {"dataType":"string","required":true},
            "puuid": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "riotId": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "rank": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "preferredRoles": {"dataType":"array","array":{"dataType":"string"},"required":true},
            "friendsList": {"dataType":"array","array":{"dataType":"refObject","ref":"Friend"},"required":true},
            "incomingRequests": {"dataType":"array","array":{"dataType":"refObject","ref":"FriendRequest"},"required":true},
            "outgoingRequests": {"dataType":"array","array":{"dataType":"refObject","ref":"FriendRequest"},"required":true},
            "blockedUsers": {"dataType":"array","array":{"dataType":"string"},"required":true},
            "availability": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["Online"]},{"dataType":"enum","enums":["Away"]},{"dataType":"enum","enums":["Offline"]}],"required":true},
            "statusMessage": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "updateUserRequestDTO": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"riotId":{"dataType":"string","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "createLobbyRequestDTO": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"rankFilter":{"dataType":"array","array":{"dataType":"string"}},"championId":{"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}]},"hostPosition":{"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}]},"gameMode":{"dataType":"string"},"gameMap":{"dataType":"string","required":true},"hostId":{"dataType":"string","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IGhostData": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"championId":{"dataType":"string"},"position":{"dataType":"string"},"gameMap":{"dataType":"string","required":true},"index":{"dataType":"double","required":true},"ghostId":{"dataType":"string","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "updateGhostDTO": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"championId":{"dataType":"string"},"position":{"dataType":"string","required":true},"ghostId":{"dataType":"string","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "updateDiscordDTO": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"discordLink":{"dataType":"string","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "findLobbyDTO": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"ranks":{"dataType":"array","array":{"dataType":"string"},"required":true},"desiredPosition":{"dataType":"string","required":true},"gameMode":{"dataType":"string","required":true},"gameMap":{"dataType":"string","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "joinLobbyDTO": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"championId":{"dataType":"string"},"position":{"dataType":"string"},"uid":{"dataType":"string","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const templateService = new ExpressTemplateService(models, {"noImplicitAdditionalProperties":"ignore","bodyCoercion":true});

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa




export function RegisterRoutes(app: Router) {

    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################


    
        const argsUserController_addUser: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"AddUserRequestDTO"},
        };
        app.post('/user/add',
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.addUser)),

            async function UserController_addUser(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserController_addUser, request, response });

                const controller = new UserController();

              await templateService.apiHandler({
                methodName: 'addUser',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsUserController_updateUser: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                body: {"in":"body","name":"body","required":true,"ref":"updateUserRequestDTO"},
        };
        app.post('/user/update',
            authenticateMiddleware([{"firebaseAuth":[]}]),
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.updateUser)),

            async function UserController_updateUser(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserController_updateUser, request, response });

                const controller = new UserController();

              await templateService.apiHandler({
                methodName: 'updateUser',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsUserController_sendFriendRequest: Record<string, TsoaRoute.ParameterSchema> = {
                uid: {"in":"query","name":"uid","required":true,"dataType":"string"},
                targetUid: {"in":"query","name":"targetUid","required":true,"dataType":"string"},
        };
        app.post('/user/sendFriendRequest',
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.sendFriendRequest)),

            async function UserController_sendFriendRequest(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserController_sendFriendRequest, request, response });

                const controller = new UserController();

              await templateService.apiHandler({
                methodName: 'sendFriendRequest',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsUserController_respondFriendRequest: Record<string, TsoaRoute.ParameterSchema> = {
                uid: {"in":"query","name":"uid","required":true,"dataType":"string"},
                incomingUid: {"in":"query","name":"incomingUid","required":true,"dataType":"string"},
                accepted: {"in":"query","name":"accepted","required":true,"dataType":"boolean"},
        };
        app.patch('/user/respondFriendRequest',
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.respondFriendRequest)),

            async function UserController_respondFriendRequest(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserController_respondFriendRequest, request, response });

                const controller = new UserController();

              await templateService.apiHandler({
                methodName: 'respondFriendRequest',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsUserController_removeFriend: Record<string, TsoaRoute.ParameterSchema> = {
                uid: {"in":"query","name":"uid","required":true,"dataType":"string"},
                targetUid: {"in":"query","name":"targetUid","required":true,"dataType":"string"},
        };
        app.delete('/user/removeFriend',
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.removeFriend)),

            async function UserController_removeFriend(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserController_removeFriend, request, response });

                const controller = new UserController();

              await templateService.apiHandler({
                methodName: 'removeFriend',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsUserController_toggleBlock: Record<string, TsoaRoute.ParameterSchema> = {
                uid: {"in":"query","name":"uid","required":true,"dataType":"string"},
                targetUid: {"in":"query","name":"targetUid","required":true,"dataType":"string"},
        };
        app.patch('/user/toggleBlock',
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.toggleBlock)),

            async function UserController_toggleBlock(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserController_toggleBlock, request, response });

                const controller = new UserController();

              await templateService.apiHandler({
                methodName: 'toggleBlock',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsLobbyController_create: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"createLobbyRequestDTO"},
        };
        app.post('/lobby/create',
            ...(fetchMiddlewares<RequestHandler>(LobbyController)),
            ...(fetchMiddlewares<RequestHandler>(LobbyController.prototype.create)),

            async function LobbyController_create(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsLobbyController_create, request, response });

                const controller = new LobbyController();

              await templateService.apiHandler({
                methodName: 'create',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsLobbyController_ready: Record<string, TsoaRoute.ParameterSchema> = {
                lobbyId: {"in":"query","name":"lobbyId","required":true,"dataType":"string"},
                uid: {"in":"query","name":"uid","required":true,"dataType":"string"},
        };
        app.patch('/lobby/ready',
            ...(fetchMiddlewares<RequestHandler>(LobbyController)),
            ...(fetchMiddlewares<RequestHandler>(LobbyController.prototype.ready)),

            async function LobbyController_ready(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsLobbyController_ready, request, response });

                const controller = new LobbyController();

              await templateService.apiHandler({
                methodName: 'ready',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsLobbyController_addGhost: Record<string, TsoaRoute.ParameterSchema> = {
                hostId: {"in":"query","name":"hostId","required":true,"dataType":"string"},
                lobbyId: {"in":"query","name":"lobbyId","required":true,"dataType":"string"},
                body: {"in":"body","name":"body","required":true,"ref":"IGhostData"},
        };
        app.post('/lobby/addGhost',
            ...(fetchMiddlewares<RequestHandler>(LobbyController)),
            ...(fetchMiddlewares<RequestHandler>(LobbyController.prototype.addGhost)),

            async function LobbyController_addGhost(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsLobbyController_addGhost, request, response });

                const controller = new LobbyController();

              await templateService.apiHandler({
                methodName: 'addGhost',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsLobbyController_updateGhost: Record<string, TsoaRoute.ParameterSchema> = {
                hostId: {"in":"query","name":"hostId","required":true,"dataType":"string"},
                lobbyId: {"in":"query","name":"lobbyId","required":true,"dataType":"string"},
                body: {"in":"body","name":"body","required":true,"ref":"updateGhostDTO"},
        };
        app.patch('/lobby/updateGhost',
            ...(fetchMiddlewares<RequestHandler>(LobbyController)),
            ...(fetchMiddlewares<RequestHandler>(LobbyController.prototype.updateGhost)),

            async function LobbyController_updateGhost(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsLobbyController_updateGhost, request, response });

                const controller = new LobbyController();

              await templateService.apiHandler({
                methodName: 'updateGhost',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsLobbyController_initSearch: Record<string, TsoaRoute.ParameterSchema> = {
                uid: {"in":"query","name":"uid","required":true,"dataType":"string"},
                lobbyId: {"in":"query","name":"lobbyId","required":true,"dataType":"string"},
        };
        app.patch('/lobby/initSearch',
            ...(fetchMiddlewares<RequestHandler>(LobbyController)),
            ...(fetchMiddlewares<RequestHandler>(LobbyController.prototype.initSearch)),

            async function LobbyController_initSearch(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsLobbyController_initSearch, request, response });

                const controller = new LobbyController();

              await templateService.apiHandler({
                methodName: 'initSearch',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsLobbyController_kick: Record<string, TsoaRoute.ParameterSchema> = {
                hostId: {"in":"query","name":"hostId","required":true,"dataType":"string"},
                lobbyId: {"in":"query","name":"lobbyId","required":true,"dataType":"string"},
                targetUid: {"in":"query","name":"targetUid","required":true,"dataType":"string"},
        };
        app.delete('/lobby/kick',
            ...(fetchMiddlewares<RequestHandler>(LobbyController)),
            ...(fetchMiddlewares<RequestHandler>(LobbyController.prototype.kick)),

            async function LobbyController_kick(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsLobbyController_kick, request, response });

                const controller = new LobbyController();

              await templateService.apiHandler({
                methodName: 'kick',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsLobbyController_updateDiscord: Record<string, TsoaRoute.ParameterSchema> = {
                hostId: {"in":"query","name":"hostId","required":true,"dataType":"string"},
                lobbyId: {"in":"query","name":"lobbyId","required":true,"dataType":"string"},
                body: {"in":"body","name":"body","required":true,"ref":"updateDiscordDTO"},
        };
        app.patch('/lobby/updateDiscord',
            ...(fetchMiddlewares<RequestHandler>(LobbyController)),
            ...(fetchMiddlewares<RequestHandler>(LobbyController.prototype.updateDiscord)),

            async function LobbyController_updateDiscord(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsLobbyController_updateDiscord, request, response });

                const controller = new LobbyController();

              await templateService.apiHandler({
                methodName: 'updateDiscord',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsLobbyController_updateChampion: Record<string, TsoaRoute.ParameterSchema> = {
                uid: {"in":"query","name":"uid","required":true,"dataType":"string"},
                lobbyId: {"in":"query","name":"lobbyId","required":true,"dataType":"string"},
                championId: {"in":"query","name":"championId","required":true,"dataType":"string"},
        };
        app.patch('/lobby/updateChampion',
            ...(fetchMiddlewares<RequestHandler>(LobbyController)),
            ...(fetchMiddlewares<RequestHandler>(LobbyController.prototype.updateChampion)),

            async function LobbyController_updateChampion(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsLobbyController_updateChampion, request, response });

                const controller = new LobbyController();

              await templateService.apiHandler({
                methodName: 'updateChampion',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsLobbyController_getAvailableLobbies: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/lobby/getAvailableLobbies',
            ...(fetchMiddlewares<RequestHandler>(LobbyController)),
            ...(fetchMiddlewares<RequestHandler>(LobbyController.prototype.getAvailableLobbies)),

            async function LobbyController_getAvailableLobbies(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsLobbyController_getAvailableLobbies, request, response });

                const controller = new LobbyController();

              await templateService.apiHandler({
                methodName: 'getAvailableLobbies',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsLobbyController_get: Record<string, TsoaRoute.ParameterSchema> = {
                lobbyId: {"in":"query","name":"lobbyId","required":true,"dataType":"string"},
        };
        app.get('/lobby/get',
            ...(fetchMiddlewares<RequestHandler>(LobbyController)),
            ...(fetchMiddlewares<RequestHandler>(LobbyController.prototype.get)),

            async function LobbyController_get(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsLobbyController_get, request, response });

                const controller = new LobbyController();

              await templateService.apiHandler({
                methodName: 'get',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsLobbyController_find: Record<string, TsoaRoute.ParameterSchema> = {
                uid: {"in":"query","name":"uid","required":true,"dataType":"string"},
                body: {"in":"body","name":"body","required":true,"ref":"findLobbyDTO"},
        };
        app.post('/lobby/find',
            ...(fetchMiddlewares<RequestHandler>(LobbyController)),
            ...(fetchMiddlewares<RequestHandler>(LobbyController.prototype.find)),

            async function LobbyController_find(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsLobbyController_find, request, response });

                const controller = new LobbyController();

              await templateService.apiHandler({
                methodName: 'find',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsLobbyController_join: Record<string, TsoaRoute.ParameterSchema> = {
                lobbyId: {"in":"query","name":"lobbyId","required":true,"dataType":"string"},
                body: {"in":"body","name":"body","required":true,"ref":"joinLobbyDTO"},
        };
        app.patch('/lobby/join',
            ...(fetchMiddlewares<RequestHandler>(LobbyController)),
            ...(fetchMiddlewares<RequestHandler>(LobbyController.prototype.join)),

            async function LobbyController_join(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsLobbyController_join, request, response });

                const controller = new LobbyController();

              await templateService.apiHandler({
                methodName: 'join',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsLobbyController_leave: Record<string, TsoaRoute.ParameterSchema> = {
                uid: {"in":"query","name":"uid","required":true,"dataType":"string"},
                lobbyId: {"in":"query","name":"lobbyId","required":true,"dataType":"string"},
        };
        app.delete('/lobby/leave',
            ...(fetchMiddlewares<RequestHandler>(LobbyController)),
            ...(fetchMiddlewares<RequestHandler>(LobbyController.prototype.leave)),

            async function LobbyController_leave(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsLobbyController_leave, request, response });

                const controller = new LobbyController();

              await templateService.apiHandler({
                methodName: 'leave',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function authenticateMiddleware(security: TsoaRoute.Security[] = []) {
        return async function runAuthenticationMiddleware(request: any, response: any, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            // keep track of failed auth attempts so we can hand back the most
            // recent one.  This behavior was previously existing so preserving it
            // here
            const failedAttempts: any[] = [];
            const pushAndRethrow = (error: any) => {
                failedAttempts.push(error);
                throw error;
            };

            const secMethodOrPromises: Promise<any>[] = [];
            for (const secMethod of security) {
                if (Object.keys(secMethod).length > 1) {
                    const secMethodAndPromises: Promise<any>[] = [];

                    for (const name in secMethod) {
                        secMethodAndPromises.push(
                            expressAuthenticationRecasted(request, name, secMethod[name], response)
                                .catch(pushAndRethrow)
                        );
                    }

                    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

                    secMethodOrPromises.push(Promise.all(secMethodAndPromises)
                        .then(users => { return users[0]; }));
                } else {
                    for (const name in secMethod) {
                        secMethodOrPromises.push(
                            expressAuthenticationRecasted(request, name, secMethod[name], response)
                                .catch(pushAndRethrow)
                        );
                    }
                }
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            try {
                request['user'] = await Promise.any(secMethodOrPromises);

                // Response was sent in middleware, abort
                if (response.writableEnded) {
                    return;
                }

                next();
            }
            catch(err) {
                // Show most recent error as response
                const error = failedAttempts.pop();
                error.status = error.status || 401;

                // Response was sent in middleware, abort
                if (response.writableEnded) {
                    return;
                }
                next(error);
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        }
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
