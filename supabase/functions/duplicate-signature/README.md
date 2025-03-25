# Duplicate Signature Edge Function

This Supabase Edge Function enables users to duplicate their existing signatures, including copying any associated images to new locations with unique filenames.

## Functionality

1. The function receives a request with the ID of a signature to duplicate
2. It validates the signature exists and belongs to the requesting user
3. It checks if the user has reached their signature limit (max 10)
4. It creates a new signature record with the original content to get a new ID
5. It processes all images in the signature, downloading them from S3 and uploading them to new locations with new filenames
6. It updates the new signature record with the processed content containing the new image URLs
7. It returns the new signature ID to the client

## API

### Request

```http
POST /functions/v1/duplicate-signature
Authorization: Bearer <user-jwt-token>
Content-Type: application/json

{
  "signatureId": "uuid-of-signature-to-duplicate"
}
```

### Response

#### Success (201 Created)

```json
{
  "signatureId": "uuid-of-new-signature"
}
```

#### Error Responses

- 400 Bad Request: Invalid request format, missing signatureId, or signature limit reached
- 403 Forbidden: Authentication error or signature not found/not owned by user
- 500 Internal Server Error: Unexpected error during processing

## Implementation Details

The function performs deep traversal of the signature content object to find all image references. For each image:

1. It extracts the S3 key from the URL
2. It downloads the image data from S3
3. It generates a new unique filename
4. It uploads the image to a new location in S3, using the new signature ID
5. It updates the image URL in the signature content

This ensures that the duplicated signature has its own independent set of images that won't be affected if the original signature is deleted or modified.
