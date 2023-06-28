#!/bin/bash
URL="http://127.0.0.1:32503/"  # Replace with your actual application URL
CONCURRENT_REQUESTS=5
DURATION_SECONDS=300

for ((i=0; i<CONCURRENT_REQUESTS; i++)); do
    curl -s -o /dev/null -w "%{http_code}\n" $URL &
done

sleep $DURATION_SECONDS
