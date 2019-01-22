const express = require('express');
const path = require('path');
const SongModel = require('../song/songModel')
const AdminRouter = express.Router();

const session = require("express-session");
const bcrypt = require("bcrypt");

AdminRouter.use(session({
    secret: "fuckyoubitch",
    resave: false,
    saveUninitialized: false,
    cookie:{
        secure: false,
        httpOnly: false,
        maxAge: 1000*60*60*24*7
    }
}))
//middle ware
AdminRouter.use((req, res, next) => {
    console.log(req.sessionID);
    next();
});

const AdminModel = require("./adminModel");

AdminRouter.get("/loginsuccess", (req, res, next) => {
	res.send("Login success!");
});

AdminRouter.post("/login", (req,res) => {
    const { username, password } = req.body;
    if(username && password) {
        AdminModel.findOne({username}, function(err,userFound){
            if (err) res.status(500).json({success:0, message: err})
            else if(!userFound || !userFound._id) res.status(404).json({ success: 0, message: "Not found!"})
            else {
                if(bcrypt.compareSync(password, userFound.password)){
                    const { username, email, _id} = userFound;
                    req.session.userInfo = {username, email, userId: _id};
                    res.json({success: 1, message: "login accepted"});
                } else res.status(401).json({success:0, message:"Wrong password"});
            }
        })
    }
})

AdminRouter.delete("/logout",(req,res) => {
    req.session.destroy();
    res.json({success:1, message:"logout success!"});
})

AdminRouter.use((req, res, next) => {
	console.log(req.session.userInfo);
	console.log(req.sessionID);
	if(req.session.userInfo && req.session.userInfo.role == "admin") {
		next();
	} else res.status(401).json({ success: 0, message: "Unauthorized" });
});

AdminRouter.get("/",(req,res) => {
    SongModel.find({},(err,SongFound) => {
        res.send({SongFound});
    })
});

AdminRouter.post("/post",(req,res) => {
    const newPost = req.body;
    SongModel.create(newPost, (err, postCreated) => {
        if (err) res.status(500).json({
            success: 0,
            message: err
        })
        else res.status(201).json({
            success: 1,
            message: postCreated
        });
    });
})

AdminRouter.delete("/:id",(req,res) => {
    const id = req.params.id;
    SongModel.findByIdAndDelete(id,(err,res) => {
        if(err) console.log(err)
        else res.send({message: "deleted"}); 
    });
});

module.exports = AdminRouter;
