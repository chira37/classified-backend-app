export enum httpResponse {
    OK = 200,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    SERVER_ERROR = 500,
    CONFLICT = 409,
    NOT_FOUND = 404,
}

export enum roles {
    SUPER_ADMIN = "super-admin",
    ADMIN = "admin",
    SUPER_EDITOR = "super-editor",
    EDITOR = "editor",
    USER = "user",
}
