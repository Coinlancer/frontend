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
    ERR_NOT_FOUND: 'Record not found',
    ERR_ALREADY_EXISTS: 'Record already exists',
    ERR_BAD_PARAM: 'Invalid parameter',
    ERR_EMPTY_PARAM: 'Empty parameter',
    ERR_NOT_ACTIVATED: 'Account not activated',
    ERR_BAD_SIGN: 'Unauthorized request',
    ERR_NOT_ALLOWED: 'Operation is not allowed for your account'
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
                let msg = apiErrorCodes[code] || api_msg;
                return new err(code, msg);
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

                switch (err.name) {
                    case 'apiError':
                        switch (err.message) {
                            //api errors
                            case 'ERR_ALREADY_EXISTS':
                                return handler(apiCodes.ERR_ALREADY_EXISTS, err.code || '', err);

                            case 'ERR_BAD_PARAM':
                                return handler(apiCodes.ERR_BAD_PARAM, err.code || '', err);

                            case 'ERR_BAD_SIGN':
                                return handler(apiCodes.ERR_BAD_SIGN, err.code || '', err);

                            case 'ERR_BAD_TYPE':
                                return handler(apiCodes.ERR_BAD_TYPE, err.code || '', err);

                            case 'ERR_EMPTY_PARAM':
                                return handler(apiCodes.ERR_EMPTY_PARAM, err.code || '', err);

                            case 'ERR_INV_EXPIRED':
                                return handler(apiCodes.ERR_INV_EXPIRED, err.code || '', err);

                            case 'ERR_INV_REQUESTED':
                                return handler(apiCodes.ERR_INV_REQUESTED, err.code || '', err);

                            case 'ERR_NOT_ALLOWED':
                                return handler(apiCodes.ERR_NOT_ALLOWED, err.code || '', err);

                            case 'ERR_NOT_FOUND':
                                return handler(apiCodes.ERR_NOT_FOUND + (err.description ? ': ' + err.description : ''), err.code || '', err);

                            case 'ERR_ROUTE_NOT_FOUND':
                                return handler(apiCodes.ERR_ROUTE_NOT_FOUND, err.code || '', err);

                            case 'ERR_TOO_MUCH_INVITEES':
                                return handler(apiCodes.ERR_TOO_MUCH_INVITEES, err.code || '', err);

                            case 'ERR_SERVICE':
                                return handler(apiCodes.ERR_SERVICE, err.code || '', err);

                            default:
                                return handler('Service error. Contact support', err.code || '', err);
                        }
                        break;
                    default:
                        return handler('Service error. Contact support', err.code || '', err);
                }
            }
        }
    }
}

export default Errors;