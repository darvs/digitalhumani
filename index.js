// Built-in
const { log } = console

// 3rd party lib
const serverless = require('serverless-http')
const bodyParser = require('body-parser')
const express = require('express')
const AWS = require('aws-sdk')
const uuid = require('uuid/v4'); // ex. '3a017fc5-4f50-4db9-b0ce-4547ba0a1bfd' (v4 is random)


const app = express()

const { ENTERPRISE_TABLE, PROJECT_TABLE, USER_TABLE, TREE_TABLE, REPORT_TABLE } = process.env

const dynamoDb = new AWS.DynamoDB.DocumentClient()

app.use(bodyParser.json({strict: false}))

app.get('/', (req, res) => {
    res.send('Welcome to Digital Humani')
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
        const id = uuid().split('-')[0]
        dynamoDb.put(
            { TableName: PROJECT_TABLE, Item: { id, name, description } },
            (error) => {
                if (error) {
                    log(error)
                    res.status(400).json({error, message: `Can not create project.`})
                } else {
                    res.json({id, name, description})
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
        const id = uuid().split('-')[0]
        dynamoDb.put(
            { TableName: USER_TABLE, Item: { id, name, email} },
            (error) => {
                if (error) {
                    log(error)
                    res.status(400).json({error, message: `Can not create user.`})
                } else {
                    res.json({id, name, email})
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
        const id = uuid().split('-')[0]
        dynamoDb.put(
            { TableName: ENTERPRISE_TABLE, Item: { id, name, contact } },
            (error) => {
                if (error) {
                    log(error)
                    res.status(400).json({error, message: `Can not create Enterprise.`})
                } else {
                    res.json({id, name, contact})
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









app.get('/cie/:cieId', (req, res) => {
    const { cieId } = req.params

    dynamoDb.get(
        { TableName: TREE_TABLE, Key: { cieId } },
        (error, result) => {
            if (error) {
                log(error)
                res.status(400).json({error, message: `Can not get cie ID ${cieId}`})
            } else {
                if (result.Item) {
                    res.json(result.Item)
                } else {
                    res.status(404).json({message: `No cie ID ${cieId} found`})
                }
            }
        }
    )
})

app.post('/cie', (req, res) => {
    const { cieName, cieId } = req.body

    if (typeof cieName !== 'string') {
        res.status(400).json({message: `The "cieName" must be a string. Got "${cieName}" instead.`})
    } else if (typeof cieId !== 'string') {
        res.status(400).json({message: `The "cieId" must be a string. Got "${cieId}" instead.`})
    } else {
    }

    dynamoDb.put(
        { TableName: TREE_TABLE, Item: { cieId, cieName } },
        (error) => {
            if (error) {
                log(error)
                res.status(400).json({error, message: `Can not create Cie.`})
            } else {
                res.json({cieId, cieName})
            }
        }
    )
})

app.get('/cie/:cieId/project/:projectId/tree', (req, res) => {
    const { cieId, projectId } = req.params

    res.send(`Get number of planted tree for cie ID ${cieId} / project ID ${projectId}`)
})

app.get('/report', (req, res) => {
    res.send('Montly report')
})

module.exports.handler = serverless(app)
