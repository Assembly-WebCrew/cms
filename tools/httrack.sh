#!/usr/bin/env bash

while [[ $# -gt 0 ]]
do
key="$1"
case ${key} in
    -h|--help)
	echo "usage: httrack.sh <site_slug>"
	exit
    ;;
    *)
    SITE_SLUG=${key}
    httrack --robots=0 -A0 --verbose --disable-security-limits -%c100 -c20 -%k -%l en --can-go-down -www.assembly.org/\* +www.assembly.org/${SITE_SLUG}/\* http://www.assembly.org/${SITE_SLUG}/ -\*\?lang=\* -\*\?set_language=\* -\*\?searchterm=\* -\*/search\?\* -\*/search_rss\?\*
    ;;
esac
shift
done