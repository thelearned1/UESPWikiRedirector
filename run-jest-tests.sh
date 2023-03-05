#!/bin/bash


FILE_NAME='./background';
FILE_EXT='.js'
TEST_FILE_NAME=$FILE_NAME-module$FILE_EXT
SOURCE_FILE=$FILE_NAME$FILE_EXT

# take all lines between "//SED:FUNCTION START" and "//SED:FUNCTION END"
# and append into a new file called $TEST_FILE_NAME
sed -n '/^\/\/SED:TEST START/,/^\/\/SED:TEST END/{p;}' $SOURCE_FILE > $TEST_FILE_NAME
# ensure that $TEST_FILE_NAME exports the function we're testing
echo "module.exports = getUespPage;" >> $TEST_FILE_NAME

# run the tests
npx jest
