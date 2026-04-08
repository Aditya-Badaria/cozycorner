/**
 * Compress image to reduce file size
 * @param {string} base64Image - Base64 encoded image
 * @param {number} maxWidth - Maximum width in pixels
 * @param {number} maxHeight - Maximum height in pixels
 * @param {number} quality - Compression quality (0-1)
 * @returns {Promise<string>} Compressed base64 image
 */
export const compressImage = (base64Image, maxWidth = 800, maxHeight = 600, quality = 0.8) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Image;

    img.onload = () => {
      let width = img.width;
      let height = img.height;

      // Calculate new dimensions
      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      // Create canvas and compress
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      resolve(canvas.toDataURL("image/jpeg", quality));
    };

    img.onerror = () => {
      resolve(base64Image); // Return original if compression fails
    };
  });
};

/**
 * Compress multiple images
 */
export const compressMultipleImages = async (images) => {
  const compressed = await Promise.all(
    images.map((img) =>
      compressImage(img.url, 800, 600, 0.75).then((url) => ({
        ...img,
        url,
      }))
    )
  );
  return compressed;
};
