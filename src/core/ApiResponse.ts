import { Response, Request } from 'express';

enum ResponseStatus {
    SUCCESS = 200,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    INTERNAL_ERROR = 500
}

interface MetaData {
    timestamp: string;
    path: string;
    processingTimeMs?: number;
}



abstract class ApiResponse<T = any> {
    constructor(
        protected status: ResponseStatus,
        protected message: string,
        protected data?: T,
        protected startTime?: number
    ) {}

    protected prepare(
        req: Request,
        res: Response,
        headers: { [key: string]: string } = {},
    ): Response {
        for (const [key, value] of Object.entries(headers)) {
            res.append(key, value);
        }
        return res.status(this.status).json(this.sanitize(req))
    }

    public send(req: Request, res: Response, headers: { [key: string]: string } = {}): Response  {
        return this.prepare(req, res, headers);
    }

    private buildMetaData(req: Request): MetaData {
        const meta: MetaData = {
            timestamp: new Date().toISOString(),
            path: req.originalUrl
        }

        if (this.startTime) {
            meta.processingTimeMs = Date.now() - this.startTime;
        }

        return meta
    }

    private sanitize(req: Request) {
        const responseBody: Record<string, any> = {
            message: this.message,
            meta: this.buildMetaData(req)
        };

        if (this.data != undefined) {
            responseBody.data = this.data;
        }

        return responseBody;
    }
}

export class SuccessResponse<T> extends ApiResponse<T> {
    constructor(message: string, data?: T) {
        super(ResponseStatus.SUCCESS, message, data, Date.now());
    }
}

export class FailureResponse extends ApiResponse {
    constructor(message: string) {
        super(ResponseStatus.BAD_REQUEST, message, undefined, Date.now());
    }
}