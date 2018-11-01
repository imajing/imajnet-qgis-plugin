#!/bin/bash
pwd

json_file=./tmp.json

firstLine=$(head -n 1 $1)

if [[ $firstLine = *"function"* ]]; then
  echo { > $json_file
  tail -n+3 $1 | head -n -2 >> $json_file
  echo } >> $json_file
else
	if [[ $firstLine = *"define"* ]]; then
	  echo { > $json_file
	  tail -n+2 $1 | head -n -1 >> $json_file
	  echo } >> $json_file
	else
	  cat $1 > $json_file
	fi
fi


cat $json_file | python -m json.tool  >> /dev/null && exit 0 || echo "language file not valid:" $1; exit 1

