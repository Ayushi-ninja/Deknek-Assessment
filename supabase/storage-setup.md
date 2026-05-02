# Supabase Storage Setup Guide

## Step 1: Create Storage Bucket

1. Go to your Supabase project dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **"New bucket"**
4. Name the bucket: `models`
5. Make it **Public** (so users can view thumbnails and download models)
6. Click **"Create bucket"**

## Step 2: Configure Bucket Policies

After creating the bucket, you need to set up policies for file access:

### For Public Read Access (Thumbnails and Models)

1. Click on the `models` bucket
2. Go to **Policies** tab
3. Create a new policy for **SELECT** (read):
   - Name: `Allow public read access`
   - Allowed operations: `SELECT`
   - Target role: `anon` (public)
   - Policy definition: `true`

### For Admin Upload Access

1. Create a new policy for **INSERT** (upload):
   - Name: `Allow admins to upload`
   - Allowed operations: `INSERT`
   - Target role: `authenticated`
   - Policy definition:
   ```sql
   (
     auth.jwt() ->> 'role' = 'admin'
   )
   ```

2. Create a new policy for **DELETE** (delete):
   - Name: `Allow admins to delete`
   - Allowed operations: `DELETE`
   - Target role: `authenticated`
   - Policy definition:
   ```sql
   (
     auth.jwt() ->> 'role' = 'admin'
   )
   ```

## Step 3: Folder Structure (Optional)

You can organize files in the bucket with folders:
- `thumbnails/` - For model preview images
- `models/` - For GLB 3D model files

## Step 4: Test Upload

After setting up the bucket, you can test uploading a file through the Supabase dashboard to ensure everything works correctly.

## Notes

- The bucket must be public for users to view thumbnails and download models
- Admin users will be able to upload files through the application
- File URLs will be in the format: `https://[project-ref].supabase.co/storage/v1/object/public/models/[file-path]`
