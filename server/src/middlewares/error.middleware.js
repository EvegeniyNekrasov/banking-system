import HttpStatus from "../constants/status_codes.js";

const error_handler = (err, req, res, next) => {
  console.error(err);
  const status = err.status || HttpStatus.INTERNAL_SERVER_ERROR;
  const message = err.message || "Internal error";
  res.status(status).json({ message });
};

export default error_handler;
