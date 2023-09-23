#!/bin/sh

# Move into LibRaw directory
cd $(dirname $0)/LibRaw
# Create Makefile for wasm build
echo 'all: lib/libraw.wasm' > Makefile
cat Makefile.dist >> Makefile
# Delete default target
sed -i "" -e '/all: library all_samples/d' Makefile
# Change compiler to emcc
# sed -i "" -e 's/CC=gcc/CC=emcc/' Makefile
sed -i "" -e 's/CXX=g++/CXX=em++/' Makefile
# Disable zlib
sed -i "" -e '/CFLAGS+=-DUSE_ZLIB/d' Makefile
sed -i "" -e '/LDADD+=-lz/d' Makefile
# Add wasm target
# cat << EOF >> Makefile
# lib/libraw.wasm: \${LIB_OBJECTS}
# 	emcc -O2 -o lib/libraw.js -s MODULARIZE=1 -s LINKABLE=1 -s EXPORT_ALL=1 -s ALLOW_MEMORY_GROWTH=1 \${LIB_OBJECTS}
# EOF
cat << EOF >> Makefile
lib/libraw.wasm: \${LIB_OBJECTS}
	emcc -O2 -o lib/libraw.js -s MODULARIZE=1 -s 'EXPORT_NAME="createLibRaw"' -s 'EXPORTED_FUNCTIONS=["_libraw_open_buffer","_libraw_init","_libraw_unpack","_libraw_raw2image","_libraw_dcraw_process","_libraw_dcraw_make_mem_image","_libraw_get_raw_image","_libraw_set_use_camera_wb"]' -s ALLOW_MEMORY_GROWTH=1 \${LIB_OBJECTS}
EOF
# Add special export functions
cat << EOF >> src/libraw_c_api.cpp
extern "C" DllDef ushort *libraw_get_raw_image(libraw_data_t *lr){if(!lr)return NULL;return lr->rawdata.raw_image;}
extern "C" DllDef void libraw_set_use_camera_wb(libraw_data_t *lr, int value){if(!lr)return;lr->params.use_camera_wb = value;}
EOF

# Build wasm
make

# Remove functions
sed -i "" -e '$d' src/libraw_c_api.cpp
sed -i "" -e '$d' src/libraw_c_api.cpp
# Remove Makefile
rm Makefile

# Move into repository root
cd ..
# Move wasm build to dist
mkdir dist
mv LibRaw/lib/libraw.js dist/libraw.js
mv LibRaw/lib/libraw.wasm dist/libraw.wasm
