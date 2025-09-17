const {onCall} = require("firebase-functions/v2/https");
const {logger} = require("firebase-functions");

/**
 * A simple "hello world" function to test the deployment pipeline.
 * This has no complex dependencies and should deploy successfully.
 */
exports.helloWorld = onCall((request) => {
  logger.info("Hello world function was called!", {structuredData: true});
  return {text: "Hello from your successfully deployed Firebase Function!"};
});

