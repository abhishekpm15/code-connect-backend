const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const validateToken = asyncHandler(async (req, res, next) => {
  let token;
  console.log("req.headers", req.headers);
  let authHeader = req.headers.authorization || req.headers.Authorization;
  console.log("authHeader", authHeader);
  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        console.log(err);
        res.status(401).send({authorized: false, message: "User is not authorized"});
        throw new Error("User is not authorized");
      }
      console.log('decoded',decoded);
      req.user = decoded.user;
      next();
    });
  } else {
    res.status(401).send({message: "Header is missing / not authorized"});
    throw new Error("User is not authorized or token is missing");
  }
});

module.exports = validateToken;
