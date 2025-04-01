import { CoreMiddlewaresRegistry } from "@wrappid/service-core";
import * as postController from "./controllers/postToLinkedIn.controller";
import * as testController from "./controllers/test.controller";

const ControllersRegistry = {
  testGetAllFunc: [testController.testGetAllFunc],
  testGetFunc: [testController.testGetFunc],
  testPostFunc: [testController.testPostFunc],
  testPutFunc: [testController.testPutFunc],
  testPatchFunc: [testController.testPatchFunc],
  postToLinkedIn: [CoreMiddlewaresRegistry.fileHandler({ filename: "photo",multiple:true }),postController.posts]
};

export default ControllersRegistry;
