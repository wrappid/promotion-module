import ModuleComponent from "./components/ModuleComponent";
import MultipleImagePicker from "./components/MultipleImagePicker";
import PostToLinkedin from "./components/PostToLinkedin";
import TestComponent from "./components/TestComponent";
import TestComponentMobile from "./components/TestComponentMobile";
import TestComponentWeb from "./components/TestComponentWeb";

export const ComponentsRegistry = {
  ModuleComponent     : { comp: ModuleComponent },
  MultipleImagePicker : { comp: MultipleImagePicker },
  PostToLinkedin      : { comp: PostToLinkedin },
  TestComponents      : { comp: TestComponent },
  TestComponentsMobile: {
    comp: TestComponentMobile,
    web : false
  },
  TestComponentsWeb: {
    comp  : TestComponentWeb,
    mobile: false
  }

};