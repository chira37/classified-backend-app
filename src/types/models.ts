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
    role: string;
    note: string;
    verified: boolean;
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

export interface EmailVerificationTokenModel extends Document {
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

export interface Ad {
    id: string;
    user_id: string;
    shop_id: string;
    category_id: string;
    sub_category_id: string;
    url: string;
    title: string;
    description: string;
    condition: string;
    price: number;
    images: string[];
    city_id: string;
    province_id: string;
    phone_number_1: string;
    phone_number_2: string;
    extras: Extra[];
    active: boolean;
    status: "reject" | "active" | "disable" | "update" | "new";
    note: string;
    view_count: number;
    created_by: User;
    updated_by: User;
    created_at: Date;
    updated_at: Date;
}

// subcategory types
export interface ExtraFieldOption {
    id: string;
    name: string;
}

export interface ExtraField {
    id: string;
    name: string;
    type: string;
    options?: ExtraFieldOption[];
}

export interface SubCategory {
    id: string;
    name: string;
    icon_image?: string;
    extra_fields: ExtraField[];
    brand_id: string[];
    keywords: string[];
}

export interface Category {
    id: string;
    name: string;
    icon_image?: string;
    sub_category_id: SubCategory[];
}

// extra types
export interface ExtraValueOption {
    id: string;
    extra_field_option_id: string;
    extra_field_option_name: string;
}

export interface Extra {
    id: string;
    extra_field_id: string;
    name: string;
    value: number | ExtraValueOption | ExtraValueOption[];
}

export interface Brand {
    id: string;
    name: string;
    icon_image: string;
}

export interface City {
    id: string;
    name: string;
    province_id: string;
}
export interface Province {
    id: string;
    name: string;
}

// export interface PromotedAd {
//     id: string;
//     ad_id: string;
//     user_id: string;
//     started_date: Date;
//     end_date: Date;
//     active: boolean;
//     paid: boolean;
//     created_by: User;
//     updated_by: User;
//     created_at: Date;
//     updated_at: Date;
// }

// export interface Promotion {
//     id: string;
//     user_id: string;
//     ad_id: string[];
//     started_date: Date;
//     end_date: Date;
//     active: boolean;
//     paid: boolean;
//     created_by: User;
//     updated_by: User;
//     created_at: Date;
//     updated_at: Date;
// }
