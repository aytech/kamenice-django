#!/usr/bin/env bash

PUBLIC_URL=/static npm run build && (cd build && zip -r ../build.zip .)
