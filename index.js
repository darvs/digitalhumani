// Built-in
const { log } = console

// 3rd party lib
const serverless = require('serverless-http')
const bodyParser = require('body-parser')
const express = require('express')
const AWS = require('aws-sdk')
const { v4 } = require('uuid'); // ex. '3a017fc5-4f50-4db9-b0ce-4547ba0a1bfd' (uuid v4 is random)


const app = express()

const { ENTERPRISE_TABLE, PROJECT_TABLE, USER_TABLE, TREE_TABLE, REPORT_TABLE } = process.env

const dynamoDb = new AWS.DynamoDB.DocumentClient()

app.use(bodyParser.json({strict: false}))

app.get('/', (req, res) => {
    res.send('Welcome to Digital Humani')
})

// FIXME: For tree creation, validate existence of userId, projectId and
// enterpriseId. For enterpriseId we should use credential to infer correct
// enterpriseId.

// ------------------------------------------------------------------------------
// report (FIXME)
// ------------------------------------------------------------------------------

// FIXME: API call to Generate all monthly report Item

app.get('/report', (req, res) => { // Return back all monthly reports
    const TableName = REPORT_TABLE

    dynamoDb.scan(
        { TableName },
        (error, data) => {
            if (error) {
                log(error)
                res.status(400).json({error, message: `Can not list Report.`})
            } else {
                res.json(data.Items)
            }
        }
    )
})

app.get('/report/enterprise/:enterpriseId', (req, res) => {

    const enterpriseId = req.params.enterpriseId.toLowerCase()

    if (!enterpriseId.match(/^[0-9a-f]{8}$/)) {
        res.status(400).json({message: `The "enterpriseId" must be 8 hex digit string. Got "${enterpriseId}" instead.`})
    } else {
        const TableName = REPORT_TABLE

        const query = { enterpriseId }

        const KeyConditionExpression = Object.keys(query).map(x => `#${x[0]} = :${x[0]}`).join()

        // { "#n": "name" }
        const ExpressionAttributeNames = Object
            .keys(query)
            .map(x => ({ [`#${x[0]}`] : x }))
            .reduce((x, acc) => Object.assign(acc, x), {})

        // { ":n": "John" }
        const ExpressionAttributeValues = Object
            .keys(query)
            .map(x => ({ [`:${x[0]}`] : query[x] }))
            .reduce((x, acc) => Object.assign(acc, x), {})

        dynamoDb.query(
            {
                TableName,
                KeyConditionExpression,
                ExpressionAttributeNames,
                ExpressionAttributeValues,
            },
            (error, data) => {
                if (error) {
                    log(error)
                    res.status(400).json({error, message: `Can not get report of enterpriseId "${enterpriseId}"`})
                } else {
                    res.json(data)
                }
            }
        )
    }
})

app.get('/report/enterprise/:enterpriseId/:monthDate', (req, res) => { // Sent back report :date 'YYYY-MM' for enterpriseId
    const enterpriseId = req.params.enterpriseId.toLowerCase()
    const monthDate = req.params.monthDate

    if (!enterpriseId.match(/^[0-9a-f]{8}$/)) {
        res.status(400).json({message: `The "enterpriseId" must be 8 hex digit string. Got "${enterpriseId}" instead.`})
    } else if (!monthDate.match(/^\d{4}-\d{2}$/)) {
        res.status(400).json({message: `The "monthDate" must be "YYYY-MM" string. Got "${monthDate}" instead.`})
    } else {
        const TableName = REPORT_TABLE

        const query = { enterpriseId, monthDate }

        const KeyConditionExpression = Object.keys(query).map(x => `#${x[0]} = :${x[0]}`).join(' AND ')

        // { "#n": "name" }
        const ExpressionAttributeNames = Object
            .keys(query)
            .map(x => ({ [`#${x[0]}`] : x }))
            .reduce((x, acc) => Object.assign(acc, x), {})

        // { ":n": "John" }
        const ExpressionAttributeValues = Object
            .keys(query)
            .map(x => ({ [`:${x[0]}`] : query[x] }))
            .reduce((x, acc) => Object.assign(acc, x), {})

        dynamoDb.query(
            {
                TableName,
                KeyConditionExpression,
                ExpressionAttributeNames,
                ExpressionAttributeValues,
            },
            (error, data) => {
                if (error) {
                    log(error)
                    res.status(400).json({error, message: `Can not get report of enterpriseId "${enterpriseId}"`})
                } else {
                    res.json(data)
                }
            }
        )
    }
})


// ------------------------------------------------------------------------------
// tree
// ------------------------------------------------------------------------------
app.get('/tree', (req, res) => {
    dynamoDb.scan(
        { TableName: TREE_TABLE },
        (error, data) => {
            if (error) {
                log(error)
                res.status(400).json({error, message: `Can not list Tree.`})
            } else {
                res.json(data.Items)
            }
        }
    )
})

app.post('/tree', (req, res) => {
    const { enterpriseId, projectId, userId } = req.body // Required field
    const treeCount = req.body.hasOwnProperty('treeCount') ? req.body.treeCount : 1 // Optional field, defaut to 1

    if (typeof enterpriseId !== 'string' || !enterpriseId.match(/^[0-9a-f]{8}$/)) {
        res.status(400).json({message: `The "enterpriseId" must be 8 digits hex string. Got "${enterpriseId}" instead.`})
    } else if (typeof projectId !== 'string' || !projectId.match(/^[0-9a-f]{8}$/)) {
        res.status(400).json({message: `The "projectId" must be 8 digits hex string. Got "${projectId}" instead.`})
    } else if (typeof userId !== 'string' || !userId.match(/^[0-9a-f]{8}$/)) {
        res.status(400).json({message: `The "userId" must be 8 digits hex string. Got "${userId}" instead.`})
    } else if (typeof treeCount !== 'number') {
        res.status(400).json({message: `The "treeCount" must be a number. Got "${treeCount}" instead.`})
    } else {
        const TableName = TREE_TABLE

        const uuid = v4()
        const created = new Date().toISOString() // Now

        const Item = { uuid, created, treeCount, enterpriseId, projectId, userId }

        dynamoDb.put(
            { TableName, Item },
            (error) => {
                if (error) {
                    log(error)
                    res.status(400).json({error, message: `Can not create tree item.`})
                } else {
                    res.json(Item)
                }
            }
        )
    }
})

app.get('/tree/:uuid', (req, res) => {
    const uuid = req.params.uuid.toLowerCase()

    if (!uuid.split('-').join('').match(/^[0-9a-f]{32}$/)) {
        res.status(400).json({message: `The "uuid" must be 32 hex digit string. Got "${uuid}" instead.`})
    } else {
        dynamoDb.get(
            { TableName: TREE_TABLE, Key: { uuid } },
            (error, result) => {
                if (error) {
                    log(error)
                    res.status(400).json({error, message: `Can not get Tree uuid "${uuid}"`})
                } else {
                    if (result.Item) {
                        res.json(result.Item)
                    } else {
                        res.status(404).json({message: `No Tree itme with uuid "${uuid}" found`})
                    }
                }
            }
        )
    }
})

app.delete('/tree/:uuid', (req, res) => {
    const uuid = req.params.uuid.toLowerCase()

    if (!uuid.split('-').join('').match(/^[0-9a-f]{32}$/)) {
        res.status(400).json({message: `The "uuid" must be 32 hex digit string. Got "${uuid}" instead.`})
    } else {
        dynamoDb.delete(
            { TableName: TREE_TABLE, Key: { uuid } },
            (error, data) => {
                if (error) {
                    log(error)
                    res.status(400).json({error, message: `Can not delete Tree uuid "${uuid}"`})
                } else {
                    res.json(data)
                }
            }
        )
    }
})

// ------------------------------------------------------------------------------
// Project
// ------------------------------------------------------------------------------
app.get('/project', (req, res) => {
    dynamoDb.scan(
        { TableName: PROJECT_TABLE },
        (error, data) => {
            if (error) {
                log(error)
                res.status(400).json({error, message: `Can not list Project.`})
            } else {
                res.json(data.Items)
            }
        }
    )
})

app.post('/project', (req, res) => {
    const { name, description } = req.body

    if (typeof name !== 'string') {
        res.status(400).json({message: `The "name" must be a string. Got "${name}" instead.`})
    } else if (typeof description !== 'string') {
        res.status(400).json({message: `The "description" must be a string. Got "${description}" instead.`})
    } else {
        const TableName = PROJECT_TABLE

        const id = v4().split('-')[0]
        const created = new Date().toISOString() // Now

        const Item = { id, created, name, description }

        dynamoDb.put(
            { TableName, Item },
            (error) => {
                if (error) {
                    log(error)
                    res.status(400).json({error, message: `Can not create project.`})
                } else {
                    res.json(Item)
                }
            }
        )
    }
})

app.get('/project/:id', (req, res) => {
    const id = req.params.id.toLowerCase()

    if (typeof id !== 'string' || !id.match(/^[0-9a-f]{8}$/)) {
        res.status(400).json({message: `The "id" must be 8 hex digit string. Got "${id}" instead.`})
    } else {
        dynamoDb.get(
            { TableName: PROJECT_TABLE, Key: { id } },
            (error, result) => {
                if (error) {
                    log(error)
                    res.status(400).json({error, message: `Can not get Project id "${id}"`})
                } else {
                    if (result.Item) {
                        res.json(result.Item)
                    } else {
                        res.status(404).json({message: `No Project id "${id}" found`})
                    }
                }
            }
        )
    }
})

app.delete('/project/:id', (req, res) => {
    const id = req.params.id.toLowerCase()

    if (typeof id !== 'string' || !id.match(/^[0-9a-f]{8}$/)) {
        res.status(400).json({message: `The "id" must be 8 hex digit string. Got "${id}" instead.`})
    } else {
        dynamoDb.delete(
            { TableName: PROJECT_TABLE, Key: { id } },
            (error, data) => {
                if (error) {
                    log(error)
                    res.status(400).json({error, message: `Can not delete Project id "${id}"`})
                } else {
                    res.json(data)
                }
            }
        )
    }
})

app.patch('/project/:id', (req, res) => {
    const id = req.params.id.toLowerCase()
    const body = req.body

    if (typeof id !== 'string' || !id.match(/^[0-9a-f]{8}$/)) {
        res.status(400).json({message: `The "id" must be 8 hex digit string. Got "${id}" instead.`})
    } else if (!body) {
        res.status(400).json({message: `Missing data payload.`})
    } else {
        body.updated = new Date().toISOString() // Now

        // "set #n = :n"
        const UpdateExpression = 'SET ' + Object.keys(body).map(x => `#${x[0]} = :${x[0]}`).join()

        // { "#n": "name" }
        const ExpressionAttributeNames = Object
            .keys(body)
            .map(x => ({ [`#${x[0]}`] : x }))
            .reduce((x, acc) => Object.assign(acc, x), {})

        // { ":n": "John" }
        const ExpressionAttributeValues = Object
            .keys(body)
            .map(x => ({ [`:${x[0]}`] : body[x] }))
            .reduce((x, acc) => Object.assign(acc, x), {})

        dynamoDb.update(
            {
                TableName: PROJECT_TABLE,
                Key: { id },
                UpdateExpression,
                ExpressionAttributeNames,
                ExpressionAttributeValues,
                ReturnValues: 'UPDATED_NEW',
            },
            (error, data) => {
                if (error) {
                    log(error)
                    res.status(400).json(error)
                } else {
                    res.json(data)
                }
            }
        )
    }
})

// ------------------------------------------------------------------------------
// User
// ------------------------------------------------------------------------------
app.get('/user', (req, res) => {
    dynamoDb.scan(
        { TableName: USER_TABLE },
        (error, data) => {
            if (error) {
                log(error)
                res.status(400).json({error, message: `Can not list User.`})
            } else {
                res.json(data.Items)
            }
        }
    )
})

app.post('/user', (req, res) => {
    const { name, email} = req.body

    if (typeof name !== 'string') {
        res.status(400).json({message: `The "name" must be a string. Got "${name}" instead.`})
    } else if (typeof email !== 'string') {
        res.status(400).json({message: `The "email" must be a string. Got "${email}" instead.`})
    } else {
        const TableName = USER_TABLE

        const id = v4().split('-')[0]
        const created = new Date().toISOString() // Now

        const Item = { id, created, name, email }

        dynamoDb.put(
            { TableName, Item },
            (error) => {
                if (error) {
                    log(error)
                    res.status(400).json({error, message: `Can not create user.`})
                } else {
                    res.json(Item)
                }
            }
        )
    }
})

app.get('/user/:id', (req, res) => {
    const id = req.params.id.toLowerCase()

    if (typeof id !== 'string' || !id.match(/^[0-9a-f]{8}$/)) {
        res.status(400).json({message: `The "id" must be 8 hex digit string. Got "${id}" instead.`})
    } else {
        dynamoDb.get(
            { TableName: USER_TABLE, Key: { id } },
            (error, result) => {
                if (error) {
                    log(error)
                    res.status(400).json({error, message: `Can not get User id "${id}"`})
                } else {
                    if (result.Item) {
                        res.json(result.Item)
                    } else {
                        res.status(404).json({message: `No User id "${id}" found`})
                    }
                }
            }
        )
    }
})

app.delete('/user/:id', (req, res) => {
    const id = req.params.id.toLowerCase()

    if (typeof id !== 'string' || !id.match(/^[0-9a-f]{8}$/)) {
        res.status(400).json({message: `The "id" must be 8 hex digit string. Got "${id}" instead.`})
    } else {
        dynamoDb.delete(
            { TableName: USER_TABLE, Key: { id } },
            (error, data) => {
                if (error) {
                    log(error)
                    res.status(400).json({error, message: `Can not delete User id "${id}"`})
                } else {
                    res.json(data)
                }
            }
        )
    }
})

app.patch('/user/:id', (req, res) => {
    const id = req.params.id.toLowerCase()
    const body = req.body

    if (typeof id !== 'string' || !id.match(/^[0-9a-f]{8}$/)) {
        res.status(400).json({message: `The "id" must be 8 hex digit string. Got "${id}" instead.`})
    } else if (!body) {
        res.status(400).json({message: `Missing data payload.`})
    } else {
        body.updated = new Date().toISOString() // Now

        // "set #n = :n"
        const UpdateExpression = 'SET ' + Object.keys(body).map(x => `#${x[0]} = :${x[0]}`).join()

        // { "#n": "name" }
        const ExpressionAttributeNames = Object
            .keys(body)
            .map(x => ({ [`#${x[0]}`] : x }))
            .reduce((x, acc) => Object.assign(acc, x), {})

        // { ":n": "John" }
        const ExpressionAttributeValues = Object
            .keys(body)
            .map(x => ({ [`:${x[0]}`] : body[x] }))
            .reduce((x, acc) => Object.assign(acc, x), {})

        dynamoDb.update(
            {
                TableName: USER_TABLE,
                Key: { id },
                UpdateExpression,
                ExpressionAttributeNames,
                ExpressionAttributeValues,
                ReturnValues: 'UPDATED_NEW',
            },
            (error, data) => {
                if (error) {
                    log(error)
                    res.status(400).json(error)
                } else {
                    res.json(data)
                }
            }
        )
    }
})

// ------------------------------------------------------------------------------
// Enterprise
// ------------------------------------------------------------------------------

app.get('/enterprise', (req, res) => {
    dynamoDb.scan(
        { TableName: ENTERPRISE_TABLE },
        (error, data) => {
            if (error) {
                log(error)
                res.status(400).json({error, message: `Can not list Enterprise.`})
            } else {
                res.json(data.Items)
            }
        }
    )
})

app.post('/enterprise', (req, res) => {
    const { name, contact } = req.body

    if (typeof name !== 'string') {
        res.status(400).json({message: `The "name" must be a string. Got "${name}" instead.`})
    } else if (contact && typeof contact.name !== 'string') {
        res.status(400).json({message: `The "contact.name" must be a string. Got "${contact}" instead.`})
    } else {
        const TableName = ENTERPRISE_TABLE

        const id = v4().split('-')[0]
        const created = new Date().toISOString() // Now

        const Item = { id, created, name, contact }

        dynamoDb.put(
            { TableName, Item },
            (error) => {
                if (error) {
                    log(error)
                    res.status(400).json({error, message: `Can not create Enterprise.`})
                } else {
                    res.json(Item)
                }
            }
        )
    }
})

app.get('/enterprise/:id', (req, res) => {
    const id = req.params.id.toLowerCase()

    if (typeof id !== 'string' || !id.match(/^[0-9a-f]{8}$/)) {
        res.status(400).json({message: `The "id" must be 8 hex digit string. Got "${id}" instead.`})
    } else {
        dynamoDb.get(
            { TableName: ENTERPRISE_TABLE, Key: { id } },
            (error, result) => {
                if (error) {
                    log(error)
                    res.status(400).json({error, message: `Can not get Enterprise id "${id}"`})
                } else {
                    if (result.Item) {
                        res.json(result.Item)
                    } else {
                        res.status(404).json({message: `No enterprise id "${id}" found`})
                    }
                }
            }
        )
    }
})

app.delete('/enterprise/:id', (req, res) => {
    const id = req.params.id.toLowerCase()

    if (typeof id !== 'string' || !id.match(/^[0-9a-f]{8}$/)) {
        res.status(400).json({message: `The "id" must be 8 hex digit string. Got "${id}" instead.`})
    } else {
        dynamoDb.delete(
            { TableName: ENTERPRISE_TABLE, Key: { id } },
            (error, data) => {
                if (error) {
                    log(error)
                    res.status(400).json({error, message: `Can not delete Enterprise id "${id}"`})
                } else {
                    res.json(data)
                }
            }
        )
    }
})

app.patch('/enterprise/:id', (req, res) => {
    const id = req.params.id.toLowerCase()
    const body = req.body

    if (typeof id !== 'string' || !id.match(/^[0-9a-f]{8}$/)) {
        res.status(400).json({message: `The "id" must be 8 hex digit string. Got "${id}" instead.`})
    } else if (!body) {
        res.status(400).json({message: `Missing data payload.`})
    } else {
        body.updated = new Date().toISOString() // Now

        // "set #n = :n"
        const UpdateExpression = 'SET ' + Object.keys(body).map(x => `#${x[0]} = :${x[0]}`).join()

        // { "#n": "name" }
        const ExpressionAttributeNames = Object
            .keys(body)
            .map(x => ({ [`#${x[0]}`] : x }))
            .reduce((x, acc) => Object.assign(acc, x), {})

        // { ":n": "John" }
        const ExpressionAttributeValues = Object
            .keys(body)
            .map(x => ({ [`:${x[0]}`] : body[x] }))
            .reduce((x, acc) => Object.assign(acc, x), {})

        dynamoDb.update(
            {
                TableName: ENTERPRISE_TABLE,
                Key: { id },
                UpdateExpression,
                ExpressionAttributeNames,
                ExpressionAttributeValues,
                ReturnValues: 'UPDATED_NEW',
            },
            (error, data) => {
                if (error) {
                    log(error)
                    res.status(400).json(error)
                } else {
                    res.json(data)
                }
            }
        )
    }
})

module.exports.handler = serverless(app)
