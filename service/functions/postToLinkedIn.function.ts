import {

  databaseActions,
  WrappidLogger,
} from "@wrappid/service-core";
import fetch from "node-fetch-commonjs";


const getImageFromS3 = async (s3ImageUrl:string)=> {
  const response = await fetch(s3ImageUrl);
  
  if (!response.ok) {
    throw new Error(`Error fetching image from S3: ${response.statusText}`);
  }

  // Convert response to a Blob or a Buffer (for binary data handling)
  const imageData = await response.blob();
  return imageData;
};

// Function to upload image to LinkedIn and get the media URN
const uploadImageToLinkedIn = async (imageBlob:string, token:string,URN:string) => {
  const uploadResponse = await fetch("https://api.linkedin.com/v2/assets?action=registerUpload", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      registerUploadRequest: {
        owner: `${URN}`, // URN of the person
        recipes: ["urn:li:digitalmediaRecipe:feedshare-image"], // Recipe for image upload
        serviceRelationships: [
          {
            identifier: "urn:li:userGeneratedContent",
            relationshipType: "OWNER",
          },
        ],
        supportedUploadMechanism: ["SYNCHRONOUS_UPLOAD"],
      },
    }),
  });

  const uploadData:any = await uploadResponse.json();

  if (!uploadResponse.ok) {
    throw new Error(`Error registering image upload: ${uploadData.message}`);
  }


  const uploadUrl = uploadData.value.uploadMechanism["com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"].uploadUrl;


  // Step 2: Upload the actual image to LinkedIn
  const imageResponse = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "image/png", // Assuming the image is in JPEG format, adjust as necessary
    },
    body: imageBlob, // Image file (from S3 or another source)
  });
  if (!imageResponse.ok) {
    throw new Error("Error uploading the image.");
  }

  return uploadData.value; // Return the asset URN
};


export async function LinkedInPosts(id:string,message:string,s3ImageUrl:any){
  try{
    console.log("This is s3ImageUrl",s3ImageUrl);

    const userSettingsData = await databaseActions.findOne("application","UserSettings",
      {
        where:{
          userId: id,
          name: "linkedin_accessToken"
        }
      }
    );
    const personData = await databaseActions.findOne("application","Persons",{
      where:{
        userId:id
      }
    });
    const personContactsData = await databaseActions.findOne("application","PersonContacts",{
      where:{
        personId:personData.id,
        type:"linkedin"
      }
    });
    console.log("This is UserSettings data",userSettingsData);
    console.log("This is Person Contacts data ",personContactsData);
    console.log("This is Person Data",personData);
    const linkedinId = personContactsData.data;
    const token = userSettingsData.value;
    console.log("This is the linkedinId",linkedinId);
    console.log("This is the Linkedin token",token);
    let response: { status: number; message: string } = {
      status: 0,
      message: ""
    };
    if (s3ImageUrl && Array.isArray(s3ImageUrl) && s3ImageUrl.length > 1) {
      // Handle multiple image URLs
      response = await postTextWithMultipleImageToLinkedIn(message, s3ImageUrl, linkedinId, token);
    } else if (s3ImageUrl && Array.isArray(s3ImageUrl) && s3ImageUrl.length == 1) {
      // Handle single image URL
      response = await postTextWithImageToLinkedIn(message, [s3ImageUrl], linkedinId, token);
    } else {
      // No image file case
      response = await postTextToLinkedIn(linkedinId, token, message);
    }
    console.log(response);
    return { status: response.status, message: response.message};
  }
  catch (error) {
    // Handle any errors during the request
    WrappidLogger.error("This error has occured inside catch"+error);
    return { status: 400, message: `An error occurred while posting to LinkedIn ${error}` };
      
  }
}

const postTextWithImageToLinkedIn = async (message:string,s3ImageUrl:any,linkedinId:string,token:string)=>{    
  const URN = `urn:li:person:${linkedinId}`;
  if (!token || !message || !URN || !s3ImageUrl) {
    return { status: 401, message: "Access token and message are required" };
  }

  const imageBlob = await getImageFromS3(s3ImageUrl);

  // First, upload the image and get the media URN
  const {asset} = await uploadImageToLinkedIn(imageBlob, token,URN);



  const postData = {
    author: `${URN}`, // URN of the person (e.g., 'urn:li:person:8675309')
    lifecycleState: "PUBLISHED", // Post state
    specificContent: {
      "com.linkedin.ugc.ShareContent": {
        shareCommentary: {
          text: `${message}`, // Message to be posted
        },
        shareMediaCategory: "IMAGE", // Indicate that we are sharing an image
        media: [
          {
            status: "READY",
            media: `${asset}`, // The media URN returned from image upload
          },
        ],
      },
    },
    visibility: {
      "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC", // Visibility of the post
    },
  };
    
    

  const response = await fetch("https://api.linkedin.com/v2/ugcPosts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`, // User's access token
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postData), // Body data for the post
  });
    

  if (response.status !== 201) {
    // Handle error if the request failed
    return { status: response.status, message: "Failed to post to LinkedIn in the response",response };
        
  }
    
  // Success response from LinkedIn API
  if(response.status === 201){
    return { status: 201, message: "Post created successfully"};
  }
  else{
    return { status: 400, message: "An error occurred while posting to LinkedIn" };
  }

};

const postTextToLinkedIn = async ( linkedinId: string, token: string,message: string,) => {
  // Prepare the body for the LinkedIn UGC post request
  console.log("This is the linkedinId",linkedinId);
  const URN = `urn:li:person:${linkedinId}`;
  const postData = {
    author: URN, // URN of the LinkedIn user (e.g., 'urn:li:person:xxxx')
    lifecycleState: "PUBLISHED", // State of the post (published means live)
    specificContent: {
      "com.linkedin.ugc.ShareContent": {
        shareCommentary: {
          text: message, // Message to be posted
        },
        shareMediaCategory: "NONE", // No media is being shared, it's just text
      },
    },
    visibility: {
      "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC", // Post visibility (public)
    },
  };

  const response = await fetch("https://api.linkedin.com/v2/ugcPosts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`, // LinkedIn access token
      "Content-Type": "application/json; charset=utf-8", // More explicit Content-Type header
      "X-Restli-Protocol-Version": "2.0.0", // LinkedIn requires this version header
    },
    body: JSON.stringify(postData), // The body containing the post data
  });

  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const responseText = await response.text();

  if (response.status !== 201) {
    // If the post creation fails, throw an error
    return { status: response.status, message: response.statusText};
  }
  else{
    return {status:response.status,message:"Successfully posted to linkedin"};
  }
};

const postTextWithMultipleImageToLinkedIn = async (
  message: string,
  s3ImageUrls: string[], // Now an array of image URLs
  linkedinId: string,
  token: string
) => {
  const URN = `urn:li:person:${linkedinId}`;
  if (!token || !message || !URN || !s3ImageUrls || s3ImageUrls.length === 0) {
    return { status: 401, message: "Access token, message, and image URLs are required" };
  }

  // Create an array to hold asset URNs for the uploaded images
  const assetUrns: string[] = [];
  
  // Upload each image and collect the asset URNs
  for (const s3ImageUrl of s3ImageUrls) {
    const imageBlob = await getImageFromS3(s3ImageUrl);
    const { asset } = await uploadImageToLinkedIn(imageBlob, token, URN);
    assetUrns.push(asset); // Collect the asset URNs
  }

  // Construct the post data with multiple images
  const postData = {
    author: `${URN}`,
    lifecycleState: "PUBLISHED",
    specificContent: {
      "com.linkedin.ugc.ShareContent": {
        shareCommentary: {
          text: `${message}`,
        },
        shareMediaCategory: "IMAGE",
        media: assetUrns.map(asset => ({
          status: "READY",
          media: `${asset}`,
        })),
      },
    },
    visibility: {
      "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
    },
  };

  const response = await fetch("https://api.linkedin.com/v2/ugcPosts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postData),
  });

  if (response.status !== 201) {
    return { status: response.status, message: "Failed to post to LinkedIn", response };
  }

  return { status: 201, message: "Post created successfully" };
};
