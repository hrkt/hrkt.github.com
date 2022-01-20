#!/bin/sh

for f in index.html app.js app.css; do
  curl https://raw.githubusercontent.com/hrkt/my-pdf-slideshow/main/${f} -O
done
