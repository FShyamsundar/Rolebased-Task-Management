export const sendSuccess = (res, payload = {}, message = "Success", statusCode = 200) =>
  res.status(statusCode).json({
    success: true,
    message,
    ...payload
  });

export const createPaginationMeta = ({ total, page, limit }) => ({
  total,
  page,
  limit,
  totalPages: Math.ceil(total / limit)
});
