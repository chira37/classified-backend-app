import { forEach } from "lodash";
import { ParsedQs } from "qs";

const getQuery = (params: { [key: string]: string | string[] | ParsedQs | ParsedQs[] }): Record<string, unknown> => {
    const query: Record<string, unknown> = {};
    forEach(params, (value, key) => {
        if (key.endsWith("_id")) {
            const newKey = key.slice(0, -3);
            if (Array.isArray(value)) {
                query[newKey] = { $in: value };
            } else {
                query[newKey] = value;
            }
        } else if (key.endsWith("_rg")) {
            const newKey = key.slice(0, -3);
            query[newKey] = { $regex: value, $options: "i" };
        } else if (key.endsWith("_start")) {
            const newKey = key.slice(0, -6);
            query[newKey] = { $gte: value };
        } else if (key.endsWith("_end")) {
            const newKey = key.slice(0, -4);
            query[newKey] = { $lte: value };
        } else if (key.endsWith("_tx")) {
            const newKey = "$text";
            query[newKey] = { $search: value };
        }
    });

    return query;
};

export default getQuery;
