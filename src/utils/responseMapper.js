const successResponse = (data) => {
    return {
        status: 'success',
        data: data,
        Timestamp: new Date().toISOString()
    };
}
const errorResponse = (error) => {
    return {
        status: 'error',
        message: error.message || 'An unexpected error occurred',
        Timestamp: new Date().toISOString()
    };
}
module.exports = {successResponse};
