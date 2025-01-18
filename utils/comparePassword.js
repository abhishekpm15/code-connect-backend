const bcrypt = require("bcryptjs");

const comparePassword = async (password, pass) => {
    console.log(password, pass)
  return await bcrypt.compare(password, pass);
};

module.exports = comparePassword;
