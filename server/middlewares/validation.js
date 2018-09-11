const validator = require('validator');
const constant = require('../constant');
const validate_request = {
    validate_all_request: function (request_body, require_parameter) {
        for (var require_key in require_parameter) { 
            switch (require_parameter[require_key]) {
                case 'email':
                    if (!request_body['email']) {
                        return [403, "Email-id is required"];
                    }
                    else {                                    
                        if(!validator.isEmail(request_body['email'])){
                            return [403,'Email is not correct format'];
                        }
                     //   return true
                    }
                    break;
                case 'phoneNumber':
                    if (!request_body['phoneNumber']) {
                        return [403, "Phone number is required"];
                    }
                    break;
                case 'password':
                    if (!request_body['password']) {
                        return [403, "password is required"];
                    }
                    break;
                     
                   
                case 'name':
                    if (!request_body['name']) {
                        return [403, " name is required"];
                    }
                    break;
                case 'accessToken':
                    if (!request_body['accessToken']) {
                        return [403, "access Token is required"];
                    }
                    break;
                case '_id':
                    if (!request_body['_id']) {
                        return [403, "_id parameter is required"];
                    }
                    break;
            }
        }
    }
}
module.exports = validate_request;
