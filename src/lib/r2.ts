import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { NodeHttpHandler } from '@smithy/node-http-handler';
import https from 'https';

export const r2Client = new S3Client({
    region: 'auto',
    endpoint: 'https://264f6d64d30e423773358f553ad62463.r2.cloudflarestorage.com',
    credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID!,
        secretAccessKey: process.env.SECRET_ACCESS_KEY!,
    },
    forcePathStyle: true,
    requestHandler: new NodeHttpHandler({
        httpsAgent: new https.Agent({
            secureProtocol: 'TLSv1_2_method',
            rejectUnauthorized: false,
        }),
    }),
});

export async function uploadToR2(file: Buffer, key: string, contentType: string) {
    const command = new PutObjectCommand({
        Bucket: process.env.BUCKET_NAME!,
        Key: key,
        Body: file,
        ContentType: contentType,
    });

    try {
        await r2Client.send(command);

        // Return the public URL
        const publicUrl = `${process.env.PUBLIC_DEVELOPMENT_URL}/${key}`;
        return publicUrl;
    } catch (error) {
        console.error('R2 upload failed:', error);
        throw error;
    }
}

export async function deleteFromR2(key: string) {
    try {
        console.log(`🗑️ Attempting to delete from R2 bucket: ${process.env.BUCKET_NAME}, key: ${key}`);
        
        // First, let's try to check if the file exists by attempting to get its metadata
        try {
            const { HeadObjectCommand } = await import('@aws-sdk/client-s3');
            const headCommand = new HeadObjectCommand({
                Bucket: process.env.BUCKET_NAME!,
                Key: key,
            });
            const headResult = await r2Client.send(headCommand);
            console.log(`📋 File exists in R2: ${key}, size: ${headResult.ContentLength}, type: ${headResult.ContentType}`);
        } catch (headError) {
            if (headError.name === 'NotFound' || headError.name === 'NoSuchKey') {
                console.log(`⚠️ File ${key} does not exist in R2 bucket, skipping deletion`);
                return { deleted: false, reason: 'File not found' };
            }
            console.log(`⚠️ Could not check file existence: ${headError.message}`);
        }
        
        const command = new DeleteObjectCommand({
            Bucket: process.env.BUCKET_NAME!,
            Key: key,
        });

        const result = await r2Client.send(command);
        console.log(`✅ Successfully deleted from R2: ${key}`, result);
        return result;
    } catch (error) {
        console.error(`❌ R2 deletion failed for key ${key}:`, error);
        // Log more details about the error
        if (error.name === 'NoSuchKey' || error.name === 'NotFound') {
            console.log(`File ${key} does not exist in R2 bucket`);
        } else if (error.name === 'AccessDenied') {
            console.log(`Access denied when trying to delete ${key}`);
        } else {
            console.log(`Error details:`, {
                name: error.name,
                message: error.message,
                code: error.code,
                statusCode: error.$metadata?.httpStatusCode
            });
        }
        throw error;
    }
}

export async function getPresignedUploadUrl(key: string, contentType: string) {
    const command = new PutObjectCommand({
        Bucket: process.env.BUCKET_NAME!,
        Key: key,
        ContentType: contentType,
    });

    return await getSignedUrl(r2Client, command, { expiresIn: 3600 });
}