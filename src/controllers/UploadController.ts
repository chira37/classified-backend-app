import AWS from "aws-sdk";
import config from "../config";
import { NextFunction, Request, Response } from "express";
import { httpResponse } from "../utils/constants";
import { nanoid } from "nanoid";

const credentials = {
    accessKeyId: config.awsAccessKeyId,
    secretAccessKey: config.awsSecreteAccessKey,
};

AWS.config.update({ credentials: credentials, region: "ap-south-1" });
const s3 = new AWS.S3();

class uploadController {
    public uploadImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const key = `${req.userId}/${nanoid()}.jpg`;
            const result = await s3.getSignedUrl("putObject", {
                Bucket: config.awsBucketName,
                ContentType: "image/*",
                Expires: 10 * 60,
                Key: key,
            });

            res.status(httpResponse.OK).json({
                success: true,
                message: "URL fetched successfully",
                data: { key, url: result },
            });
        } catch (error) {
            next(error);
        }
    };
}

export default uploadController;
