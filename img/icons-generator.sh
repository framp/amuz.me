#!/bin/bash
SIZES=(144 114 72 57)
NAMES=(\
  apple-touch-icon-144x144-precomposed.png \
  apple-touch-icon-114x114-precomposed.png \
  apple-touch-icon-72x72-precomposed.png \
  apple-touch-icon-57x57-precomposed.png \
)
TARGET=amuz-padded-backgrounded-bunny.svg
for i in $(seq 0 3)
do
  convert $TARGET -resize ${SIZES[$i]}x${SIZES[$i]} ${NAMES[$i]}
done
