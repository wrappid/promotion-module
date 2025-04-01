import { BlankLayout } from "@wrappid/core";

export const RoutesRegistry = {
  defaultModuleRoute: {
    Page        : { appComponent: "ModuleComponent" },
    authRequired: false,
    entityRef   : "wrappid",
    url         : "wrappid"
  },

  linkedInPost: {
    Page        : { appComponent: "PostToLinkedin", layout: BlankLayout.name },
    authRequired: true,
    entityRef   : "linkedinpost",
    url         : "linkedinpost"
  },
};