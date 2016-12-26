#!/bin/bash

rm -rf man
mkdir man

for file in node/doc/api/*; do
  basename=$(basename $file)
  echo ronn $file
  ronn --roff $file --pipe > man/${basename/.markdown/.3}
done
