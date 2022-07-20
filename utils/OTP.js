const otpGenerator = require('otp-generator')
require('dotenv').config()

generateOTP = async () => {
    const OTP = await otpGenerator.generate(process.env.OTP_LENGTH);
    return OTP
}

generateOTP().then(i => console.log(i))
module.exports = generateOTP
