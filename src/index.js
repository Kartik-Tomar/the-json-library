const jsonSchemaValidate = require("./jsonSchemaValidate");
const parseSchema = require("./schemaParser");

const validate = ({ schema, data }) => {
  try {
    const schemaToUse = parseSchema(schema);
    if (!schemaToUse) throw new Error("Schema is required");
    if (!data) throw new Error("Data is required");
    const result = jsonSchemaValidate({ schema: schemaToUse, data });
    if (!result.isValid) {
      throw new Error(
        result?.errors?.map((err) => `${err?.path}: ${err?.message}`)
      );
    }
    return true;
  } catch (error) {
    return {
      valid: false,
      error: error?.message,
    };
  }
};

module.exports = { validate, parseValidationSchema: parseSchema };
