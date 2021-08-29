/* eslint-disable @typescript-eslint/no-explicit-any */
import { Schema, model } from "mongoose";
import { Province } from "../types/models";

const provinceSchema = new Schema<Province>(
    {
        id: {
            type: String,
            requires: true,
            unique: true,
        },
        name: String,
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
 * virtual middleware is added to get the id property
 */
provinceSchema.pre("save", function () {
    if (this.isNew) {
        this.id = this._id;
    }
});

export default model<Province>("province", provinceSchema);
