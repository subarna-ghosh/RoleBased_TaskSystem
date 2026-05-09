const allowRoles = (...roles) => {
  const checkRoles = (req, res, next) => {
    console.log(req.user)
    if (!roles.includes(req.user.role)) {
      return res.status(400).json({
        success: false,
        message: "Access denied!",
      });
    }
    next();
  };
  return checkRoles;
};

module.exports = allowRoles;
