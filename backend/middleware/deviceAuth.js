const db = require("../config/db");


const deviceAuth = async (req, res, next) => {

    try {


        const deviceToken =
            req.headers["device-token"];



        if(!deviceToken){

            return res.status(401).json({

                success:false,

                message:"No device token provided"

            });

        }



        const [rows] = await db.query(

            `
            SELECT *
            FROM barcodes
            WHERE device_token=?
            AND status='ACTIVATED'
            `,

            [
                deviceToken
            ]

        );



        if(rows.length === 0){


            return res.status(403).json({

                success:false,

                message:"Device is not activated"

            });


        }



        req.device = rows[0];


        next();



    }

    catch(error){


        console.log(error);


        res.status(500).json({

            success:false,

            message:"Server error"

        });


    }


};


module.exports = deviceAuth;