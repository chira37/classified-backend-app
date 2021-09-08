/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction } from "express";
import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import { httpResponse } from "../utils/constants";
import { User } from "../types/models";
import APIError from "../helpers/APIError";
import { MongoError } from "mongodb";
import { addressSchema } from "./Address";

const userSchema = new Schema<User>(
    {
        id: {
            type: String,
            requires: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        first_name: String,
        last_name: String,
        phone_no_1: String,
        phone_no_2: String,
        address_1: addressSchema,
        address_2: addressSchema,
        profile_image: String,
        role: String,
        note: String,
        verified: {
            type: Boolean,
            default: false,
        },
        active: {
            type: Boolean,
            default: true,
        },
        login_failed_count: Number,
        created_by: {
            type: Schema.Types.ObjectId,
            ref: "user",
        },
        updated_by: {
            type: Schema.Types.ObjectId,
            ref: "user",
        },
    },
    { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

userSchema.pre("save", function () {
    if (this.isNew) {
        this.id = this._id;
    }
});

userSchema.post("save", function (error: MongoError, _doc: unknown, next: NextFunction) {
    if (error.name === "MongoError" && error.code === 11000) {
        throw new APIError("Email already used", "DUPLICATE_ERROR", httpResponse.CONFLICT);
    } else {
        next();
    }
});

userSchema.post("findOneAndUpdate", function (error: MongoError, _doc: unknown, next: NextFunction) {
    if (error.name === "MongoError" && error.code === 11000) {
        throw new APIError("Email already used", "DUPLICATE_ERROR", httpResponse.CONFLICT);
    } else {
        next();
    }
});

/**
 * fix this remove any add correct type
 */

userSchema.pre<any>("findOneAndUpdate", async function (next) {
    const password = this.getUpdate().password;

    // when updating user profile, neglect if password is empty and password will be not changed
    if (password === "") {
        delete this.getUpdate().password;
    } else if (password) {
        const hash = await bcrypt.hash(password, 10);
        this.getUpdate().password = hash;
    }
    next();
});

userSchema.pre("save", async function (next) {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    next();
});

userSchema.methods.isValidPassword = async function (password) {
    const compare = await bcrypt.compare(password, this.password);
    return compare;
};

export default model<User>("user", userSchema);
