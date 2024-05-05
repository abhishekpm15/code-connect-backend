const jwt = require("jsonwebtoken");

const generateToken = ({ username, email, id }) => {
  console.log('generate token',username,email,id)
  return jwt.sign(
    {
      user: {
        username,
        email,
        id,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "30d" }
  );
};

module.exports = generateToken