#!/bin/bash

function random_int {
  local min="$1"
  local max="$2"
  local range
  local num

  # Calculate the range
  range=$((max - min + 1))

  # Generate a random number within the range
  num=$((RANDOM % range + min))

  echo "$num"
}

IFS=$'\n' read -d '' -r -a WORDS < ./assets/g5lgg-words.txt
IFS=$'\n' read -d '' -r -a USED_INDICIES < ./data/used_ind.txt

MIN_INDEX=1
MAX_INDEX=${#WORDS[@]}

new_index=$(random_int $MIN_INDEX $MAX_INDEX)
while [[ " ${USED_INDICIES[@]} " =~ " ${new_index} " ]]; do
  new_index=$(random_int $MIN_INDEX $MAX_INDEX)
done

echo -e "$new_index" >> ./data/used_ind.txt
echo -n "$new_index" > ./data/activeIndex.txt