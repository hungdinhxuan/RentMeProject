module.exports = {
  multer: {
    mimeTypes: {
        audio: [
          'audio/mpeg',
          'audio/midi',
          'audio/x-midi',
          'audio/ogg',
          'audio/opus',
          'audio/wav',
          'audio/webm',
        ],
        image: [
          'image/png',
          'image/jpg',
          'image/jpeg',
          'image/gif',
          'image/svg+xml',
        ],
        video: [
          'video/x-msvideo',
          'video/mp4',
          'video/mpeg',
          'video/ogg',
          'video/webm',
          'video/3gpp',
        ],
      },
      fileTypes: ['image', 'images', 'audio', 'video'],
      multerError: {
        audio:
          'Audio must be .mpeg, .mp3, .mpeg3, .mid .midi, .oga, .opus, .wav, .weba format',
        image: 'Image must be .png, .jpg, .gif, .svg and .jpeg format',
        video: 'Video must be .avi, .mp4, .mpeg, .ogv, .webm and .3gp format',
      },
      multerFileSizeLimit: {
        audio: 1024 * 1024 * 10, // 10MB
        image: 1024 * 1024 * 10, 
        video: 1024 * 1024 * 50,  // 50MB
      },
      maxCount: {
        images: 10,
      }
  },
};
