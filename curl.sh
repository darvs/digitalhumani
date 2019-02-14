export BASE=https://n8e12iw5gd.execute-api.ca-central-1.amazonaws.com/dev

curl ${BASE}/enterprise/123/report/123
curl ${BASE}/enterprise/123/report
curl ${BASE}/enterprise
curl ${BASE}/project
curl ${BASE}/report
curl ${BASE}/report/
curl ${BASE}/report/123
curl ${BASE}/report/c3cd2a81-47d3-4bd6-8cde-b1b40fa86f15
curl ${BASE}/report/enterprise/c3cd2a81
curl ${BASE}/report/enterprise/c3cd2a81/1111-22
curl ${BASE}/report/enterprise/c3cd2a81/1111-222
curl ${BASE}/report/enterpriseId/c3cd2a81
curl ${BASE}/report/enterpriseId/c3cd2a81-47d3-4bd6-8cde-b1b40fa86f15
curl ${BASE}/report
curl ${BASE}/tree
curl ${BASE}/tree/08dfc2c7-6fd6-48ec-8b0e-93b1d76f98d3
curl ${BASE}/tree/abc
curl ${BASE}/tree

curl --data -X POST ${BASE}/cie -d '{"cieId": "A1", "cieName": "XYZ"}'
curl GET https://g5lkwar2r1.execute-api.ca-central-1.amazonaws.com/dev/cie/A1
curl -H "Content-Type: application/json" -X PATCH ${BASE}/enterprise/71784b3f -d '{"name": "Very big coorporation"}'
curl -H "Content-Type: application/json" -X PATCH ${BASE}/enterprise/7671d558 -d '{"name": "Medium Shop"}'
curl -H "Content-Type: application/json" -X PATCH ${BASE}/enterprise/ce53de78 -d '{"name": "Tiny coorporation"}'
curl -H "Content-Type: application/json" -X PATCH ${BASE}/enterprise -d '{"name": "Medium Shop"}'
curl -H "Content-Type: application/json" -X PATCH ${BASE}/project/ac7aa2e7 -d '{"name": "Grand Canyon"}'
curl -H "Content-Type: application/json" -X PATCH ${BASE}/project/ac7aa2e7 -d '{name: "Grand Canyon"}'
curl -H "Content-Type: application/json" -X PATCH ${BASE}/project/ac7aa2e7 -d '{"name": "Iles Galapagos"}'
curl -H "Content-Type: application/json" -X POST ${BASE}/cie -d '{"cieId": 1, "cieName": "XYZ"}'
curl -H "Content-Type: application/json" -X POST ${BASE}/cie -d '{cieId: 1, cieName: "XYZ"}'
curl -H "Content-Type: application/json" -X POST ${BASE}/cie -d '{"cieId": "23452346234652361", "cieName": "XYZ"}'
curl -H "Content-Type: application/json" -X POST ${BASE}/cie -d '{"cieId": "A123", "cieName": "ABC"}'
curl -H "Content-Type: application/json" -X POST ${BASE}/cie -d '{"cieId": "A1", "cieName": "XYZ"}'
curl -H "Content-Type: application/json" -X POST ${BASE}/cie -d '{"cieId": "A2", "cieName": "XYZ"}'
curl -H "Content-Type: application/json" -X POST ${BASE}/cie -d '{"cieId": "A3", "cieName": "XYZ"}'
curl -H "Content-Type: application/json" -X POST ${BASE}/enterprise -d '{"name": "Big corporation", "contact": { "email": "a@y.com" }}'
curl -H "Content-Type: application/json" -X POST ${BASE}/enterprise -d '{"name": "Big corporation", "contact": { "name": "Bob" }}'
curl -H "Content-Type: application/json" -X POST ${BASE}/enterprise -d '{"name": "Small Shop", "contact": { "name": "Méo" }}'
curl -H "Content-Type: application/json" -X POST ${BASE}/enterprise -d '{"name": "Tiny corp.", "contact": { "name": "John" }}'
curl -H "Content-Type: application/json" -X POST ${BASE}/enterprise -d '{"name": "Very Big corporation", "contact": { "name": "Alice" }}'
curl -H "Content-Type: application/json" -X POST ${BASE}/proejct -d '{"name": "Amazonie #1", "description": "coconut et artre arbres exotique"}'
curl -H "Content-Type: application/json" -X POST ${BASE}/project -d '{"name": "Amazonie #1", "description": "coconut et artre arbres exotique"}'
curl -H "Content-Type: application/json" -X POST ${BASE}/tree -d '{"enterpriseId": "1234abcd", "projectId": "1234abcd"}'
curl -H "Content-Type: application/json" -X POST ${BASE}/tree -d '{"enterpriseId": "1234abcd", "projectId": "1234abcd", "user": "Bob"}'
curl -H "Content-Type: application/json" -X POST ${BASE}/tree -d '{"enterpriseId": "1234abcd", "projectId": "coconut et artre arbres exotique"}'
curl -H "Content-Type: application/json" -X POST ${BASE}/tree -d '{"enterpriseId": "Amazonie #1", "projectId": "coconut et artre arbres exotique"}'
curl -X DELETE ${BASE}/enterprise/5c31d036
curl -X DELETE ${BASE}/enterprise/9fd4bac7
curl -X DELETE ${BASE}/project/c7823a59
curl -X DELETE ${BASE}/tree/08dfc2c7-6fd6-48ec-8b0e-93b1d76f98d
curl -X DELETE ${BASE}/tree/08dfc2c7-6fd6-48ec-8b0e-93b1d76f98d3
curl -X GET ${BASE}/cie/A1
curl -X GET ${BASE}/enterprise
curl -X GET ${BASE}/enterprise/9fd4bac
curl -X GET ${BASE}/enterprise/9fd4bac7
curl -X GET ${BASE}/enterprise/9fd4bac7a
curl -X GET ${BASE}/enterprise/9fd4bac9
curl -X GET ${BASE}/enterprise/9fd4baca
curl -X GET ${BASE}/enterprise
curl -X GET ${BASE}/project/c7823a59
curl -X GET ${BASE}/project
curl -X GET ${BASE}/tree
