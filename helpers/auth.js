//this will be encripting the password
//to function is created one to hash the password
//the second function is to compare the password, we hash the


//import bcrypt, { hash } from "bcrypt";
import bcrypt from "bcrypt";
export const hashpassword = (password) => {
  //here we expect to het the hashed password or err
  //i am going to create a salt first, the use the salt to hash the password
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(12, (err, salt) => {
      if (err) {
        reject(err);
      }
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
          reject(err);
        }
        resolve(hash);
      });
    });
  });
};
//the above function will be used when the user logs in for the first time his password will be encrypted to a hash

//here we are goint to use the password given by the user and compare it to the hashed passed stored in our database
export const comparePassword = (password, hashed) => {
  //this will return either false or true
  return bcrypt.compare(password, hashed);
};
