// Built-in
const { log } = console

// 3rd party lib
const serverless = require('serverless-http')
const bodyParser = require('body-parser')
const express = require('express')
const AWS = require('aws-sdk')

const app = express()

const { TREE_TABLE } = process.env
const dynamoDb = new AWS.DynamoDB.DocumentClient()

app.use(bodyParser.json({strict: false}))

app.get('/', (req, res) => {
    res.send('Welcome to Digital Humani')
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
