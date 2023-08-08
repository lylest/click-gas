const yup = require("yup")

const signUpValidator = yup.object({
  username: yup.string().required().trim(),
  email: yup.string().required().email(),
  phoneNumber: yup.string().required(),
  idType:yup.string().required(),
  idNumber:yup.string().required().min(4),
  password: yup.string().required().min(8),
})

const loginValidator = yup.object({
  email: yup.string().required().email(),
  password: yup.string().required().min(8),
})

module.exports = {
  loginValidator,
  signUpValidator,
}
