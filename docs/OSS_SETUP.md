# Alibaba Cloud OSS Integration

This document explains how to configure and use Alibaba Cloud Object Storage Service (OSS) for storing uploaded images.

## Prerequisites

1. An Alibaba Cloud account
2. OSS service activated
3. A bucket created in OSS

## Configuration Steps

### 1. Create OSS Bucket

1. Log in to [Alibaba Cloud Console](https://www.aliyun.com/)
2. Navigate to **Object Storage Service (OSS)**
3. Click **Create Bucket**
4. Configure your bucket:
   - **Bucket Name**: Choose a unique name (e.g., `my-app-images`)
   - **Region**: Select a region close to your users (e.g., `oss-cn-hangzhou`)
   - **Storage Class**: Standard (for frequently accessed images)
   - **Access Control List (ACL)**:
     - Choose **Private** if you want to control access with signed URLs
     - Choose **Public Read** if images should be publicly accessible
   - **Versioning**: Optional
   - **Encryption**: Optional

### 2. Create Access Keys

1. In Alibaba Cloud Console, click your profile icon
2. Go to **AccessKey Management**
3. Click **Create AccessKey**
4. Save your **AccessKey ID** and **AccessKey Secret** securely

**Security Note**: Never commit these keys to version control. Use environment variables only.

### 3. Configure Environment Variables

Add the following variables to your `.env.local` file:

```bash
# Alibaba Cloud OSS Configuration
OSS_REGION="oss-cn-hangzhou"                    # Your bucket region
OSS_ACCESS_KEY_ID="your_access_key_id"          # Your AccessKey ID
OSS_ACCESS_KEY_SECRET="your_access_key_secret"  # Your AccessKey Secret
OSS_BUCKET="your_bucket_name"                   # Your bucket name
```

**Available Regions**:
- `oss-cn-hangzhou` - China (Hangzhou)
- `oss-cn-shanghai` - China (Shanghai)
- `oss-cn-beijing` - China (Beijing)
- `oss-cn-shenzhen` - China (Shenzhen)
- `oss-cn-hongkong` - China (Hong Kong)
- `oss-us-west-1` - US (Silicon Valley)
- `oss-ap-southeast-1` - Singapore
- [See all regions](https://www.alibabacloud.com/help/en/oss/user-guide/regions-and-endpoints)

### 4. Set Bucket CORS (for browser uploads)

If you plan to upload directly from the browser, configure CORS:

1. Go to your bucket settings
2. Navigate to **Access Control** → **Cross-Origin Resource Sharing (CORS)**
3. Add a rule:
   ```
   Allowed Origins: *
   Allowed Methods: GET, POST, PUT
   Allowed Headers: *
   Expose Headers: ETag
   Max Age: 600
   ```

## Usage

### Upload File to OSS

The upload is automatically handled when users upload images through the image-to-prompt feature:

```typescript
// In your API route
import { uploadToOSS } from "~/lib/oss";

const file = formData.get("file") as File;
const result = await uploadToOSS(file, "image-to-prompt");

console.log("Uploaded to:", result.url);
// Example: https://your-bucket.oss-cn-hangzhou.aliyuncs.com/image-to-prompt/1234567890-abc123.jpg
```

### Manual Usage

```typescript
import { uploadToOSS, deleteFromOSS, getSignedUrl } from "~/lib/oss";

// Upload a file
const result = await uploadToOSS(file, "custom-folder");
console.log(result.url);    // Public URL
console.log(result.path);   // File path in bucket
console.log(result.name);   // Generated filename

// Delete a file
await deleteFromOSS("custom-folder/1234567890-abc123.jpg");

// Generate signed URL (for private buckets)
const signedUrl = await getSignedUrl("custom-folder/1234567890-abc123.jpg", 3600);
// URL valid for 1 hour (3600 seconds)
```

## File Organization

Files are organized by feature:

```
your-bucket/
├── image-to-prompt/         # Images uploaded for image-to-prompt feature
│   ├── 1234567890-abc123.jpg
│   └── 1234567891-def456.png
└── other-features/          # Files from other features
    └── ...
```

## Cost Considerations

OSS pricing consists of:

1. **Storage**: ~$0.02/GB/month
2. **Outbound Traffic**: ~$0.08/GB
3. **Requests**: Very low cost ($0.01 per 10,000 requests)

**Tips to reduce costs**:
- Use **lifecycle rules** to delete old files automatically
- Enable **CDN** for frequently accessed images
- Choose the right **storage class** (Standard vs Infrequent Access)

## Security Best Practices

1. **Never expose AccessKey credentials**
   - Keep them in `.env.local` only
   - Use environment variables in production
   - Rotate keys periodically

2. **Use RAM roles** in production (recommended)
   - Provides temporary credentials
   - Better security than permanent AccessKeys

3. **Set appropriate bucket ACL**
   - Private: For sensitive files (use signed URLs)
   - Public Read: For public images/assets

4. **Enable bucket logging**
   - Track all access to your bucket
   - Useful for security auditing

## Troubleshooting

### Error: "The OSS Access Key Id you provided does not exist"
- Check if `OSS_ACCESS_KEY_ID` is correct
- Verify the key is active in AccessKey Management

### Error: "The bucket you are attempting to access must be addressed using the specified endpoint"
- Check if `OSS_REGION` matches your bucket's region
- Verify bucket name is correct

### Error: "Access denied"
- Check bucket ACL settings
- Verify AccessKey has permission to access the bucket
- Add RAM policy if needed

### Images not loading
- Check bucket ACL (should be Public Read for direct access)
- Verify CORS settings if uploading from browser
- Check URL format in response

## Additional Resources

- [OSS Official Documentation](https://www.alibabacloud.com/help/en/oss/)
- [OSS SDK for Node.js](https://github.com/ali-sdk/ali-oss)
- [OSS Pricing](https://www.alibabacloud.com/product/object-storage-service/pricing)
- [RAM Policy Examples](https://www.alibabacloud.com/help/en/oss/user-guide/overview-23)
