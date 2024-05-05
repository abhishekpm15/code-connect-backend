const bcrypt = require("bcrypt");

const comparePassword = async (password, pass) => {
    console.log(password, pass)
  return await bcrypt.compare(password, pass);
};

module.exports = comparePassword;
