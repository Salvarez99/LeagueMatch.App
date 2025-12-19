/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import type { TsoaRoute } from '@tsoa/runtime';
import {  fetchMiddlewares, ExpressTemplateService } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { UserController } from './../controllers/userController';
import type { Request as ExRequest, Response as ExResponse, RequestHandler, Router } from 'express';



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
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"riotId":{"dataType":"string","required":true},"id":{"dataType":"string","required":true}},"validators":{}},
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
                body: {"in":"body","name":"body","required":true,"ref":"updateUserRequestDTO"},
        };
        app.post('/user/update',
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

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
