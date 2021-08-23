import { NextFunction } from "express";
import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import { PasswordResetToken } from "../types/models";

const passwordResetTokenSchema = new Schema<PasswordResetToken>({
    id: String,
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now(),
        expires: 3600, // this is the expiry time in seconds
    },
});

passwordResetTokenSchema.pre("save", function (next: NextFunction) {
    if (this.isNew) {
        this.id = this._id;
    }

    next();
});

passwordResetTokenSchema.pre("save", async function (next) {
    const hash = await bcrypt.hash(this.token, 10);
    this.token = hash;
    next();
});

passwordResetTokenSchema.methods.isValidToken = async function (token) {
    const compare = await bcrypt.compare(token, this.token);
    return compare;
};

export default model<PasswordResetToken>("passwordResetToken", passwordResetTokenSchema);
