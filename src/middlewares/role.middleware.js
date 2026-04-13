exports.isAdmin =(req,res,next)=>{
if(req.session.user.role !== 'ADMIN');{
return res.send('Access denied');
}
next();
};