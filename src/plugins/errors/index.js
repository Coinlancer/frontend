function createError(errorName) {
    var err = function (code, msg) {
        this.name = errorName;
        this.code = (code || "");
        this.msg = (msg || "");
    };

    err.prototype = Error.prototype;
    return err;
}

const errorCodes = {
    NETWORK_ERROR: 'Connection error',
};

const apiErrorCodes = {
    ERR_SERVICE: 'Service error. Try again later.',
    ERR_NOT_ALLOWED: 'Operation not allowed for your account',
    ERR_NOT_FOUND: 'Record not found',
    ERR_ALREADY_EXISTS: 'Record already exists',
    ERR_BAD_PARAM: 'Invalid parameter',
    ERR_EMPTY_PARAM: 'Empty parameter',
    ERR_NOT_ACTIVATED: 'Account not activated',
    ERR_BAD_SIGN: 'Unauthorized request',
    ERR_DUPLICATE: 'Record already added',
    ERR_FILESIZE: 'File size is too much'
};

const Errors = {
    install (Vue, options) {
        let codes = {};
        for (var c in errorCodes) {
            codes[c] = c;
        }

        Vue.prototype.$errors = Vue.errors = {
            codes: codes,
            innerError: function (code) {
                let err = createError('innerError');
                let msg = errorCodes[code] || '';
                return new err(code, msg);
            },

            apiError: function (code, api_msg) {
                let err = createError('apiError');
                return new err(code, api_msg);
            },

            handle: function (err, userMessage, handler) {

                console.error(err);

                handler = handler || Vue.helpers.errorMsg;

                if (!err instanceof Error) {
                    throw new Error('Cannot handle error');
                }

                if (typeof userMessage == 'string' && userMessage.length) {
                    return handler(userMessage, null, null);
                }

                switch (err.code) {
                    case 'ERR_SERVICE':
                        return handler(apiErrorCodes.ERR_SERVICE + (err.msg ? ': ' + err.msg : ''), err.code || '', err);
                    case 'ERR_NOT_FOUND':
                        return handler(apiErrorCodes.ERR_NOT_FOUND + (err.msg ? ': ' + err.msg : ''), err.code || '', err);
                    case 'ERR_ALREADY_EXISTS':
                        return handler(apiErrorCodes.ERR_ALREADY_EXISTS + (err.msg ? ': ' + err.msg : ''), err.code || '', err);
                    case 'ERR_BAD_PARAM':
                        return handler(apiErrorCodes.ERR_BAD_PARAM + (err.msg ? ': ' + err.msg : ''), err.code || '', err);
                    case 'ERR_EMPTY_PARAM':
                        return handler(apiErrorCodes.ERR_EMPTY_PARAM + (err.msg ? ': ' + err.msg : ''), err.code || '', err);
                    case 'ERR_NOT_ACTIVATED':
                        return handler(apiErrorCodes.ERR_NOT_ACTIVATED + (err.msg ? ': ' + err.msg : ''), err.code || '', err);
                    case 'ERR_BAD_SIGN':
                        return handler(apiErrorCodes.ERR_BAD_SIGN + (err.msg ? ': ' + err.msg : ''), err.code || '', err);
                    case 'ERR_NOT_ALLOWED':
                        return handler(apiErrorCodes.ERR_NOT_ALLOWED + (err.msg ? ': ' + err.msg : ''), err.code || '', err);
                    case 'ERR_DUPLICATE':
                        return handler(apiErrorCodes.ERR_DUPLICATE + (err.msg ? ': ' + err.msg : ''), err.code || '', err);
                    case 'ERR_FILESIZE':
                        return handler(apiErrorCodes.ERR_FILESIZE + (err.msg ? ': ' + err.msg : ''), err.code || '', err);
                    default:
                        return handler('Service error. Contact support', err.code || '', err);
                }
            }
        }
    }
};

export default Errors;