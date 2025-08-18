// const validator = require('validator');
// const validateSignup = (req) => {
//     const {firstName, lastName, emailId, password, age} = req.body;
//     if(!firstName || !lastName){
//         throw new Error("First name and last name are required");
//     }
//     else if(!validator.isEmail(emailId)){
//         throw new Error("Email is not valid");
//     }
//     else if(!validator.isStrongPassword(password)){
//         throw new Error("Password must be at least 6 characters long and contain a number");
//     }
// }

// module.exports = {
//     validateSignup
// }



const validator = require("validator");

const validateSignup = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("First name and last name are required");
  }

  if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid");
  }

  if (!validator.isStrongPassword(password, { minLength: 6, minNumbers: 1 })) {
    throw new Error(
      "Password must be at least 6 characters long and contain a number"
    );
  }
};

const validateEditProfileData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "emailId",
    "photoUrl",
    "gender",
    "age",
    "about",
    "skills",
  ];

  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );

  return isEditAllowed;
};

module.exports = { validateSignup, validateEditProfileData };
