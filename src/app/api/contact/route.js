import nodemailer from 'nodemailer';

export async function POST(req, res) {
    try {
        const { name, email, message } = await req.json();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
        });

        const mailOptions = {
            from: email,
            to: 'eatsinreach@gmail.com',
            subject: `Message from ${name}`, 
            text: message
        };

        await transporter.sendMail(mailOptions);
        return new Response(JSON.stringify({ sucess: true }), {status:200});
    } catch(error) {
        console.error('Error sending email', error);
        return new Response(JSON.stringify({error: 'Error sending email' }), {status:500});
    }
}   