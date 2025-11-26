"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadRequestError = exports.UnauthorizedError = exports.NotFoundError = exports.AppError = void 0;
var AppError = /** @class */ (function (_super) {
    __extends(AppError, _super);
    function AppError(message, statusCode, code) {
        if (statusCode === void 0) { statusCode = 400; }
        if (code === void 0) { code = null; }
        var _this = _super.call(this, message) || this;
        _this.statusCode = statusCode;
        _this.code = code;
        return _this;
    }
    return AppError;
}(Error));
exports.AppError = AppError;
// Common convenience subclasses:
var NotFoundError = /** @class */ (function (_super) {
    __extends(NotFoundError, _super);
    function NotFoundError(message) {
        if (message === void 0) { message = "Not found"; }
        return _super.call(this, message, 404) || this;
    }
    return NotFoundError;
}(AppError));
exports.NotFoundError = NotFoundError;
var UnauthorizedError = /** @class */ (function (_super) {
    __extends(UnauthorizedError, _super);
    function UnauthorizedError(message) {
        if (message === void 0) { message = "Unauthorized"; }
        return _super.call(this, message, 403) || this;
    }
    return UnauthorizedError;
}(AppError));
exports.UnauthorizedError = UnauthorizedError;
var BadRequestError = /** @class */ (function (_super) {
    __extends(BadRequestError, _super);
    function BadRequestError(message) {
        if (message === void 0) { message = "Bad request"; }
        return _super.call(this, message, 400) || this;
    }
    return BadRequestError;
}(AppError));
exports.BadRequestError = BadRequestError;
