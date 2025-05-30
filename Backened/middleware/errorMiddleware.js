// errorMiddleware.js
const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack
        });
    } else {
        // Production: don't leak error details
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    }
};

module.exports = { errorHandler };