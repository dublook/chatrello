# !/bin/sh
echo '[chatrello build] Copy manifest.json to target folder'
cp src/manifest.json target/manifest.json
echo '[chatrello build] Copy menuitem.css to target folder'
cp closure-library/closure/goog/css/menuitem.css target/
echo '[chatrello build] Copy menu.css to target folder'
cp closure-library/closure/goog/css/menu.css target/
echo '[chatrello build] Copy menubutton.css to target folder'
cp closure-library/closure/goog/css/menubutton.css target/

echo '[chatrello build] Compile with closure compiler'
python closure-library/closure/bin/calcdeps.py \
  -c compiler-latest/compiler.jar \
  -p closure-library/closure/ \
  -i ./src/TrelloService.js \
  -i ./src/ChatworkCtrl.js \
  -i ./src/StorageService.js \
  -i ./src/trello/ \
  -o compiled \
  -f "--warning_level=VERBOSE" \
    > target/content.js
  # -f "--compilation_level=ADVANCED_OPTIMIZATIONS" \
