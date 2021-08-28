/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";
import { Pagination } from "../types";
const getPagination = async (
    currentPage: number,
    itemsPerPage: number,
    query: any,
    model: string
): Promise<Pagination> => {
    const count = await mongoose.model(model).countDocuments(query);
    const totalPages = Math.ceil(count / itemsPerPage);

    let nextPage = null;
    let previousPage = null;

    if (currentPage < totalPages) nextPage = currentPage + 1;
    if (currentPage > 1) previousPage = currentPage - 1;

    const pagination = {
        total_pages: totalPages,
        current_page: currentPage,
        next_page: nextPage,
        previous_page: previousPage,
        total_items: count,
    };
    return pagination;
};

export default getPagination;
