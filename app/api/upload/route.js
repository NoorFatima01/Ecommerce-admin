import { NextResponse } from "next/server";
// import multiparty from "multiparty";
import { S3Client } from "@aws-sdk/client-s3";
// import fs from "fs";
import mime from "mime-types";
import { PutObjectCommand } from "@aws-sdk/client-s3";

const client = new S3Client({
  region: "eu-north-1",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
  },
});

async function uploadFileTos3(file, fileName) {
  const fileBuffer = file;
  const ext = fileName.split(".").pop();

  console.log("name", fileName);
  const newFileName = `${Date.now()}-${fileName}`;
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `${Date.now()}-${fileName}`,
    Body: fileBuffer,
    ACL: "public-read",
    ContentType: mime.lookup(fileName),
  };

  const command = new PutObjectCommand(params);
  await client.send(command);
  const link = `https://${process.env.S3_BUCKET_NAME}.s3.eu-north-1.amazonaws.com/${newFileName}`;
  // https://noor-next-ecommerce.s3.eu-north-1.amazonaws.com/1705939479267-doggo.jpeg 
   return link;
}
// at a time only one file can be uploaded
export async function POST(req, res) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.error(new Error("No file found"), { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = await uploadFileTos3(buffer, file.name);

    return NextResponse.json({ success: true, fileName }, { status: 200 });
  } catch (error) {
    console.log("error:" + error);
    return NextResponse.error(error);
  }
}

// export const config = {
//   api:{bodyParser:false}
// }

// const form = new multiparty.Form();
// console.log("form", form);
// form.parse(req);
// console.log("fields", fields);
// console.log("files", files);
// const {fields, files} = await new Promise((resolve, reject) => {
// form.parse(req, function (err, fields, files){
//   if(err){
//     console.log("error1:" + err);
//     reject(err);
//   }
//   console.log("resolve");
//   resolve({fields, files});

// })});

// form.parse(req, function (err, fields, files){
//   console.log(fields) ;
// console.log(files) ;
// });

// const links = [];
// for (const file of files.file){
//   const ext = file.originalFilename.split(".").pop();
//   const newFileName = Date.now() + "." + ext;
//   client.send(new PutObjectCommand({
//     Bucket: process.env.S3_BUCKET_NAME,
//     Key: files.image[0].originalFilename,
//     Body: fs.readFileSync(file.path),
//     ACL: "public-read",
//     ContentType: mime.lookup(file.path),
//   }));

//   const link = `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${newFileName}`;
//   links.push(link);
// }

// return NextResponse.json(links, { status: 200 });
