export async function compressImage(file: File, maxWidth = 800, maxHeight = 800): Promise<Blob> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                if (!ctx) {
                    reject(new Error('Canvas context not available'));
                    return;
                }
                
                let width = img.width;
                let height = img.height;
                
                if (width > height) {
                    if (width > maxWidth) {
                        height *= maxWidth / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width *= maxHeight / height;
                        height = maxHeight;
                    }
                }
                
                canvas.width = width;
                canvas.height = height;
                
                ctx.drawImage(img, 0, 0, width, height);
                
                canvas.toBlob((blob) => {
                    if (blob) {
                        console.log(`Image Compressed: 
                            Original: ${(file.size / 1024 / 1024).toFixed(2)} MB 
                            Compressed: ${(blob.size / 1024).toFixed(2)} KB`);
                        resolve(blob);
                    } else {
                        reject(new Error('Compression failed'));
                    }
                }, 'image/webp', 0.8);
            };
            
            img.onerror = (err) => reject(err);
        };
        
        reader.onerror = (err) => reject(err);
    });
}
