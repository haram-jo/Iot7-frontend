export const uploadToCloudinary = async (fileUri: string): Promise<string> => {
  const data = new FormData();
  data.append('file', {
    uri: fileUri,
    type: 'image/jpeg',
    name: 'receipt.jpg',
  } as any);
  data.append('upload_preset', 'menu_image');

  const res = await fetch(
    'https://api.cloudinary.com/v1_1/dfb4meubq/image/upload',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: data,
    },
  );

  const result = await res.json();
  return result.secure_url;
};
