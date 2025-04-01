/* eslint-disable etc/no-commented-out-code */

import { BlankLayout, CoreBox, CoreClasses, CoreForm, CoreLayoutItem } from "@wrappid/core";

export default function PostToLinkedin() {

  return (
    // eslint-disable-next-line react/jsx-no-comment-textnodes
    <>
      <CoreLayoutItem id={BlankLayout.PLACEHOLDER.CONTENT}>
        <CoreBox styleClasses={[CoreClasses.PADDING.P3]}>
          <CoreForm
            formId="linkedinPost"
            mode="edit"
            authenticated={true}
          />
        </CoreBox>
        
      </CoreLayoutItem>

    </>
  );
}
