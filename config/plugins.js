module.exports = ({ env }) => {
  const isCloudinaryConfigured = 
    env('CLOUDINARY_NAME') && 
    env('CLOUDINARY_NAME') !== 'Root' && 
    env('CLOUDINARY_KEY') && 
    env('CLOUDINARY_SECRET');

  if (isCloudinaryConfigured) {
    return {
      upload: {
        config: {
          provider: 'cloudinary',
          providerOptions: {
            cloud_name: env('CLOUDINARY_NAME'),
            api_key: env('CLOUDINARY_KEY'),
            api_secret: env('CLOUDINARY_SECRET'),
          },
        },
        actionOptions: {
          upload: {},
          uploadStream: {},
          delete: {},
        },
      },
    };
  }

  // De lo contrario, usar almacenamiento local por defecto
  return {};
};