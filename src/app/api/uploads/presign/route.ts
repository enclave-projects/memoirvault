import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getPresignedUploadUrl } from '@/lib/r2';

const PUBLIC_R2_BASE_URL = process.env.PUBLIC_R2_URL ?? process.env.PUBLIC_DEVELOPMENT_URL;

interface PresignRequestFile {
  name: string;
  type?: string;
  size?: number;
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const files: PresignRequestFile[] = Array.isArray(body?.files) ? body.files : [];

    if (files.length === 0) {
      return NextResponse.json({ uploads: [] });
    }

    const now = Date.now();

    const uploads = await Promise.all(
      files.map(async (file, index) => {
        const extensionMatch = file.name?.match(/\.([a-zA-Z0-9]+)$/);
        const extension = extensionMatch ? `.${extensionMatch[1].toLowerCase()}` : '';
        const randomSegment = Math.random().toString(36).slice(2, 10);
        const key = `${userId}/${now}-${index}-${randomSegment}${extension}`;
        const contentType = file.type || 'application/octet-stream';
        const uploadUrl = await getPresignedUploadUrl(key, contentType);
        const publicUrl = PUBLIC_R2_BASE_URL ? `${PUBLIC_R2_BASE_URL}/${key}` : null;

        return {
          fileKey: key,
          uploadUrl,
          publicUrl,
          originalName: file.name,
          mimeType: contentType,
          size: file.size ?? null,
        };
      })
    );

    return NextResponse.json({ uploads });
  } catch (error) {
    console.error('Error generating presigned URLs:', error);
    return NextResponse.json({ error: 'Failed to generate upload URLs' }, { status: 500 });
  }
}
