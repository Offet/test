// import multer and savefiles for files upload
import multer from "multer";
import { multerSaveFilesOrg } from "multer-savefilesorg";
// import path from "path";

export  const remoteUpload = multer({
    storage: multerSaveFilesOrg({
        apiAccessToken: process.env.SAVEFILESORG_API_KEY,
        relativePath: '/uploads/*'
    }),
});



// export  const remoteUpload = multer({
//     storage: multerSaveFilesOrg({
//         apiAccessToken: process.env.SAVEFILESORG_API_KEY,
//         relativePath: "/upload/*"
//     }),
// });


// Set up file upload destination and naming
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, 'uploads/');
//     },
//     filename: (req, file, cb) => {
//       cb(null, Date.now() + path.extname(file.originalname));
//     }
//   });
//   export const upload = multer({ storage });