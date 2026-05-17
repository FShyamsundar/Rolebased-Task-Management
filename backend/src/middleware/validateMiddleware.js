export const validate = (schema) => (req, _res, next) => {
  const result = schema.safeParse({
    body: req.body,
    params: req.params,
    query: req.query
  });

  if (!result.success) {
    const error = new Error(
      result.error.issues.map((issue) => issue.message).join(", ")
    );
    error.statusCode = 400;
    return next(error);
  }

  req.validated = result.data;
  next();
};
