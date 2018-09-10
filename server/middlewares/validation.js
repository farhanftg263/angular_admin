const validator = require('validator');
const httpResponseCode=require('../helpers/httpResponseCode')
const httpResponseMessage=require('../helpers/httpResponseMessage')
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
                            return [httpResponseCode.BAD_REQUEST,httpResponseMessage.CORRECT_EMAIL];
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
                 case 'deviceToken':
                    if (!request_body['deviceToken']) {
                        return [403, "Device token is required"];
                    }
                    break;
                case 'facebookId':
                    if (!request_body['facebookId']) {
                        return [403, "facebookId is required"];
                    }
                    break;
                     case 'googleId':
                    if (!request_body['googleId']) {
                        return [403, "googleId is required"];
                    }
                    break;
                       case 'socialId':
                    if (!request_body['socialId']) {
                        return [403, "socialId is required"];
                    }
                    break;
                case 'cardNumber':
                    if (!request_body['cardNumber']) {
                        return [403, "Card Number is required"];
                    }
                    break;
                     case 'registrationType':
                    if (!request_body['registrationType']) {
                        return [403, "Registration Type is required"];
                    }
                    break;
                     case 'userType':
                    if (!request_body['userType']) {
                        return [403, "userType is required"];
                    }
                    break;
                     case 'latitude':
                    if (!request_body['latitude']) {
                        return [403, "latitude is required"];
                    }
                    break;
                     case 'longitude':
                    if (!request_body['longitude']) {
                        return [403, "longitude is required"];
                    }
                    break;
                     case 'cardNumber':
                    if (!request_body['cardNumber']) {
                        return [403, "Card Number is required"];
                    }
                    break;
                     case 'name':
                    if (!request_body['name']) {
                        return [403, "Name on is required"];
                    }
                    break;
                     case 'cvv':
                    if (!request_body['cvv']) {
                        return [403, "Cvv is required"];
                    }
                    break;
                    
                case 'cardExpiry':
                    if (!request_body['cardExpiry']) {
                        return [403, "card Expiry is required"];
                    }
                    break;
                case 'cardType':
                    if (!request_body['cardType']) {
                        return [403, "Card type is required"];
                    }
                    break;
                case 'userId':
                    if (!request_body['userId']) {
                        return [403, "User Id is required"];
                    }
                    break;
                      case 'supplierId':
                    if (!request_body['supplierId']) {
                        return [403, "Supplier Id is required"];
                    }
                     case 'productId':
                    if (!request_body['productId']) {
                        return [403, "Product Id is required"];
                    }
                    break;
                     case 'orderId':
                    if (!request_body['orderId']) {
                        return [403, "orderId Id is required"];
                    }
                    break;
                    case 'addressId':
                    if (!request_body['addressId']) {
                        return [403, "address  Id is required"];
                    }
                    break;
                     case 'cardId':
                    if (!request_body['cardId']) {
                        return [403, "card  Id is required"];
                    }
                    break;
                case 'country_code':
                    if (!request_body['country_code']) {
                        return [403, "country code is required"];
                    }
                    break;
                case 'otp':
                    if (!request_body['otp']) {
                        return [403, "OTP is required"];
                    }
                    break;
                case 'referral_code':
                    if (!request_body['referral_code']) {
                        return [403, "referral code is required"];
                    }
                    break;
                case 'bucket_name':
                    if (!request_body['bucket_name']) {
                        return [403, "Bucket name is required"];
                    }
                    break;
                case 'bucket_image':
                    if (!request_body['bucket_image']) {
                        return [403, "Bucket image is required"];
                    }
                    break;
                case 'service_id':
                    if (!request_body['service_id']) {
                        return [403, "Service id is required"];
                    }
                    break;
                case 'vendor_id':
                    if (!request_body['vendor_id']) {
                        return [403, "Vendor id is required"];
                    }
                    break;
                case 'user':
                    if (!request_body['user']) {
                        return [403, "User is required"];
                    }
                    break;
                case 'action':
                    if (!request_body['action']) {
                        return [403, "Action is required"];
                    }
                    break;
                case 'vehicle_id':
                    if (!request_body['vehicle_id']) {
                        return [403, "Please select a Vehicle"];
                    }
                    break;
                case 'type':
                    if (!request_body['type']) {
                        return [403, "Type is required"];
                    }
                    break;
                case 'vehicle_id':
                    if (!request_body['address']) {
                        return [403, "Address is required"];
                    }
                    break;
                case 'location':
                    if (!request_body['location']) {
                        return [403, "Location is required"];
                    }
                    break;
                case 'place_id':
                    if (!request_body['place_id']) {
                        return [403, "Please enter place id"];
                    }
                    break;
                case 'oldPassword':
                    if (!request_body['oldPassword']) {
                        return [403, "Please enter old password"];
                    }
                    break;
                case 'newPassword':
                    if (!request_body['newPassword']) {
                        return [403, "Please enter new password"];
                    }
                    break;
                case 'key':
                    if (!request_body['key']) {
                        return [403, "key is required"];
                    }
                    break;
                case 'seq':
                    if (!request_body['seq']) {
                        return [403, "sequence is required"];
                    }
                    break;
                case 'answer':
                    if (!request_body['answer']) {
                        return [403, "Answer is required"];
                    }
                    break;
                case 'categoryName':
                    if (!request_body['categoryName']) {
                        return [403, "categoryName is required"];
                    }
                    break;
                case 'productCategory':
                    if (!request_body['productCategory']) {
                        return [403, "productCategory is required"];
                    }
                    break;
                case 'subscriptionName':
                    if (!request_body['subscriptionName']) {
                        return [403, "Subscription Name is required"];
                    }
                    break;
                case 'packageName':
                    if (!request_body['packageName']) {
                        return [403, "Package Name is required"];
                    }
                    break;
                case 'advertisementName':
                    if (!request_body['advertisementName']) {
                        return [403, "Advertisement Name is required"];
                    }
                    break;
            }
        }
    }
}
module.exports = validate_request;
