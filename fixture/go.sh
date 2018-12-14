TARGET="_request.json"

#FIXME: Max 25 'Request' in a batch,
#       must call multiple batch of 25 'Put Request' each

./items2request.js > ${TARGET}
aws dynamodb batch-write-item --request-items file://${TARGET}
rm ${TARGET}
