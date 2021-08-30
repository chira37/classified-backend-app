/* eslint-disable @typescript-eslint/no-explicit-any */
import { Schema, model } from "mongoose";
import { nanoid } from "nanoid";
import { Category } from "../types/models";

const categorySchema = new Schema<Category>(
    {
        _id: {
            type: String,
            default: () => nanoid(12),
        },
        id: {
            type: String,
            requires: true,
            unique: true,
        },
        name: String,
        icon_image: String,
        sub_category_id: [
            {
                type: Schema.Types.ObjectId,
                ref: "subCategory",
            },
        ],
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

categorySchema.pre("save", function () {
    if (this.isNew) {
        this.id = this._id;
    }
});

export default model<Category>("category", categorySchema);
