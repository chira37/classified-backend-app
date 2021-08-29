/* eslint-disable @typescript-eslint/no-explicit-any */
import { Schema, model } from "mongoose";
import mongooseLeanVirtuals from "mongoose-lean-virtuals";
import { City } from "../types/models";

const citySchema = new Schema<City>(
    {
        name: String,
        province_id: {
            type: Schema.Types.ObjectId,
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
    { timestamps: { createdAt: "created_at", updatedAt: "updated_at" }, toJSON: { virtuals: true } }
);

citySchema.virtual("id").get(function () {
    return this._id.toString();
});

citySchema.plugin(mongooseLeanVirtuals as any);

export default model<City>("city", citySchema);
