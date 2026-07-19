const express = require("express");
const multer = require("multer");
const path = require("path");

const router = express.Router();

const deviceAuth = require("../middleware/deviceAuth");
const verifyToken = require("../middleware/auth");
const db = require("../config/db");


// ============================================
// MULTER STORAGE
// ============================================

const storage = multer.diskStorage({

    destination:(req,file,cb)=>{

        if(file.fieldname==="music"){

            cb(null,"uploads/music");

        }

        else if(file.fieldname==="cover"){

            cb(null,"uploads/covers");

        }

    },


    filename:(req,file,cb)=>{


        const filename =
        Date.now()
        +
        "-"
        +
        Math.round(Math.random()*1000000)
        +
        path.extname(file.originalname);


        cb(null,filename);


    }


});



const upload = multer({
    storage
});




// ============================================
// ADMIN UPLOAD MUSIC
// ============================================


router.post(

"/upload",

verifyToken,


upload.fields([

{
    name:"music",
    maxCount:1
},

{
    name:"cover",
    maxCount:1
}

]),



async(req,res)=>{


try{


const {

    title,
    artist,
    lyrics

}=req.body;



const uploadedBy=req.user.id;




if(!title || !artist){


return res.status(400).json({

success:false,

message:"Title and Artist are required."

});


}




if(!req.files || !req.files.music){


return res.status(400).json({

success:false,

message:"Music file is required."

});


}




const musicFile =

"uploads/music/"
+
req.files.music[0].filename;



let coverImage=null;



if(req.files.cover){


coverImage=

"uploads/covers/"
+
req.files.cover[0].filename;


}




const [result]=await db.query(

`

INSERT INTO music

(

title,

artist,

music_file,

cover_image,

lyrics,

uploaded_by

)

VALUES

(?,?,?,?,?,?)

`

,

[

title,

artist,

musicFile,

coverImage,

lyrics || null,

uploadedBy

]


);



return res.status(201).json({

success:true,

message:"Music uploaded successfully.",


musicId:result.insertId,


data:{

title,

artist,

musicFile,

coverImage,

lyrics

}


});



}


catch(err){


console.log("UPLOAD ERROR:",err);


res.status(500).json({

success:false,

message:"Server error during upload."

});


}



}


);





// ============================================
// ADMIN GET ALL MUSIC
// ============================================


router.get(

"/all",

verifyToken,


async(req,res)=>{


try{


const [music]=await db.query(

`

SELECT

id,

title,

artist,

music_file,

cover_image,

lyrics


FROM music


ORDER BY id DESC

`

);



res.json({

success:true,

music

});



}

catch(err){


console.log(err);


res.status(500).json({

success:false,

message:"Failed loading music"

});


}


}


);





// ============================================
// DEVICE USER MUSIC
// ============================================


router.get(

"/my-music",

deviceAuth,


async(req,res)=>{


try{


const [music]=await db.query(

`

SELECT

id,

title,

artist,

music_file,

cover_image,

lyrics


FROM music


ORDER BY id DESC

`

);



res.json({

success:true,

music

});



}

catch(err){


console.log(err);


res.status(500).json({

success:false,

message:"Failed to load music"

});


}



}


);
// ============================================
// GET ALL MUSIC PUBLIC
// ============================================

router.get("/", async (req, res) => {

    try {


        const [music] = await db.query(

            `
            SELECT

            id,

            title,

            artist,

            music_file,

            cover_image,

            lyrics


            FROM music

            ORDER BY id ASC

            `

        );



        res.json({

            success:true,

            music

        });



    }

    catch(err){


        console.log(err);


        res.status(500).json({

            success:false,

            message:"Failed to load music"

        });


    }


});






// ============================================
// GET SINGLE MUSIC
// ============================================


router.get("/:id", async(req,res)=>{


try{


const [rows]=await db.query(

`

SELECT

id,

title,

artist,

music_file,

cover_image,

lyrics


FROM music


WHERE id=?


`

,

[req.params.id]


);



if(rows.length===0){


return res.status(404).json({

success:false,

message:"Music not found"

});


}



res.json({

success:true,

music:rows[0]

});



}


catch(err){


console.log(err);


res.status(500).json({

success:false,

message:"Server Error"

});


}



});







// ============================================
// UPDATE MUSIC
// ============================================

router.put(
    "/:id",
    upload.fields([
        { name: "music_file", maxCount: 1 },
        { name: "cover_image", maxCount: 1 }
    ]),
    async (req, res) => {

    const fs = require("fs");
    const path = require("path");

    try {

        const id = req.params.id;


        console.log("UPDATE BODY:", req.body);
        console.log("UPDATE FILES:", req.files);



        // Get old files
        const [rows] = await db.query(
            "SELECT music_file, cover_image FROM music WHERE id=?",
            [id]
        );


        if(rows.length === 0){

            return res.status(404).json({
                message:"Music not found"
            });

        }


        const oldMusic = rows[0];


        let musicFile = oldMusic.music_file;
        let coverImage = oldMusic.cover_image;



        let oldMusicPath = null;
        let oldCoverPath = null;



        // New music uploaded
        if(req.files?.music_file){


            musicFile =
                "uploads/music/" +
                req.files.music_file[0].filename;



            if(oldMusic.music_file){

                oldMusicPath = path.join(
                    __dirname,
                    "..",
                    oldMusic.music_file
                );

            }

        }




        // New cover uploaded
        if(req.files?.cover_image){


            coverImage =
                "uploads/covers/" +
                req.files.cover_image[0].filename;



            if(oldMusic.cover_image){

                oldCoverPath = path.join(
                    __dirname,
                    "..",
                    oldMusic.cover_image
                );

            }

        }




        // Update database
        await db.query(
            `
            UPDATE music SET
                title=?,
                artist=?,
                lyrics=?,
                music_file=?,
                cover_image=?
            WHERE id=?
            `,
            [
                req.body.title,
                req.body.artist,
                req.body.lyrics || "",
                musicFile,
                coverImage,
                id
            ]
        );





        // Delete old music file
        if(oldMusicPath){

            if(fs.existsSync(oldMusicPath)){
                fs.unlinkSync(oldMusicPath);
            }

        }




        // Delete old cover image
        if(oldCoverPath){

            if(fs.existsSync(oldCoverPath)){
                fs.unlinkSync(oldCoverPath);
            }

        }





        res.json({

            success:true,

            message:"Music updated successfully"

        });



    }
    catch(error){

        console.error("UPDATE ERROR:",error);


        res.status(500).json({

            message:error.message

        });

    }

});

// ============================================
// DELETE MUSIC
// ============================================

router.delete("/:id", async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT music_file, cover_image FROM music WHERE id=?",
            [req.params.id]
        );

        if(rows.length === 0){
            return res.status(404).json({
                message:"Music not found"
            });
        }

        const music = rows[0];

        // delete database record
        await db.query(
            "DELETE FROM music WHERE id=?",
            [req.params.id]
        );


        // delete uploaded files
        const fs = require("fs");
        const path = require("path");


        if(music.music_file){
            const musicPath = path.join(
                __dirname,
                "..",
                music.music_file
            );

            if(fs.existsSync(musicPath)){
                fs.unlinkSync(musicPath);
            }
        }


        if(music.cover_image){
            const coverPath = path.join(
                __dirname,
                "..",
                music.cover_image
            );

            if(fs.existsSync(coverPath)){
                fs.unlinkSync(coverPath);
            }
        }


        res.json({
            success:true,
            message:"Music and files deleted successfully"
        });


    } catch(error){
        console.error(error);
        res.status(500).json({
            message:"Delete failed"
        });
    }
});



module.exports = router;