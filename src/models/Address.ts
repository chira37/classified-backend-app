import { model, Schema } from "mongoose";
import { nanoid } from "nanoid";
import { Address } from "../types/models";

const addressSchema = new Schema({
    _id: {
        type: String,
        default: () => nanoid(12), // url friendly id
    },
    line_1: String,
    line_2: String,
    city: String,
    province: String,
    zip_code: String,
});

export default model<Address>("address", addressSchema);

addressSchema.pre("save", function () {
    if (this.isNew) {
        this.id = this._id;
    }
});

export { addressSchema };
