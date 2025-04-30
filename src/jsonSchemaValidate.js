const validateAgainstSchema = (data, schema, path, errors) => {
  // Type validation
  if (schema.type && !checkType(data, schema.type)) {
    errors.push({
      path: path || "root",
      message: `Expected type ${schema.type}, got ${
        Array.isArray(data) ? "array" : typeof data
      }`,
    });
    return false;
  }

  // Required properties validation
  if (schema.required && Array.isArray(schema.required)) {
    for (const prop of schema.required) {
      if (data === undefined || data === null || !(prop in data)) {
        errors.push({
          path: path ? `${path}.${prop}` : prop,
          message: `Missing required property '${prop}'`,
        });
      }
    }
  }

  // Properties validation
  if (schema.properties && typeof schema.properties === "object") {
    for (const key in schema.properties) {
      const propSchema = schema.properties[key];
      const propPath = path ? `${path}.${key}` : key;

      if (data && data[key] !== undefined) {
        validateAgainstSchema(data[key], propSchema, propPath, errors);
      }
    }
  }

  // Array items validation
  if (schema.type === "array" && schema.items && Array.isArray(data)) {
    for (let i = 0; i < data.length; i++) {
      const itemPath = path ? `${path}[${i}]` : `[${i}]`;
      validateAgainstSchema(data[i], schema.items, itemPath, errors);
    }
  }

  // Enum validation
  if (schema.enum && Array.isArray(schema.enum)) {
    if (!schema.enum.some((val) => deepEqual(val, data))) {
      errors.push({
        path: path || "root",
        message: `Value must be one of the enum values: ${JSON.stringify(
          schema.enum
        )}`,
      });
    }
  }

  // Minimum/maximum for numbers
  if (schema.type === "number" || schema.type === "integer") {
    if (schema.minimum !== undefined && data < schema.minimum) {
      errors.push({
        path: path || "root",
        message: `Value ${data} is less than minimum ${schema.minimum}`,
      });
    }

    if (schema.maximum !== undefined && data > schema.maximum) {
      errors.push({
        path: path || "root",
        message: `Value ${data} is greater than maximum ${schema.maximum}`,
      });
    }
  }

  // String validations
  if (schema.type === "string") {
    // MinLength validation
    if (schema.minLength !== undefined && data.length < schema.minLength) {
      errors.push({
        path: path || "root",
        message: `String length ${data.length} is less than minLength ${schema.minLength}`,
      });
    }

    // MaxLength validation
    if (schema.maxLength !== undefined && data.length > schema.maxLength) {
      errors.push({
        path: path || "root",
        message: `String length ${data.length} is greater than maxLength ${schema.maxLength}`,
      });
    }

    // Pattern validation
    if (schema.pattern && !new RegExp(schema.pattern).test(data)) {
      errors.push({
        path: path || "root",
        message: `String does not match pattern: ${schema.pattern}`,
      });
    }
  }

  // Format validation
  if (schema.format && schema.type === "string") {
    const isValid = checkFormat(data, schema.format);
    if (!isValid) {
      errors.push({
        path: path || "root",
        message: `Value does not match format: ${schema.format}`,
      });
    }
  }

  return errors.length === 0;
};

const checkType = (value, type) => {
  if (value === null) return type === "null";

  switch (type) {
    case "string":
      return typeof value === "string";
    case "number":
      return typeof value === "number" && !isNaN(value);
    case "integer":
      return typeof value === "number" && Number.isInteger(value);
    case "boolean":
      return typeof value === "boolean";
    case "array":
      return Array.isArray(value);
    case "object":
      return (
        typeof value === "object" && !Array.isArray(value) && value !== null
      );
    case "null":
      return value === null;
    default:
      return true;
  }
};

const checkFormat = (value, format) => {
  switch (format) {
    case "email":
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    case "date-time":
      return !isNaN(Date.parse(value));
    case "date":
      return /^\d{4}-\d{2}-\d{2}$/.test(value) && !isNaN(Date.parse(value));
    case "uri":
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    default:
      return true;
  }
};

const deepEqual = (a, b) => {
  if (a === b) return true;

  if (
    typeof a !== "object" ||
    typeof b !== "object" ||
    a === null ||
    b === null
  ) {
    return false;
  }

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!keysB.includes(key) || !deepEqual(a[key], b[key])) {
      return false;
    }
  }

  return true;
};

const jsonSchemaValidate = ({ schema, data }) => {
  const errors = [];
  validateAgainstSchema(data, schema, "", errors);
  return {
    isValid: errors.length === 0,
    errors: errors,
  };
};

module.exports = jsonSchemaValidate;
