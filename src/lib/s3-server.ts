// import { S3 } from "@aws-sdk/client-s3";
// import fs from "fs";
// import path from "path";
// import os from "os";
// export async function downloadFromS3(file_key: string): Promise<string> {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const s3 = new S3({
// region: "eu-north-1", // ensure this matches the region of your bucket
// endpoint: `https://s3.eu-north-1.amazonaws.com`, // specify the correct regional endpoint
//         credentials: {
//           accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID!,
//           secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY!,
//         },
//       });

//       const params = {
//         Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
//         Key: file_key,
//       };

//       const obj = await s3.getObject(params);

//       // Use the user's temp directory
//       const file_name = path.join(
//         os.tmpdir(),
//         `krishna${Date.now().toString()}.pdf`
//       );

//       if (obj.Body instanceof require("stream").Readable) {
//         const file = fs.createWriteStream(file_name);
//         file.on("open", function (fd) {
//           obj.Body?.pipe(file).on("finish", () => {
//             return resolve(file_name);
//           });
//         });
//       }
//     } catch (error) {
//       console.error(error);
//       reject(error);
//       return null;
//     }
//   });
// }

import { S3 } from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";

export async function downloadFromS3(file_key: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      const s3 = new S3({
        region: "eu-north-1",
        endpoint: `https://s3.eu-north-1.amazonaws.com`,
        credentials: {
          accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID!,
          secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY!,
        },
      });

      const params = {
        Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
        Key: file_key,
      };

      const obj = await s3.getObject(params);


      const downloadPath = path.join(
        "C:",
        "Users",
        "Krishna Thakkar",
        "Downloads",
        `krishna${Date.now().toString()}.pdf`
      );

      if (obj.Body instanceof require("stream").Readable) {
        const file = fs.createWriteStream(downloadPath);
        file.on("open", function (fd) {
          obj.Body?.pipe(file).on("finish", () => {
            return resolve(downloadPath);
          });
        });
      }
    } catch (error) {
      console.error(error);
      reject(error);
      return null;
    }
  });
}
