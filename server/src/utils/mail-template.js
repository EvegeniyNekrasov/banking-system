const HTML_TEMPLATE = (otp, purpose = "GENERAL") => {
    const purposeMessages = {
        REGISTRATION: "Complete your registration",
        LOGIN: "Verify your login",
        TRANSFER: "Confirm your transfer",
        PASSWORD_RESET: "Reset your password",
        GENERAL: "Verification Required",
    };

    const title = purposeMessages[purpose] || "Verification Required";

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Banking System - OTP Verification</title>
            <style>
                body { 
                    margin: 0; 
                    padding: 0; 
                    font-family: Arial, sans-serif; 
                    background-color: #f5f5f5; 
                }
                .container { 
                    max-width: 600px; 
                    margin: auto; 
                    background-color: #ffffff; 
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); 
                }
                .header { 
                    background: linear-gradient(135deg, #2c3e50, #34495e); 
                    color: #fff; 
                    padding: 30px 20px; 
                    text-align: center; 
                }
                .header h1 { 
                    margin: 0; 
                    font-size: 28px; 
                    font-weight: bold; 
                }
                .header h2 { 
                    margin: 10px 0 0 0; 
                    font-size: 18px; 
                    font-weight: normal; 
                    opacity: 0.9; 
                }
                .body { 
                    padding: 40px 30px; 
                    background: #f8f9fa; 
                }
                .otp-code { 
                    font-size: 36px; 
                    font-weight: bold; 
                    color: #2c3e50; 
                    background: #ecf0f1; 
                    padding: 20px; 
                    border-radius: 12px; 
                    text-align: center; 
                    letter-spacing: 8px; 
                    margin: 25px 0; 
                    border: 2px solid #bdc3c7; 
                }
                .warning { 
                    color: #e74c3c; 
                    font-weight: bold; 
                    text-align: center; 
                    margin: 20px 0; 
                    padding: 15px; 
                    background: #fdf2f2; 
                    border-radius: 8px; 
                    border-left: 4px solid #e74c3c; 
                }
                .footer { 
                    background: #34495e; 
                    color: #ffffff; 
                    padding: 20px; 
                    text-align: center; 
                    font-size: 12px; 
                    opacity: 0.8; 
                }
                .footer p { 
                    margin: 5px 0; 
                }
                @media only screen and (max-width: 600px) {
                    .container { 
                        margin: 0; 
                        width: 100%; 
                    }
                    .body { 
                        padding: 20px 15px; 
                    }
                    .otp-code { 
                        font-size: 28px; 
                        letter-spacing: 4px; 
                    }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🏦 Banking System</h1>
                    <h2>${title}</h2>
                </div>
                <div class="body">
                    <p>Hello,</p>
                    <p>We received a request for verification. Please use the following One-Time Password (OTP) to proceed:</p>
                    
                    <div class="otp-code">${otp}</div>
                    
                    <p><strong>This code expires in 5 minutes.</strong></p>
                    <p>If you didn't request this verification, please ignore this email or contact our support team.</p>
                    
                    <div class="warning">
                        ⚠️ Never share this code with anyone. Our team will never ask for your OTP.
                    </div>
                </div>
                <div class="footer">
                    <p>© 2025 Banking System. All rights reserved.</p>
                    <p>This is an automated message, please do not reply to this email.</p>
                </div>
            </div>
        </body>
        </html>
    `;
};

export default HTML_TEMPLATE;
