#!/bin/sh

touch README.md
git init
git add README.md
git commit -m "first commit"
git remote add origin https://github.com/hrkt/hrkt.github.com.git
git push -u origin master


