import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';


interface FileRecord {
    id: string;
    filename: string;
    originalName: string;
    path: string;
    size: number;
    mimeType: string;
    uploadDate: string;
}


const fileDatabase: FileRecord[] = [];

export async function POST(request: NextRequest) {
    try {
        // Parse the form data
        const data = await request.formData();
        const file: File | null = data.get('file') as unknown as File;

        if (!file) {
            return NextResponse.json(
                { error: 'No file uploaded' },
                { status: 400 }
            );
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            return NextResponse.json(
                { error: 'Only image files are allowed' },
                { status: 400 }
            );
        }

        // Validate file size (5MB max)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            return NextResponse.json(
                { error: 'File size must be less than 5MB' },
                { status: 400 }
            );
        }

        // Generate unique filename
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 15);
        const fileExtension = path.extname(file.name);
        const uniqueFilename = `${timestamp}_${randomString}${fileExtension}`;

        // Create uploads directory if it doesn't exist
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
        if (!existsSync(uploadsDir)) {
            await mkdir(uploadsDir, { recursive: true });
        }

        // Convert file to buffer and save
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filePath = path.join(uploadsDir, uniqueFilename);

        await writeFile(filePath, buffer);

        // Create file record for dummy database
        const fileRecord: FileRecord = {
            id: `file_${timestamp}_${randomString}`,
            filename: uniqueFilename,
            originalName: file.name,
            path: `/uploads/${uniqueFilename}`,
            size: file.size,
            mimeType: file.type,
            uploadDate: new Date().toISOString(),
        };

        // Store in dummy database
        fileDatabase.push(fileRecord);

        console.log('File uploaded successfully:', fileRecord);
        console.log('Total files in database:', fileDatabase.length);

        return NextResponse.json({
            success: true,
            message: 'File uploaded successfully',
            id: fileRecord.id,
            filename: fileRecord.originalName,
            path: fileRecord.path,
            size: fileRecord.size,
        });

    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: 'Failed to upload file' },
            { status: 500 }
        );
    }
}