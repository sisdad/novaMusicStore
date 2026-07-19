const express = require("express");
const router = express.Router();

const { v4: uuidv4 } = require("uuid");

const db = require("../config/db");
const verifyToken = require("../middleware/auth");

router.post(
    "/generate",
    verifyToken,
    async (req, res) => {

        try {

            let { count } = req.body;

            count = Number(count);

            if (!count || count < 1) {

                return res.status(400).json({

                    success: false,
                    message: "Invalid quantity."

                });

            }

            const generated = [];

            for (let i = 0; i < count; i++) {

                const barcode =
                    "MC-" +
                    uuidv4()
                        .replace(/-/g, "")
                        .substring(0, 10)
                        .toUpperCase();

                await db.query(

                    `
                    INSERT INTO barcodes
                    (
                        barcode,
                        status
                    )
                    VALUES
                    (
                        ?,
                        'AVAILABLE'
                    )
                    `,

                    [barcode]

                );

                generated.push({

                    barcode

                });

            }

            res.json({

                success: true,

                message: `${count} QR Codes generated successfully.`,

                barcodes: generated

            });

        }

        catch (err) {

            console.log(err);

            res.status(500).json({

                success: false,

                message: "Server Error"

            });

        }

    }
);

router.post(
    "/activate",
    async (req, res) => {
  console.log("reached");
        try {

            const {
                barcode,
                deviceToken
            } = req.body;

            if (!barcode || !deviceToken) {

                return res.status(400).json({

                    success: false,

                    message: "Barcode and device token required."

                });

            }

            const [rows] = await db.query(

                `
                SELECT *
                FROM barcodes
                WHERE barcode=?
                `,

                [barcode]

            );

            if (rows.length === 0) {

                return res.status(404).json({

                    success: false,

                    message: "Invalid QR Code."

                });

            }

            const qr = rows[0];

            if (qr.status === "AVAILABLE") {

                await db.query(

                    `
                    UPDATE barcodes

                    SET
                    device_token=?,
                    activated_at=NOW(),
                    status='ACTIVATED'

                    WHERE id=?
                    `,

                    [
                        deviceToken,
                        qr.id
                    ]

                );

                return res.json({

                    success: true,

                    message: "Device activated successfully."

                });

            }

            if (qr.status === "ACTIVATED") {

                if (qr.device_token === deviceToken) {

                    return res.json({

                        success: true,

                        message: "Welcome back."

                    });

                }

                return res.status(403).json({

                    success: false,

                    message:
                        "This QR code is already activated on another device."

                });

            }

            return res.status(400).json({

                success: false,

                message: "Invalid QR Code status."

            });

        }

        catch (err) {

            console.log(err);

            res.status(500).json({

                success: false,

                message: "Server Error"

            });

        }

    }
);


router.get("/stats", async(req,res)=>{

try{


const [rows] = await db.query(`

SELECT

COUNT(*) total,

SUM(status='AVAILABLE') available,

SUM(status='ACTIVATED') activated

FROM barcodes

`);


res.json(rows[0]);


}catch(err){

console.log(err);

res.status(500).json({

message:"Failed loading stats"

});

}

});


router.delete(
"/clear-available",
async(req,res)=>{

    try{


        const [result] =
        await db.query(
            `
            DELETE FROM barcodes
            WHERE status='AVAILABLE'
            `
        );


        res.json({

            message:
            `${result.affectedRows} available barcodes deleted`

        });


    }
    catch(err){

        console.log(err);

        res.status(500).json({

            message:"Failed to clear available barcodes"

        });

    }

});

router.delete("/clear", async(req,res)=>{

    try{

        await db.query(
            "TRUNCATE TABLE barcodes"
        );


        res.json({
            message:"All barcodes cleared successfully"
        });


    }catch(error){

        console.log(error);

        res.status(500).json({
            message:"Failed to clear barcodes"
        });

    }

});



module.exports = router;