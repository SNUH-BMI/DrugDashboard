# Search API

## POST /search/conditional

Conditional search.

* Request Body JSON
```json
{
  "age": [5, 10],
  "gender": "M",
  "conditionType": "and",
  "conditionList": [4316083, 4145947],
  "drugType": "and",
  "drugList": ["ASA100", "NAK2V"],
  "drugSimultaneous": true,
  "atcType": "and",
  "atcList": ["N02BA01", "B05BB02"],
  "simultaneousNumber": 10
}
```

* Response JSON
```json
[
  {
    "drug_exposure_id": "string",
    "person_id": "number",
    "gender_source_value": "string",
    "age": "number",
    "drug_source_value": "string",
    "drug_concept_id": "number",
    "atc_cd": "string",
    "start_date": "string",
    "sig": "string"
  }
]
```

## POST /search/conditional/chart

Load conditional search charts.

* Request Body JSON
```json
{
  "age": [5, 10],
  "gender": "M",
  "conditionType": "and",
  "conditionList": [4316083, 4145947],
  "drugType": "and",
  "drugList": ["ASA100", "NAK2V"],
  "drugSimultaneous": true,
  "atcType": "and",
  "atcList": ["N02BA01", "B05BB02"],
  "simultaneousNumber": 10
}
```

* Response JSON
```json
[
  {
    "gender": "string",
    "age": "number",
    "location": "string",
    "count": "string"
  }
]
```

## GET /search/drug

Search drug.

* Request Param
```
query : string
```

* Response JSON
```json
[
  {
    "concept_id": "number",
    "concept_name": "string",
    "vocabulary_id": "string",
    "snuh_id": "string",
    "source_name": "string",
    "use_count": "string"
  }
]
```

## GET /search/ingredient

Search ingredient.

* Request Param
```
query : string
```

* Response JSON
```json
[
  {
    "concept_id": "number",
    "concept_name": "string",
    "vocabulary_id": "string",
    "drug_count": "string"
  }
]
```

## GET /search/condition

Search condition.

* Request Param
```
query : string
```

* Response JSON
```json
[
  {
    "concept_id": "number",
    "concept_name": "string"
  }
]
```

## GET /search/atc

Search ATC code.

* Request Param
```
query : string
```

* Response JSON
```json
[
  {
    "code": "string",
    "name": "string"
  }
]
```
