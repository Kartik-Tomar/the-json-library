# The JSON Library

A lightweight JSON schema validation library for JavaScript that can be used in both browser and Node.js environments.

## Features

- Validate JSON data against schemas
- No external dependencies
- Works in both browser and Node.js
- Supports common validation types and formats
- Comprehensive error reporting
- Small footprint

## Installation

```bash
npm install the-json-library
```

## Usage

### Basic Usage

```javascript
import { validate } from 'the-json-library';

// Define a schema
const schema = {
  type: 'object',
  required: ['name', 'email'],
  properties: {
    name: { type: 'string' },
    email: { type: 'string', format: 'email' },
    age: { type: 'integer', minimum: 0 }
  }
};

// Validate some data
const data = {
  name: 'John Doe',
  email: 'john@example.com',
  age: 30
};

const result = validate(data);

if (result.isValid) {
  console.log('Validation successful!');
} else {
  console.error('Validation errors:', result.errors);
}
```

### Static Validation

You can also use the static method without creating an instance:

```javascript
import { validate } from 'the-json-library';

const result = validate(data, schema);

if (result.isValid) {
  console.log('Validation successful!');
} else {
  console.error('Validation errors:', result.errors);
}
```

### Validation Result

The validation result contains:

- `isValid` - boolean indicating if the validation passed
- `errors` - array of error objects with:
  - `path` - the path to the property that failed validation
  - `message` - description of the error

## Supported Schema Features

### Types

- `string`
- `number`
- `integer`
- `boolean`
- `array`
- `object`
- `null`

### String Validations

- `minLength` / `maxLength` - string length constraints
- `pattern` - regular expression pattern
- `format` - predefined formats (email, date, date-time, uri)

### Number Validations

- `minimum` / `maximum` - value constraints

### Object Validations

- `properties` - schema for each property
- `required` - list of required properties

### Array Validations

- `items` - schema for array items

### Other Validations

- `enum` - list of allowed values

## Schema Format

Schemas should follow a simplified JSON Schema format. Here's an example of a more complex schema:

```javascript
{
  "type": "object",
  "required": ["id", "name", "metadata"],
  "properties": {
    "id": { "type": "integer" },
    "name": { "type": "string", "minLength": 1 },
    "email": { "type": "string", "format": "email" },
    "tags": {
      "type": "array",
      "items": { "type": "string" }
    },
    "metadata": {
      "type": "object",
      "properties": {
        "created": { "type": "string", "format": "date-time" },
        "status": { "enum": ["active", "inactive", "pending"] }
      }
    }
  }
}
```

## License

MIT
