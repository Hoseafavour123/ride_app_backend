import cloudinary from '../config/cloudinary'

export const uploadImageBuffer = async (buffer: Buffer) => {
  return new Promise<{ secure_url: string; public_id: string }>(
    (resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'products' },
        (err, result) => {
          if (err || !result) return reject(err)
          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
          })
        }
      )
      stream.end(buffer)
    }
  )
}