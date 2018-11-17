#!/usr/bin/env node

// 3rd Party lib
const { Converter } = require('aws-sdk/clients/dynamodb')
const { marshall } = Converter

const table2items = require(`./items.json`)

const result = {}
for (const [table, items] of Object.entries(table2items)) {
    result[`dev-${table}`] = items.map(x => ({ PutRequest: { Item: marshall(x) }}))
}

console.log(JSON.stringify(result, null, 2))
