const express=require('express');
const router=express.Router();

router.get('/',(req,res)=>{
    if (req.session.userId==undefined)
        res.redirect('/');
    else
        res.render('userpage');
});

module.exports=router;