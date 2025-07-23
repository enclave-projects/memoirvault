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
    const command = new DeleteObjectCommand({
        Bucket: process.env.BUCKET_NAME!,
        Key: key,
    });

    await r2Client.send(command);
}

export async function getPresignedUploadUrl(key: string, contentType: string) {
    const command = new PutObjectCommand({
        Bucket: process.env.BUCKET_NAME!,
        Key: key,
        ContentType: contentType,
    });

    return await getSignedUrl(r2Client, command, { expiresIn: 3600 });
}