/**
 * Client-side unsigned upload to Cloudinary.
 *
 * Requires two env vars on the client:
 *   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
 *   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET   (an unsigned preset)
 *
 * The upload preset must be configured as "Unsigned" in your Cloudinary
 * dashboard. Folder is optional; pass to organize uploads.
 */

export type CloudinaryUploadResult = {
  url: string;
  publicId: string;
  bytes: number;
  format: string;
  resourceType: string;
  originalFilename: string;
};

export async function uploadToCloudinary(
  file: File,
  opts: { folder?: string } = {},
): Promise<CloudinaryUploadResult> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error(
      "Cloudinary is not configured. Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET.",
    );
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  if (opts.folder) formData.append("folder", opts.folder);

  // resource_type=auto lets Cloudinary detect images vs PDFs vs other files.
  const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;

  const res = await fetch(endpoint, { method: "POST", body: formData });
  if (!res.ok) {
    let msg = `Upload failed (${res.status})`;
    try {
      const j = await res.json();
      msg = j?.error?.message || msg;
    } catch {}
    throw new Error(msg);
  }

  const json = await res.json();
  return {
    url: json.secure_url as string,
    publicId: json.public_id as string,
    bytes: json.bytes as number,
    format: json.format as string,
    resourceType: json.resource_type as string,
    originalFilename: (json.original_filename as string) ?? file.name,
  };
}
