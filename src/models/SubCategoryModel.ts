/* eslint-disable @typescript-eslint/no-explicit-any */
import { Schema, model } from "mongoose";
import { ExtraField, ExtraFieldOption, SubCategory } from "../types/models";

const extraFieldOptionSchema = new Schema<ExtraFieldOption>({
    id: { type: String, unique: true, sparse: true },
    name: String,
});

extraFieldOptionSchema.pre("save", function () {
    if (this.isNew) {
        this.id = this._id;
    }
});

const extraFieldSchema = new Schema<ExtraField>({
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
                type: Schema.Types.ObjectId,
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
