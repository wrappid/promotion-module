import * as postToLinkedIn from "./functions/postToLinkedIn.function";
import * as testFunctions from "./functions/test.functions";

const FunctionsRegistry = {
  readTestData: testFunctions.readTestData,
  readTestDataAll: testFunctions.readTestDataAll,
  createTestData: testFunctions.createTestData,
  updateTestData: testFunctions.updateTestData,
  deleteTestData: testFunctions.deleteTestData,
  postToLinkedIn: postToLinkedIn.LinkedInPosts
};

export default FunctionsRegistry;
