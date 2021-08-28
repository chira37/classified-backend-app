const getSort = (param: string): Record<string, number> => {
    if (param) {
        if (param.endsWith("_ascend")) {
            const sortBy = param.slice(0, -7);
            return { [sortBy]: 1 };
        }
        if (param.endsWith("_descend")) {
            const sortBy = param.slice(0, -8);
            return { [sortBy]: -1 };
        }
    }
    return {};
};

export default getSort;
