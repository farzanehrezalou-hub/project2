export const protect = async(req, res, next)=> {
    try{
        const {userId} = await req.auth()
        
        if(!userId){
            return res.status(401).json({message:"Unauthorized"})
        }

        return next()

    }catch (erroe){
        console.log(erroe);
        res.status(401).json({message: erroe.code || error.message});
    }
}