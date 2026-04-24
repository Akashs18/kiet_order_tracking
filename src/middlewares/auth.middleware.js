exports.isAuthenticated =(req,res,next)=>{
    if (!req.session.user) return res.redirect('/auth/login');
    
    // Prevent caching of protected pages
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate, private');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    
    next();
};