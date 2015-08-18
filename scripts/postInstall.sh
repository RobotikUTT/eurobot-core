#!/bin/bash

CSS_LIB_DIST="src/controlPanel/public/css/lib"
JS_LIB_DIST="src/controlPanel/public/js/lib"


## Copy client-side library into appropriate folder

mkdir $CSS_LIB_DIST
mkdir $JS_LIB_DIST

# CSS libs
cp node_modules/bootstrap/dist/css/bootstrap.min.css $CSS_LIB_DIST
cp node_modules/font-awesome/css/font-awesome.min.css $CSS_LIB_DIST
cp -r node_modules/font-awesome/fonts $CSS_LIB_DIST/../

# JS libs
cp node_modules/bootstrap/dist/js/bootstrap.min.js $JS_LIB_DIST
cp node_modules/jquery/dist/jquery.min.js $JS_LIB_DIST
cp node_modules/flot/jquery.flot.js $JS_LIB_DIST

## Build and copy client-side files into build folder
gulp