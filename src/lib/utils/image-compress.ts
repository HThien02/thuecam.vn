/**
 * Compresses an image client-side and returns a size-bounded Base64 data URL.
 */
export async function compressImageToBase64(
  file: File,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.85
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        let { width, height } = img;

        // Calculate aspect-preserving dimensions
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }

        const maxEncodedBytes = 3.5 * 1024 * 1024;
        let outputQuality = quality;
        let dataUrl = '';

        for (let attempt = 0; attempt < 8; attempt += 1) {
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          try {
            dataUrl = canvas.toDataURL('image/webp', outputQuality);
            if (!dataUrl.startsWith('data:image/webp')) {
              dataUrl = canvas.toDataURL('image/jpeg', outputQuality);
            }
          } catch {
            dataUrl = canvas.toDataURL('image/jpeg', outputQuality);
          }

          const payload = dataUrl.slice(dataUrl.indexOf(',') + 1);
          const encodedBytes = Math.ceil((payload.length * 3) / 4);
          if (encodedBytes <= maxEncodedBytes) {
            resolve(dataUrl);
            return;
          }

          if (attempt < 3) {
            outputQuality = Math.max(0.45, outputQuality * 0.78);
          } else {
            width = Math.max(1, Math.floor(width * 0.8));
            height = Math.max(1, Math.floor(height * 0.8));
            outputQuality = quality;
          }
        }

        reject(new Error('Ảnh quá lớn sau khi nén. Vui lòng chọn ảnh khác hoặc giảm kích thước ảnh.'));
      };

      img.onerror = () => reject(new Error('Không thể tải file hình ảnh'));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error('Lỗi khi đọc file'));
    reader.readAsDataURL(file);
  });
}
