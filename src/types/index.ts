/* eslint-disable @typescript-eslint/no-empty-interface */
import { ErrorRequestHandler } from "express";

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Express {
        interface Request {
            userId: string;
            userRole: string;
        }
    }
}

export interface ErrorType extends ErrorRequestHandler {
    code: number;
    keyValue: unknown;
    errors: Array<{ path: string; message: string }>;
    path: string;
    kind: string;
}

export interface Pagination {
    total_pages: number;
    current_page: number;
    next_page: number;
    previous_page: number;
    total_items: number;
}
