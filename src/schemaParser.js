const validateSchemaStructure = (schema, path = "") => {
  // Check if schema is valid
  if (typeof schema !== "object" || schema === null) {
    throw new Error(`Schema at ${path || "root"} must be an object`);
  }

  // If schema has properties, validate them
  if (schema.properties) {
    if (typeof schema.properties !== "object" || schema.properties === null) {
      throw new Error(`Properties at ${path || "root"} must be an object`);
    }

    // Recursively validate property schemas
    for (const prop in schema.properties) {
      validateSchemaStructure(
        schema.properties[prop],
        path ? `${path}.${prop}` : prop
      );
    }
  }

  // If schema has items (for arrays), validate them
  if (schema.items) {
    validateSchemaStructure(schema.items, path ? `${path}.items` : "items");
  }

  // Check if required is an array of strings
  if (schema.required !== undefined) {
    if (!Array.isArray(schema.required)) {
      throw new Error(`Required at ${path || "root"} must be an array`);
    }

    for (const req of schema.required) {
      if (typeof req !== "string") {
        throw new Error(`Required items at ${path || "root"} must be strings`);
      }
    }
  }

  // Check enum is an array
  if (schema.enum !== undefined && !Array.isArray(schema.enum)) {
    throw new Error(`Enum at ${path || "root"} must be an array`);
  }

  // Check numeric constraints
  if (schema.minimum !== undefined && typeof schema.minimum !== "number") {
    throw new Error(`Minimum at ${path || "root"} must be a number`);
  }

  if (schema.maximum !== undefined && typeof schema.maximum !== "number") {
    throw new Error(`Maximum at ${path || "root"} must be a number`);
  }

  // Check string constraints
  if (
    schema.minLength !== undefined &&
    (!Number.isInteger(schema.minLength) || schema.minLength < 0)
  ) {
    throw new Error(
      `MinLength at ${path || "root"} must be a non-negative integer`
    );
  }

  if (
    schema.maxLength !== undefined &&
    (!Number.isInteger(schema.maxLength) || schema.maxLength < 0)
  ) {
    throw new Error(
      `MaxLength at ${path || "root"} must be a non-negative integer`
    );
  }

  // Validate pattern is a valid regex
  if (schema.pattern !== undefined) {
    try {
      new RegExp(schema.pattern);
    } catch (e) {
      throw new Error(
        `Invalid regex pattern at ${path || "root"}: ${schema.pattern}`
      );
    }
  }
};

const parseSchema = (schema) => {
  let parsedSchema;

  // If schema is a string, try to parse it
  if (typeof schema === "string") {
    try {
      parsedSchema = JSON.parse(schema);
    } catch (error) {
      throw new Error(`Invalid schema JSON: ${error.message}`);
    }
  } else if (typeof schema === "object" && schema !== null) {
    parsedSchema = schema;
  } else {
    throw new Error("Schema must be a valid JSON object or string");
  }

  // Basic schema validation
  validateSchemaStructure(parsedSchema);

  return parsedSchema;
};

module.exports = parseSchema;
