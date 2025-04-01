import * as postToLinkedIn from "../functions/postToLinkedIn.function";


export const posts = async (req: any, res: any) => {
  try {
    const {message} = req.body;
    const id = req.user.userId;
    console.log("This is req.files",req.files);
    const imageFile:any = [];
    if (req.files && Object.keys(req.files).length > 0) {
      for(let i=0;i<req.body.fileUrls.length;i++){
        imageFile.push(req.body.fileUrls[i]);
      }
    }


    // console.log("This is the files",req.files["photo"][0]);
    
    // Debugging logs
    console.log("Message:", message);
    console.log("ID:", id);
    console.log("ImageFile:", imageFile);
    console.log("These are the users from our front end ",req.user);

  
    const { status, ...resData } = await postToLinkedIn.LinkedInPosts(id,message,imageFile);
    res.status(status).json({...resData});
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};