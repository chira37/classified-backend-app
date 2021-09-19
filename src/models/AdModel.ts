/* eslint-disable @typescript-eslint/no-explicit-any */
import { Schema, model } from "mongoose";
import { Ad, Extra } from "../types/models";

// const extraValueSchema = new Schema<ExtraValue>({
//     id: {
//         type: String,
//         requires: true,
//         unique: true,
//     },
//     extra_field_option_id: String,
//     extra_field_option_name: String,
//     // value can be a string, string array, number
//     value: {
//         type: Schema.Types.Mixed,
//         unique: true,
//     },
// });

// extraValueSchema.pre("save", function () {
//     if (this.isNew) {
//         this.id = this._id;
//     }
// });

// const extraSchema = new Schema<Extra>({
//     id: {
//         type: String,
//         requires: true,
//         unique: true,
//     },
//     extra_field_id: String,
//     extra_field_name: String,
//     value: Schema.Types.Mixed,
// });

// extraSchema.pre("save", function () {
//     if (this.isNew) {
//         this.id = this._id;
//     }
// });

const adSchema = new Schema<Ad>(
    {
        id: {
            type: String,
            requires: true,
            unique: true,
        },
        user_id: {
            type: Schema.Types.ObjectId,
            ref: "user",
        },
        shop_id: {
            type: Schema.Types.ObjectId,
            ref: "shop",
        },
        category_id: String,
        brand_id: String,

        url: {
            type: String,
            unique: true,
        },
        title: String,
        description: String,
        condition: String,
        price: Number,
        images: Array,
        city_id: {
            type: Schema.Types.String,
            ref: "city",
        },
        province_id: {
            type: Schema.Types.String,
            ref: "province",
        },
        phone_no_1: String,
        phone_no_2: String,
        extras: Object,
        active: {
            type: Boolean,
            default: true,
        },
        status: {
            type: String,
            default: "new",
        },
        note: String,
        view_count: {
            type: Number,
            default: 0,
        },
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

adSchema.pre("save", function () {
    if (this.isNew) {
        this.id = this._id;
    }
});

export default model<Ad>("ad", adSchema);
