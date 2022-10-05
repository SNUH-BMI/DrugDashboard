# Ingredient API

## GET /ingredient

Get ingredient data.

* Request Param
```
concept : number
```

* Response JSON
```json
[
  {
    "concept_id": "number",
    "concept_name": "string",
    "domain_id": "string",
    "vocabulary_id": "string",
    "concept_class_id": "string"
  }
]
```

## GET /ingredient/contain

Get list of drugs containing ingredient.

* Request Param
```
concept : number
```

* Response JSON
```json
[
  {
    "concept_id": "number",
    "name": "string",
    "snuh_id" : "string",
    "amount": "string",
    "unit": "string"
  }
]
```

## GET /ingredient/quantity

Get ingredient quantity.

* Request Param
```
concept : number
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

## GET /ingredient/quantity/range

Get ingredient quantity by range.

* Request Param
```
concept : number
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
