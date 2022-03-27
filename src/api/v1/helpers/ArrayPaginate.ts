import { ArrayPaginateInterface } from "../interfaces/arrayPaginate";

const ArrayPaginate: ArrayPaginateInterface = (array, limit, page) => {
  // human-readable page numbers usually start with 1, so we reduce 1 in the first argument
  return array.slice((page - 1) * limit, page * limit);
};

export default ArrayPaginate;
