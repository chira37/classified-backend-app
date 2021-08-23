import { Document } from "mongoose";

export interface User extends Document {
    id: string;
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone_no_1: string;
    phone_no_2: string;
    address_1: string;
    address_2: string;
    profile_image: string;
    role: string[];
    note: string;
    active: boolean;
    login_failed_count: number;
    created_by: User;
    updated_by: User;
    created_at: Date;
    updated_at: Date;

    isValidPassword: (password: string) => Promise<boolean>;
}

export interface PasswordResetToken extends Document {
    id: string;
    user_id: string;
    token: string;
    created_at: Date;
    isValidToken: (token: string) => Promise<boolean>;
}

export interface Address {
    line_1: string;
    line_2: string;
    city: User;
    province: User;
    zip_code: Date;
}
