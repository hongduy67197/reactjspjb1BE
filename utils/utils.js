const nodemailer = require('nodemailer')

class CodeCheck {
    constructor(code) {
        this.code = code;
    }
    getCode() {
        return this.code;
    }
    setCode(code) {
        this.code = code
    }
}

function generateCode() {
    return Math.random().toString().substring(2, 8);
}

async function sendEMail(id, email, codeCheck) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'btprojectbootcam1@gmail.com',
            pass: 'Anxiety16092020'
        }
    })

    let info = await transporter.sendMail(
        {
            from: 'btprojectbootcam1@gmail.com',
            to: email,
            subject: 'Hello ✔',
            text: 'Email registered successfully',
            html: `<a href=http://localhost:3150/user/${email}/${codeCheck}>click here to complete register</a>`,
        },
        function (err, res) {
            if (err) {
                console.log(err);
            } else {
                console.log('Message sent successfully');
            }
        }
    );
}

module.exports = { sendEMail, CodeCheck, generateCode }