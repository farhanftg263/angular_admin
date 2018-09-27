const validator = require('validator');
const constant = require('../../constant');
const validationMessage = require('../../validation_errors');
const validate_request = {
    validate_all_request: function (request_body, require_parameter) {
        for (var require_key in require_parameter) { 
            switch (require_parameter[require_key]) {
                case 'email':
                    if (!request_body['email']) {
                        return [constant.WARNING,validationMessage.USER.EMAIL_ID_REQUIRED];
                    }
                    else if(!validator.isEmail(request_body['email'])){
                        return [constant.WARNING,validationMessage.USER.EMAIL_INVALID];
                    }
                    else if(!validator.isLength(request_body['email'],{ min: 6 , max : 50 }))
                    {
                        return [constant.WARNING, validationMessage.USER.EMAIL_LENGTH_VALIDATION];
                    }
                    break;
                case 'password':
                    if (!request_body['password']) {
                        return [constant.WARNING, validationMessage.USER.PASSWORD_REQUIRED];
                    }
                    else if(!validator.isLength(request_body['password'],{ min: 6, max:20 }))
                    {
                        return [constant.WARNING,validationMessage.USER.PASSWORD_LENGTH_VALIDATION];
                    }
                    break;
                   
                case 'firstName':
                    if (!request_body['firstName']) {
                        return [constant.WARNING, validationMessage.USER.FIRST_NAME_REQUIRED];
                    }
                    else if(!validator.isLength(request_body['firstName'],{min:6 , max:20}))
                    {
                        return [constant.WARNING,validationMessage.USER.FIRST_NAME_LENGTH_VALIDATION];
                    }
                    break;
                case 'lastName':
                    if(!request_body['lastName'])
                    {
                        return [constant.WARNING,validationMessage.USER.LAST_NAME_REQUIRED]
                    }
                    else if(!validator.isLength(request_body['lastName'],{min:6, max:20}))
                    {
                        return [constant.WARNING,validationMessage.USER.LAST_NAME_LENGTH_VALIDATION];
                    }
                    break;
                case 'dob':
                    if(!request_body['dob'])
                    {
                        return [constant.WARNING,validationMessage.USER.DOB_REQUIRED];
                    }
                    break;
                case 'country':
                    if(!request_body['country'])
                    {
                        return [constant.WARNING,validationMessage.USER.COUNTRY_REQUIRED];
                    }
                   break;
                case 'zipCode':
                    if(!request_body['zipCode'])
                    {
                        return [constant.WARNING,validationMessage.USER.ZIPCODE_REQUIRED];
                    }
                    break;
                case '_id':
                    if (!request_body['_id']) {
                        return [constant.WARNING, validationMessage.USER.ID_PARAMETER_REQUIRED];
                    }
                    break;
            }
        }
    }
}
module.exports = validate_request;
