import { NextResponse } from 'next/server';
import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import * as mime from 'mime-types';
import { v4 as uuidv4 } from 'uuid';
import { ObjectCannedACL } from "@aws-sdk/client-s3";

// Configure the S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'ap-south-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
  // Do NOT include the bucket name in the endpoint
  endpoint: 'https://s3.ap-south-1.amazonaws.com',
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert File to Buffer
    const fileBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(fileBuffer);

    // Generate unique filename with original extension
    const originalName = file.name;
    const extension = originalName.split('.').pop() || '';
    const timestamp = Date.now();
    const uniqueFilename = `${timestamp}-${uuidv4()}.${extension}`;

    // Determine content type or use default
    const contentType = mime.lookup(originalName) || 'application/octet-stream';
    
    // Create upload params
    const bucketName = process.env.AWS_S3_BUCKET_NAME || 'tensorboy';

    const params = {
      Bucket: bucketName,
      Key: uniqueFilename,
      Body: buffer,
      ContentType: contentType,
      ACL: "public-read" as ObjectCannedACL, // Make the file publicly accessible
    };

    // Upload to S3
    const upload = new Upload({
      client: s3Client,
      params: params,
    });

    const result = await upload.done();

    // Construct the file URL
    const fileUrl = `https://${bucketName}.s3.ap-south-1.amazonaws.com/${uniqueFilename}`;

    return NextResponse.json({
      message: "Upload successful!",
      fileUrl: fileUrl,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}