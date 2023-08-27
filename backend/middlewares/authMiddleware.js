const JWT = require('jsonwebtoken')
const JWT_SECRET = "xkjnjs";

module.exports = async (req,res,next)=>{
    try {
        const token = req.headers["authorization"].split(" ")[1];
        JWT.verify(token,JWT_SECRET,(err, decode) =>{
            if(err){
                return res.send({message: 'Auth Failed',success: false})
            }
            else{
                req.body.userId = decode.id;
                next();
            }
        })
    } catch (error) {
        console.log(error);
        res.send({message: 'Auth Failed',success:false})
    }
}

// this is done to verify if some user is there or not