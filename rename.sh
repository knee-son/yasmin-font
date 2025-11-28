#!/bin/bash

src="assets/source"
dest="assets/alphabetical"

mkdir -p "$dest"

letters=( {a..z} )
i=0

for file in "$src"/*; do
    letter=${letters[$i]}
    mv "$file" "$dest/letter_${letter}.jpg"
    ((i++))
done
