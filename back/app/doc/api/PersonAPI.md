# Person API

## GET /person

Get person data.

* Request Param
```
person : number
```

* Response JSON
```json
{
  "year_of_birth": "number",
  "month_of_birth": "number",
  "gender_source_value": "string",
  "city": "string",
  "state": "string",
  "location_source_value": "string"
}
```

## GET /person/drug/exposure

Get person's drug exposure list.

* Request Param
```
person : number
```

* Response JSON
```json
{
  "exposureList": [
    {
      "drug_exposure_id": "string",
      "start_date": "string",
      "days_supply": "number",
      "quantity": "string",
      "dose_unit_source_value": "string",
      "sig": "string",
      "provider_id": "number",
      "route_source_value": "string",
      "drug_concept_id": "number",
      "drug_name": "string",
      "condition_concept_id": "number",
      "condition_name": "string"
    }
  ],
  "ingredientList": [
    {
      "drug": "number",
      "ingredient": "number"
    }
  ]
}
```

## GET /person/condition

Get person's condition list.

* Request Param
```
person : number
```

* Response JSON
```json
[
  {
    "concept_id": "number",
    "concept_name": "string",
    "count": "number"
  }
]
```

## GET /person/visit

Get person's visit list.

* Request Param
```
person : number
```

* Request Query
```
condition : string or string[]
```

* Response JSON
```json
[
  {
    "visit_occurrence_id": "number",
    "visit_concept_id": "number",
    "visit_start_date": "string",
    "visit_end_date": "string",
    "visit_type_concept_id": "number",
    "provider_id": "number",
    "care_site_id": "number",
    "visit_source_value": "string",
    "condition_concept_id": "number"
  }
]
```

## GET /person/era

Get person's drug era.

* Request Param
```
person : number
```

* Response JSON
```json
[
  {
    "drug_concept_id": "number",
    "concept_name": "string",
    "drug_era_start_date": "string",
    "drug_era_end_date": "string"
  }
]
```
