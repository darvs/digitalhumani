TARGET="_request.json"

./items2request.js > ${TARGET}
aws dynamodb batch-write-item --request-items file://${TARGET}
rm ${TARGET}
