/* eslint-disable no-unused-vars */
/* eslint-disable etc/no-commented-out-code */
import { useState } from "react";

import {
  CoreBox, CoreIcon, CoreInput, CoreImage, 
  CoreClasses
} from "@wrappid/core";

const ImageUpload = (props) => {
//   const [selectedImages, setSelectedImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    
    props?.formik?.setFieldValue(props?.id, files); // Set images in Formik
  };

  return (
    <CoreBox>
      <CoreInput
        {...props}
        type="file"
        // onChange={handleImageChange}
        inputProps={{
          accept  : "image/*",
          multiple: true,
          readOnly: true
        }}
      />

      {/* Image previews */}
      {previewUrls.length > 0 ? (
        <CoreBox 
          styleClasses={[CoreClasses.DISPLAY.FLEX, CoreClasses.FLEX.FLEXWRAP, CoreClasses.GAP.GAP_1, CoreClasses.MARGIN.MX10]}
        >
          {previewUrls.map((url, index) => (
            <CoreImage
              key={index}
              src={url}
              alt={`Preview ${index + 1}`}
              width={100}
              height={100}
            />
          ))}
        </CoreBox>
      ) : (
        <p>No image uploaded</p>
      )}

      <CoreIcon icon="photo_camera" />
    </CoreBox>
  );
};

export default ImageUpload;
