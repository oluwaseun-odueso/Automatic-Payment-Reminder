const otpGenerator = require('otp-generator')
require('dotenv').config()

generateOTP = async () => {
    try {
        const OTP = await otpGenerator.generate(process.env.OTP_LENGTH);
        return OTP
    } catch (error) {
        throw error
    }
}

// generateOTP().then(i => console.log(i))
module.exports = generateOTP
