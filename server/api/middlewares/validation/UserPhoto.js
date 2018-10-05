const validator = require('validator');
const constant = require('../../constant');
const validationMessage = require('../../validation_errors');
const validate_request = {
    validate_all_request: function (request_body, require_parameter) {
        for (var require_key in require_parameter) { 
            switch (require_parameter[require_key]) {
                case 'user':
                    if (!request_body['user']) {
                        return [constant.WARNING,validationMessage.USER_PHOTO.USER_PHOTO_USER_REQUIRED];
                    }
                    break;
                case 'locationType':
                    if (!request_body['locationType']) {
                        return [constant.WARNING, validationMessage.USER_PHOTO.USER_PHOTO_LOCATION_TYPE_REQUIRED];
                    }
                    
                    break;
                case 'latitude':
                    if (!request_body['latitude']) {
                        return [constant.WARNING, validationMessage.USER_PHOTO.USER_PHOTO_LATITUDE_REQUIRED];
                    }
                    break;
                case 'longitude':
                    if (!request_body['longitude']) {
                        return [constant.WARNING, validationMessage.USER_PHOTO.USER_PHOTO_LONGITUDE_REQUIRED];
                    }
                    break;
                case 'city':
                    if (!request_body['city']) {
                        return [constant.WARNING, validationMessage.USER_PHOTO.USER_PHOTO_CITY_REQUIRED];
                    }
                    break;
                case 'state':
                    if (!request_body['state']) {
                        return [constant.WARNING, validationMessage.USER_PHOTO.USER_PHOTO_STATE_REQUIRED];
                    }
                    break;
                case 'country':
                    if (!request_body['country']) {
                        return [constant.WARNING, validationMessage.USER_PHOTO.USER_PHOTO_COUNTRY_REQUIRED];
                    }
                    break;
                case 'zipCode':
                    if (!request_body['zipCode']) {
                        return [constant.WARNING, validationMessage.USER_PHOTO.USER_PHOTO_ZIPCODE_REQUIRED];
                    }
                    break;
            }
        }
    }
}
module.exports = validate_request;
