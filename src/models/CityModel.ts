/* eslint-disable @typescript-eslint/no-explicit-any */
import { Schema, model } from "mongoose";
import mongooseLeanVirtuals from "mongoose-lean-virtuals";
import { nanoid } from "nanoid";
import { City } from "../types/models";

const citySchema = new Schema<City>(
    {
        _id: {
            type: String,
            default: () => nanoid(12), // url friendly id
        },
        name: String,
        province_id: {
            type: Schema.Types.String,
            ref: "province",
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

/**
 * virtual middleware is not available since insert many is used therefore virtual is used in to include id on the get, find result
 */
citySchema.virtual("id").get(function () {
    return this._id.toString();
});

citySchema.plugin(mongooseLeanVirtuals as any);

export default model<City>("city", citySchema);
