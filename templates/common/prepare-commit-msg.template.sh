#!/bin/sh

CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
ISSUE_ID=$(echo "$CURRENT_BRANCH" | grep -Eo "#[0-9]+")

if [ ! -z "$ISSUE_ID" ]; then
  COMMIT_FILE=$1

  # get first line
  HEADER=$(head -n 1 $1 )

  # get everything before colon
  TYPE=$(echo $HEADER | cut -d: -f1 | xargs printf '%-1s')

  # get everything after colon
  DESCRIPTION=$(echo $HEADER | cut -d: -f2-)

  PREPARED_HEADER="$TYPE: [$ISSUE_ID]$DESCRIPTION"

  # replace the first line
  sed -i "1s/.*/$PREPARED_HEADER/" $1

  printf "Prepared Commit Message:\n\n"
  echo "$(cat $1)"
fi
