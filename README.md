# Digital Humani API

## Install Node.js

First, install nvm as describe here:

    https://github.com/creationix/nvm

Then, install latest Node.js LTS Dubnium (10.x) - End-of-life April 2020

    > nvm install --lts=dubnium
    > nvm alias default lts/dubnium

FIXME: Lamda are limited to Node.js 8.10, maybe we should use this version instead of latest LTS.

## Install dependency

    > npm install

## Install and config serverless

    > npm install -g serverless
    > serverless config credentials --provider aws --key ??? --secret ???

## Deploy

    > sls deploy
    > sls client deploy    # Web page on S3 only

## Testing

    > export BASE="https://g5lkwar2r1.execute-api.ca-central-1.amazonaws.com/dev"
    > curl -H "Content-Type: application/json" -X POST ${BASE}/cie -d '{"cieId": "A1", "cieName": "XYZ"}'
    > curl -X GET ${BASE}/cie/A1

## Fixture

   To init DynamoDB table with some fixture

   > cd fixture
   > ./go.sh

## Offline Testing

    > sls offline start
    > export BASE="http://localhost:3000"
    > curl -H "Content-Type: application/json" -X POST ${BASE}/cie -d '{"cieId": "A123", "cieName": "ABC"}'
    > curl -X GET ${BASE}/cie/A123

## Toolchain planning

Still in progres...

Dev tools: Node.js, git, Visual Studio Code (editor), zsh (shell)

Frontend: HTML Page with JQuery

Backend: Lamda (processing in JavaScript), DynamoDB (Data persistency), API Gateway

Backend management tool: serverless, awscli (sudo snap install AWS CLI --classic)

Documentation: Swagger/ Postman collection

Testing: JEST, Pupperter

### API Route

TODO: Add JSONP
TODO: Allow POST to work with contentType: 'application/x-www-form-urlencoded' or 'multipart/form-data'

-----

✓ [GET] /enterprise

✓ [POST] /enterprise {name: '', contact: { name: '', email: '', phone: '' }}
✓ [GET] /enterprise/:id
✗ [GET] /enterprise/:id/treeCount
✗ [GET] /enterprise/:id/treeCount/:monthDate
✓ [DELETE] /enterprise/:id
✓ [PATCH] /enterprise/:id {...}

-----

✓ [GET] /user

✓ [POST] /user {name: '', email: '', phone: '' }
✓ [GET] /user/:id
✓ [DELETE] /user/:id
✓ [PATCH] /user/:id {...}

-----

✓ [GET] /project

✓ [POST] /project {name: '', description: '' }
✓ [GET] /project/:id
✓ [DELETE] /project/:id
✓ [PATCH] /project/:id {...}

-----

✓ [GET] /tree

✓ [POST] /tree {enterpriseId: '', projectId: '', userId: '', treeCount: 1 }
✓ [GET] /tree/:uuid
✓ [DELETE] /tree/:uuid

-----

✓ [GET] /report
✓ [GET] /report/enterprise/:enterpriseId/
✓ [GET] /report/enterprise/:enterpriseId/:monthDate

✗ [POST] /report/generate

-----
