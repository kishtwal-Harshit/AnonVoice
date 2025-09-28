interface VerificationEmailProps {
  username: string;
  otp: string;
}

export const verificationEmail = ({ username, otp }: VerificationEmailProps): string => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verification Code</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                color: #333333;
                background-color: #f4f4f4;
                margin: 0;
                padding: 20px;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                padding: 30px;
                border-radius: 8px;
                box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            }
            .header {
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 20px;
                color: #000000;
            }
            .otp-code {
                font-size: 36px;
                font-weight: bold;
                color: #000000;
                margin: 20px 0;
                text-align: center;
                letter-spacing: 4px;
            }
            .footer {
                font-size: 14px;
                color: #888888;
                margin-top: 30px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">Hello ${username},</div>
            <p>Thanks for registering. Please use the following verification code to complete your registration:</p>
            <div class="otp-code">${otp}</div>
            <p class="footer">If you didn't request this code, please ignore this email.</p>
        </div>
    </body>
    </html>
  `;
};