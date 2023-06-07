export default function(req,res,next) {
    if(!req.cookies.token){
        res.redirect('/register')
        return
    }

    next()
}