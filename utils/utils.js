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

function sendEMail(id, email, codeCheck) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'btprojectbootcam1@gmail.com',
            pass: 'uznpynhqoowffvvf'
        },
        port: 465,
        host: 'smtp.gmail.com'
    }).sendMail(
        {
            from: 'btprojectbootcam1@gmail.com',
            to: email,
            subject: 'Hello ✔',
            text: 'Email registered successfully',
            html: `<a href=${process.env.baseURL}/user/CheckMail/${email}/${codeCheck}>click here to complete register</a>`,
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

function sendCodeMail(id, email, codeCheck) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'btprojectbootcam1@gmail.com',
            pass: 'uznpynhqoowffvvf'
        },
        port: 465,
        host: 'smtp.gmail.com'
    }).sendMail(
        {
            from: 'btprojectbootcam1@gmail.com',
            to: email,
            subject: 'Code Check Mail',
            text: 'Code Check to change password',
            html: `<p>${codeCheck}</p>`,
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

module.exports = { sendEMail, CodeCheck, generateCode, sendCodeMail }