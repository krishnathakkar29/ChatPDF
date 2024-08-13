// import AWS from "aws-sdk";
// export async function uploadToS3(file: File) {
//   try {
//     AWS.config.update({
// accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID,
// secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY,
//     });

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

//     const s3 = new AWS.S3({
//       params: {
//         Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
//       },
//       region: "eu-north-1",
//     });

//     const file_key =
//       "uploads/" + Date.now().toString() + file.name.replace(" ", "-");
//     const params = {
//       Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
//       Key: file_key,
//       Body: file,
//     };

//     const upload = s3
//       .putObject(params)
//       .on("httpUploadProgress", (event) => {
//         console.log(
//           "uploading to s3...",
//           parseInt(((event.loaded * 100) / event.total).toString())
//         ) + "%";
//       })
//       .promise();

//     await upload.then((data) => {
//       console.log("upload in s3 then ", data);
//       console.log("succesfully uploaded to S3", file_key);
//     });

//     return Promise.resolve({
//       file_key,
//       file_name: file.name,
//     });
//   } catch (error) {}
// }

import { PutObjectCommandOutput, S3 } from "@aws-sdk/client-s3";

export async function uploadToS3(
  file: File
): Promise<{ file_key: string; file_name: string }> {
  return new Promise((resolve, reject) => {
    try {
      const s3 = new S3({
        region: "eu-north-1",
        credentials: {
          accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID!,
          secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY!,
        },
      });

      const file_key =
        "uploads/" + Date.now().toString() + file.name.replace(" ", "-");

      const params = {
        Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
        Key: file_key,
        Body: file,
      };
      s3.putObject(
        params,
        (err: any, data: PutObjectCommandOutput | undefined) => {
          return resolve({
            file_key,
            file_name: file.name,
          });
        }
      );
    } catch (error) {
      reject(error);
    }
  });
}

export function getS3Url(file_key: string) {
  const url = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.eu-north-1.amazonaws.com/${file_key}`;
  return url;
}
