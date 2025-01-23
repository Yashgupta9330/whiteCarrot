"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertToUTC = convertToUTC;
const moment_timezone_1 = __importDefault(require("moment-timezone"));
function convertToUTC(dateString, timeString, timeZone) {
    if (!dateString || !timeString) {
        throw new Error("Date and time are required");
    }
    const formattedTime = timeString.padStart(5, '0');
    const dateTimeStr = `${dateString}T${formattedTime}:00`;
    const date = new Date(dateTimeStr);
    const tzOffset = moment_timezone_1.default.tz(dateTimeStr, timeZone).utcOffset();
    const utcDate = new Date(date.getTime() - (tzOffset * 60000));
    return utcDate;
}
