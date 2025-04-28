import { Response } from 'express';

enum ResponseStatus {
    SUCCESS = 200,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    INTERNAL_ERROR = 500
}

abstract class ApiResponse {
    constructor(
        protected status: ResponseStatus,
        protected message: string
    ) {}

    protected prepare<T extends ApiResponse>(
        res: Response,
        response: T,
        headers: { [key: string]: string }
    ): Response {
        for (const [key, value] of Object.entries(headers)) res.append(key, value);
        return res.status(this.status)
    }

    private static sanitize<T extends ApiResponse>(response: T): T {
        
    }
}