// send email using Brevo HTTP API
// (Render free plan blocks SMTP ports, so nodemailer with Gmail SMTP does not work there)
const sendEmail = async({ to, subject, html }) => {
    const response = await fetch("https://api.brevo.com/v3/smtp/email",{
        method : "post",
        headers : {
            "api-key" : process.env.BREVO_API_KEY,
            "content-type" : "application/json"
        },
        body : JSON.stringify({
            sender : { name : "ElectroPlaza", email : process.env.EMAIL_FROM },
            to : [ { email : to } ],
            subject : subject,
            htmlContent : html
        })
    })

    if(!response.ok){
        throw new Error("Email could not be sent, please try again later")
    }
}

module.exports = sendEmail
