# !/bin/sh
echo [chatrello package] Package target directory to publish in store.
zip chatrello-`git log -1 --format="%H"` target/*
