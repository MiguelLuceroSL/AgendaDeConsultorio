import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

cloudinary.config({
  cloud_name: 'dsowk9sfq',
  api_key: '133735432653427',
  api_secret: 'LXBpONLH2zcCeZ41MDiCkTx51k8',
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'turnos_dni', //carpeta en mi Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

export { cloudinary, storage };