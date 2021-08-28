import { model, Schema } from "mongoose";
import { Address } from "../types/models";

const addressSchema = new Schema({
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
