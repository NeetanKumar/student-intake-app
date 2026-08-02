# API Reference

Base URL (local dev): `http://localhost:3000/api`

Also available as a machine-readable spec: [`../openapi.yaml`](../openapi.yaml)
(import it into Postman, Insomnia, or the [Swagger Editor](https://editor.swagger.io) to explore interactively).

All request/response bodies are JSON. All endpoints validate input server-side
with the same Zod schemas used by the frontend (`src/lib/validation/`).

---

## `POST /api/intakes`

Creates a new student intake submission. Creates the `Student` row together
with its `AcademicInterest` (+ `CourseOfInterest` rows) and `WorkPreference`
(+ `WorkAreaPreference` rows) in a single database transaction.

### Request body

```json
{
  "basicInfo": {
    "firstName": "Jordan",
    "lastName": "Rivera",
    "email": "jordan.rivera@example.com",
    "phoneNumber": "555-123-4567",
    "dateOfBirth": "2005-05-15",
    "mailingAddressLine1": "123 Main St",
    "mailingAddressLine2": null,
    "city": "Springfield",
    "state": "IL",
    "postalCode": "62704",
    "country": "United States"
  },
  "academicInterests": {
    "degreeLevel": "BACHELORS",
    "major": "Computer Science",
    "minor": "Mathematics",
    "courses": ["Data Structures & Algorithms", "Linear Algebra"]
  },
  "workPreferences": {
    "workAreas": ["Software Engineering"],
    "employmentType": "FULL_TIME",
    "locationType": "REMOTE",
    "notes": "Looking forward to it."
  }
}
```

`degreeLevel` ∈ `ASSOCIATE | BACHELORS | MASTERS | DOCTORATE | CERTIFICATE`
`employmentType` ∈ `FULL_TIME | PART_TIME | INTERNSHIP | CO_OP`
`locationType` ∈ `ON_CAMPUS | REMOTE | HYBRID | OFF_CAMPUS`

### Responses

- **`201 Created`** — returns the full created `Student` record with nested
  `academicInterest` (incl. `courses`) and `workPreference` (incl. `workAreas`).
- **`400 Bad Request`** — validation failed. Body:
  ```json
  {
    "error": "Validation failed",
    "fieldErrors": { "formErrors": [], "fieldErrors": { "basicInfo": ["..."] } }
  }
  ```

### curl example

```bash
curl -X POST http://localhost:3000/api/intakes \
  -H "Content-Type: application/json" \
  -d '{
    "basicInfo": { "firstName": "Jordan", "lastName": "Rivera", "email": "jordan.rivera@example.com", "phoneNumber": "555-123-4567", "dateOfBirth": "2005-05-15", "mailingAddressLine1": "123 Main St", "city": "Springfield", "state": "IL", "postalCode": "62704", "country": "United States" },
    "academicInterests": { "degreeLevel": "BACHELORS", "major": "Computer Science", "courses": ["Linear Algebra"] },
    "workPreferences": { "workAreas": ["Software Engineering"], "employmentType": "FULL_TIME", "locationType": "REMOTE" }
  }'
```

---

## `GET /api/intakes`

Lists submissions, newest first.

### Query parameters

| Param      | Default | Notes           |
| ---------- | ------- | --------------- |
| `page`     | `1`     |                 |
| `pageSize` | `20`    | Max `100`       |

### Response — `200 OK`

```json
{
  "items": [
    {
      "id": "…",
      "firstName": "Jordan",
      "lastName": "Rivera",
      "email": "jordan.rivera@example.com",
      "createdAt": "2026-08-02T13:20:30.000Z",
      "academicInterest": { "degreeLevel": "BACHELORS", "major": "Computer Science" }
    }
  ],
  "total": 6,
  "page": 1,
  "pageSize": 20
}
```

### curl example

```bash
curl http://localhost:3000/api/intakes
```

---

## `GET /api/intakes/:id`

Returns the full nested record for one submission.

- **`200 OK`** — full `Student` record (same shape as the POST response).
- **`404 Not Found`** — `{ "error": "Submission not found" }`

### curl example

```bash
curl http://localhost:3000/api/intakes/<id>
```
