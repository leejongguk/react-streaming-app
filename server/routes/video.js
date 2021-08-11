
const express = require('express');
const router = express.Router();
// const { Video } = require("../models/Video");

const { auth } = require("../middleware/auth");
const multer = require("multer");
// const { decodeBase64 } = require('bcryptjs');
var ffmpeg = require("fluent-ffmpeg");

// STORAGE MULTER CONFIG
let storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"uploads/");

    },
    filename:(req,file,cb)=>{
        cb(null,`${Date.now()}_${file.originalname}`);
    },
    fileFilter:(req,file,cb)=>{
            const ext= path.extname(file.originalname)
            if(ext !== '.mp4'){
                return cb(res.status(400).end('only mp4 is allowed'), false);                    
            }
            cb(null,true)
       
    }
})
const upload = multer({ storage: storage }).single("file");
//=================================
//             Video
//=================================

router.post("/uploadfiles", auth, (req, res) => {


    //비디오를 서버에 저장한다.
    upload(req, res, err=>{
        if(err){
            return res.json({ success: false, err})
        }
        return res.json({ success: true, url: res.req.file.path,fileName: res.req.file.fileName })
    })

})
  


router.post("/thumbnail", (req, res) => {
    //썸네일 생성하고 비디오 러닝타임도 가져오기


    let filePath = "";
    let fileDuration = "";


    //비디오정보 가져오기
    ffmpeg.ffprobe(req.body.url, function(err,metadata){
        console.dir(metadata);
        console.log(metadata.format.duration);
        fileDuration = metadata.format.duration

    });

    //썸네일 생성
    ffmpeg(req.body.url)
    .on('filenames', function(filenames){
        console.log('Will generate ' + filenames.join(', '))
        console.log(filenames)

        filePath = "uploads/thumbnails/" + filenames[0]
    })
    .on('end', function(){
        console.log('Screenshots taken');
        return res.json({success: true, url: filePath, fileName: filenames, fileDuration: fileDuration});
    })
    .on('error',function(err){
        console.error(err);
        return res.json({ success: false, err});

    })
    .screenshots({
        count: 3, //3개의 스크린샷
        folder: 'uploads/thumbnails', // 저장될 폴더
        size: '320x240', //스크린샷크기
        filename: 'thumbnail-%b.png' //파일이름 (파일 확장자는 빼고...)
    })
    
})
  

module.exports = router;