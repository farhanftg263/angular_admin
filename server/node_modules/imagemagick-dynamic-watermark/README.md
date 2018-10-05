# ImageMagick Dynamic Watermark

ImageMagick Dynamic Watermark is npm watermark module to add watermark over cropped or original image.

```
npm install imagemagick-dynamic-watermark
```
### Getting started
First download and install [GraphicsMagick](http://www.graphicsmagick.org/) or [ImageMagick](http://www.imagemagick.org/). In Mac OS X, you can simply use [Homebrew](http://mxcl.github.io/homebrew/) and do:

    brew install imagemagick
    brew install graphicsmagick

If you want WebP support with ImageMagick, you must add the WebP option:

    brew install imagemagick --with-webp

After successful installation of imagemagick-dynamic-watermark follow below steps:

### Step 1: include imagemagick-dynamic-watermark package:
```
var dyWatermark = require('imagemagick-dynamic-watermark');
```

### Step 2: Provide following options:
```
var options = {
    source: './public/images/a1.jpg',
    destination: './public/images/a1_edited/jpg',
    type: 'watermark' or 'crop' or 'crop_watermark',

    //if type contain watermark
    watermark: {
        logo: './assets/logo.png',
        gravity: 'NorthWest' or 'North' or 'NorthEast' or 'West' or 'Center' or 'East' or 'SouthWest' or 'South' or 'SouthEast'
        logoWidth: 100,
        logoHeight: 100

        //for relative watermark logo size (logoWidth and logoHeight are ignored)
        //one of them cased to calculating another width or height with keeping ratio
        logoWidthPercent: 0.1
        logoHeightPercent: 0.1
    },

    //if type contain crop
    crop: {
        gravity: 'NorthWest' or 'North' or 'NorthEast' or 'West' or 'Center' or 'East' or 'SouthWest' or 'South' or 'SouthEast'
        width: 100,
        height: 100
    }
}
```

### Step 3: Final step is to call apply method by passing above options.
```
dyWatermark.apply(optionsImageWatermark, (err, isOk) => {
    if (err) throw new Error(err);
    //do something, happy coding!
});
```
this module is base on [Dynamic Watermark](https://github.com/navjotdhanawat/dynamic-watermark) with some fixing 
[Open issues](https://github.com/sadeghmohebbi/imagemagick-dynamic-watermark/issues)
