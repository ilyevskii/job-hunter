#!/bin/sh

npm run infra |
while read line;
do
  if [[ $line =~ "Ready to accept connections" ]]
    then
      echo $line
      npm run turbo-start &
    else echo $line
  fi;
done
