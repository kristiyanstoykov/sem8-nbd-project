import path from "path";
import fs from "node:fs/promises";
import { revalidatePath } from "next/cache";
const uploadsDirPath = process.env.UPLOADS_DIR_PATH;
const uploadsDirName = process.env.UPLOADS_DIR_NAME;

/**
 * Generates a unique file name and ensures the directory exists.
 * @param {string} file - The original file name.
 * @returns {Promise<{ filePath: string, fileName: string, imgThumbnailPath: string }>}
 */
export async function generateFilePath(file) {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  const uniqueId = Math.random().toString(36).substring(2, 8); // Generate a unique 6-character ID
  const currentYear = new Date().getFullYear();
  const fileName = `${uniqueId}-${file.name}`;
  const filePath = `${uploadsDirPath}/${currentYear}`;
  const fullFilePath = `${filePath}/${fileName}`;

  // Create directory if it doesn't exist
  await fs.mkdir(`${filePath}`, { recursive: true });
  // Write the file
  await fs.writeFile(`${filePath}/${fileName}`, buffer);
  revalidatePath("/");

  return {
    filePath,
    fullFilePath,
    imgThumbnailPath: `/${uploadsDirName}/${currentYear}/${fileName}`,
  };
}
