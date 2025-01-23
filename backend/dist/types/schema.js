"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.eventUpdateSchema = exports.eventSchema = void 0;
const zod_1 = require("zod");
exports.eventSchema = zod_1.z.object({
    id: zod_1.z.string().optional(),
    summary: zod_1.z.string().optional(),
    startDate: zod_1.z.string().optional(),
    startTime: zod_1.z.string().optional(),
    endDate: zod_1.z.string().optional(),
    endTime: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
    location: zod_1.z.string().optional(),
});
exports.eventUpdateSchema = zod_1.z.object({
    eventId: zod_1.z.string(),
    summary: zod_1.z.string().optional(),
    startDate: zod_1.z.string().optional(),
    startTime: zod_1.z.string().optional(),
    endDate: zod_1.z.string().optional(),
    endTime: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
    location: zod_1.z.string().optional(),
});
exports.User = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    email: zod_1.z.string().email(),
    googleId: zod_1.z.string().uuid().optional(),
    refreshToken: zod_1.z.string().optional(),
    accessToken: zod_1.z.string().optional(),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date(),
});
