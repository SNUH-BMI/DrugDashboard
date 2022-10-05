# Drug API

## GET /drug

Get drug data.

* Request Param
```
concept : number
snuhId  : string
```

* Response JSON
```json
{
  "data": {
    "concept_id": "number",
    "concept_name": "string",
    "domain_id": "string",
    "vocabulary_id": "string",
    "concept_class_id": "string",
    "concept_code": "string",
    "snuh_id": "string",
    "source_name": "string",
    "unit": "string"
  },
  "ingredient": [
    {
      "concept_id": "number",
      "name": "string",
      "amount": "string",
      "unit": "string"
    }
  ]
}
```

## GET /drug/count

Get drug count.

* Request Param
```
concept : number
snuhId  : string
```

* Response JSON
```json
[
  {
    "gender": "string",
    "age": "number",
    "location": "string",
    "r_cnt": "string",
    "p_cnt": "string"
  }
]
```

## GET /drug/quantity

Get drug quantity.

* Request Param
```
concept : number
snuhId  : string
```

* Response JSON
```json
[
  {
    "person_id": "number",
    "quantity": "string"
  }
]
```

## GET /drug/quantity/range

Get drug quantity by range.

* Request Param
```
concept : number
snuhId  : string
```

* Request Query
```
start : number
end : number
```

* Response JSON
```json
[
  {
    "person_id": "number",
    "year_of_birth": "number",
    "month_of_birth": "number",
    "gender_source_value": "string",
    "quantity": "string"
  }
]
```

## GET /drug/exposure

Get drug exposure list.

* Request Param
```
concept : number
snuhId  : string
```

* Request Query
```
start : number (starts from 0)
number : number
```

* Response JSON
```json
[
  {
    "drug_exposure_id": "string",
    "person_id": "number",
    "provider_id": "number",
    "sig": "string",
    "drug_exposure_start_date": "string",
    "drug_exposure_end_date": "string"
  }
]
```

## GET /drug/together

Get drug used together.

* Request Param
```
concept : number
snuhId  : string
```

* Response JSON
```json
{
  "drugAllList": [
    {
      "drug_concept_id": "number",
      "concept_name": "string",
      "drug_source_value": "string",
      "route_source_value": "string",
      "count": "string"
    }
  ],
  "drugIVList": [
    "drug_source_value"
  ]
}
```
Get drug used together for a specific condition.

* Request param
```
concept : number
snuhID  : string
condition : string
```

* Response JSON
```json
[
  {
    "drug_concept_id": "number",
    "drug_source_value": "string",
    "concept_name": "string",
    "count": "number"
  }
]

```
## GET /drug/condition

Get drug exposure reason condition.

* Request Param
```
concept : number
snuhId  : string
```

* Response JSON
```json
[
  {
    "concept_name": "string",
    "number": "number"
  }
]
```

## GET /drug/purpose

Get ATC code of drug.

* Request Param
```
snuhId : string
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

## GET /drug/purpose/same

Get exposure of the drugs that have same ATC code.

* Request Param
```
snuhId : string
```

* Response JSON
```json
[
  {
    "conceptId": "string",
    "snuhId": "string",
    "exposureList": [
      {
        "year": "number",
        "month": "number",
        "count": "string"
      }
    ]
  }
]
```
