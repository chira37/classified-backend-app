/* eslint-disable @typescript-eslint/no-explicit-any */
import { Schema, model } from "mongoose";
import { nanoid } from "nanoid";
import { Brand } from "../types/models";

const brandSchema = new Schema<Brand>(
    {
        _id: {
            type: String,
            default: () => nanoid(12), // url friendly id
        },
        id: {
            type: String,
            requires: true,
            unique: true,
        },
        slug: {
            type: String,
            require: true,
            unique: true,
        },
        name: String,
        icon_image: String,
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

brandSchema.pre("save", function () {
    if (this.isNew) {
        this.id = this._id;
    }
});

export default model<Brand>("brand", brandSchema);
