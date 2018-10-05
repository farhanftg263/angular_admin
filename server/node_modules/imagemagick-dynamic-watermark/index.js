/**
 * imagemagick-dynamic-watermark
 *
 *
 * Copyright (c) 2017 Sadegh Mohebbi
 * Licensed under the MIT license.
 */

/**
 * ImageMagick Dynamic Watermark is npm watermark module to add watermark over cropped or original image.
 * @param  {options}
 * @return {callback}
 */

const gm = require('gm');
const imageMagick = gm.subClass({imageMagick: true});

imageMagick.prototype.cropOnAspect = function(gravity, width, height) {
    return this.gravity(gravity)
        .crop(width, height);
}

imageMagick.prototype.overlayImage = function(logo, gravity, resize) {
    return this.gravity(gravity)
        .out('(', logo, ' ', '-resize', resize, ')')
        .out('-composite');
}

function resizeTo(width, height) {
    return width + 'x' + height + '>';
}

var apply = function (options, callback) {

    var source = options.source;   // Source file path
    var destination = options.destination; // Destination file path

    var type = options.type;//watermark, crop, crop_watermark
    
    if (source && destination && type) {
        imageMagick(source).size(function (err, size) {
            if (err) callback(err, false);

            var watermark_params = options.watermark;
            var crop_params = options.crop;

            /* 
            resize watermark logo by keeping aspect ratio or resize it to 
            provided percent of source image or fixed size
             */
            var logoWidth, logoHeight;
            if (watermark_params && watermark_params.logo) {
                imageMagick(watermark_params.logo).size(function (err, logoSize) {
                    if (err) callback(err, false);

                    if (watermark_params.logoWidthPercent && watermark_params.logoHeightPercent) {
                        logoWidth = watermark_params.logoWidthPercent * size.width;
                        logoHeight = watermark_params.logoHeightPercent * size.height;
                    } else if (watermark_params.logoWidthPercent) {
                        logoWidth = watermark_params.logoWidthPercent * size.width;
                        //calculate logoHeight with keeping aspect ratio
                        logoHeight = (logoSize.height * logoWidth) / logoSize.width;
                    } else if (watermark_params.logoHeightPercent) {
                        logoHeight = watermark_params.logoHeightPercent * size.height;
                        //calculate logo with keeping aspect ratio
                        logoWidth = (logoSize.width * logoHeight) / logoSize.height;
                    } else {
                        if (watermark_params.logoWidth && watermark_params.logoHeight) {
                            logoWidth = watermark_params.logoWidth;
                            logoHeight = watermark_params.logoHeight;
                        } else {
                            callback(new Error("logo logoWidth x logoHeight is "+watermark_params.logoWidth+" x "+watermark_params.logoHeight), false);
                        }
                    }
    
                    if (type == "watermark") {
                        /*
                        watermark: {
                            logo: String -> logo file path
                            gravity: String -> NorthWest | North | NorthEast | West | Center | East | SouthWest| South | SouthEast,
                            logoWidth: Number,
                            logoHeight: Number,
                            logoWidthPercent: Number,
                            logoHeightPercent: Number
                        } 
                         */
                        imageMagick(source)
                            .overlayImage(watermark_params.logo, watermark_params.gravity, resizeTo(logoWidth, logoHeight))
                            .write(destination, function (e) {
                                callback(null, true);
                            });
                    } else if (type == "crop_watermark") {
                        imageMagick(source)
                            .resize(crop_params.width, crop_params.height, "^")
                            .cropOnAspect(crop_params.gravity, crop_params.width, crop_params.height)
                            .overlayImage(watermark_params.logo, watermark_params.gravity, resizeTo(logoWidth, logoHeight))
                            .write(destination, function (e) {
                                callback(null, true);
                            });
                    } else {
                        callback(new Error("type is not valid"), false);
                    }
                });
            }

            if (type == "crop") {
                /*
                 crop: {
                     gravity: String -> NorthWest | North | NorthEast | West | Center | East | SouthWest| South | SouthEast,
                     width: Number,
                     height: Number
                 } 
                 */
                if (crop_params.width && crop_params.height) {
                    imageMagick(source)
                        .resize(crop_params.width, crop_params.height, "^")
                        .cropOnAspect(crop_params.gravity, crop_params.width, crop_params.height)
                        .write(destination, function (e) {
                            console.log(e || 'Done. Path : ' + destination);
                            callback(null, true);
                        });
                } else {
                    callback(new Error("crop width x height is "+crop_params.width+" x "+crop_params.height), false);
                }
            } else {
                callback(new Error("type is not valid"), false);
            }
        });
    } else {
        callback("source is "+source+", logo is "+logo+", destination is "+destination+", type is "+type, false);
    }
};

module.exports.apply = apply;
