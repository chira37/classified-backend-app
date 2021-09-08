/* eslint-disable @typescript-eslint/no-explicit-any */
import { Schema, model } from "mongoose";
import { nanoid } from "nanoid";
import { ExtraField, ExtraFieldOption, SubCategory } from "../types/models";

/**
 * extra field option schema
 */

const extraFieldOptionSchema = new Schema<ExtraFieldOption>({
    _id: {
        type: String,
        default: () => nanoid(12), // url friendly id
    },
    id: { type: String, unique: true, sparse: true },
    name: String,
});

extraFieldOptionSchema.pre("save", function () {
    if (this.isNew) {
        this.id = this._id;
    }
});

/**
 * extra field schema
 */
const extraFieldSchema = new Schema<ExtraField>({
    _id: {
        type: String,
        default: () => nanoid(12), // url friendly id
    },
    id: { type: String, unique: true, sparse: true },
    name: String,
    type: String,
    options: [extraFieldOptionSchema],
});

extraFieldSchema.pre("save", function () {
    if (this.isNew) {
        this.id = this._id;
    }
});

const subCategorySchema = new Schema<SubCategory>(
    {
        _id: {
            type: String,
            default: () =>  nanoid(12), // url friendly id
        },
        id: {
            type: String,
            requires: true,
            unique: true,
        },
        name: String,
        icon_image: String,
        extra_fields: [extraFieldSchema],
        brand_id: [
            {
                type: Schema.Types.String,
                ref: "brand",
            },
        ],
        keywords: Array,

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

subCategorySchema.pre("save", function () {
    if (this.isNew) {
        this.id = this._id;
    }
});

export default model<SubCategory>("subCategory", subCategorySchema);
