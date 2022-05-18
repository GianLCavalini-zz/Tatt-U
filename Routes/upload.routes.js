const router = require("express").Router();

const uploadImg = require("../Config/cloudinary.config");

router.post("/img/upload-image", uploadImg.single("picture"), (req, res) =>{
    if (!req.file){
        return res.status(500).json({ msg: "Upload fail." });
    }

    return res.status(201).json({url: req.file.path})
});

module.exports = router