const multer = require('multer');
const path = require('path')

const upload = multer({
    storage:multer.diskStorage({
        destination:(req,file,done)=>{
            done(null,'uploads')
        },
        filename:(req,file,done)=>{
            const ext = path.exename(file.originalname)
            const filename = path.basename(file.originalname,ext) + '_' + Date.now() + ext
            done(null,filename)
        }
    }),
    limits: {fileSize : 5 * 1024 * 1024}
})

module.exports = { upload }