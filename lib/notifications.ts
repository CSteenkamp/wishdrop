import nodemailer from 'nodemailer';

function createTransporter(): nodemailer.Transporter {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER || '',
      pass: process.env.EMAIL_PASS || '',
    },
  });
}

const emailFrom = () => process.env.EMAIL_FROM || 'WishDrop <noreply@localhost>';

function baseTemplate(title: string, body: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #2D2D2D; margin: 0; padding: 0; background: #FDFAF6; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #C9A96E, #B76E79); color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
    .content { background: white; padding: 30px; border: 1px solid #E8E4DF; border-top: none; border-radius: 0 0 12px 12px; }
    .button { display: inline-block; background: #C9A96E; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; }
    .footer { text-align: center; color: #999; font-size: 12px; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${title}</h1>
    </div>
    <div class="content">${body}</div>
    <div class="footer"><p>Sent from WishDrop — The gift registry for every occasion</p></div>
  </div>
</body>
</html>`;
}

export async function sendItemClaimedNotification(
  ownerEmail: string,
  ownerName: string,
  itemTitle: string,
  registryName: string,
): Promise<boolean> {
  if (!ownerEmail) return false;
  try {
    const transporter = createTransporter();
    const html = baseTemplate(
      'Gift Claimed!',
      `<h2>Hi ${ownerName}!</h2>
       <p>Great news — someone just claimed <strong>"${itemTitle}"</strong> from your <strong>${registryName}</strong> registry!</p>
       <p>The surprise is safe — we won't tell you who claimed it.</p>
       <p style="color: #999; font-size: 14px; margin-top: 20px;">One less thing to worry about!</p>`
    );
    await transporter.sendMail({
      from: emailFrom(),
      to: ownerEmail,
      subject: `Someone claimed "${itemTitle}" from ${registryName}!`,
      html,
      text: `Hi ${ownerName}, someone just claimed "${itemTitle}" from your ${registryName} registry! The surprise is safe.`,
    });
    return true;
  } catch (error) {
    console.error('Failed to send claim notification:', error);
    return false;
  }
}

export async function sendNewGuestNotification(
  adminEmail: string | null,
  guestName: string,
  registryName: string,
): Promise<boolean> {
  if (!adminEmail) return false;
  try {
    const transporter = createTransporter();
    const html = baseTemplate(
      'New Guest Joined!',
      `<h2>${guestName} just joined ${registryName}!</h2>
       <p>Your registry is getting attention. <strong>${guestName}</strong> has joined and can now view and claim items.</p>`
    );
    await transporter.sendMail({
      from: emailFrom(),
      to: adminEmail,
      subject: `${guestName} joined your ${registryName} registry`,
      html,
      text: `${guestName} just joined your ${registryName} registry!`,
    });
    return true;
  } catch (error) {
    console.error('Failed to send guest notification:', error);
    return false;
  }
}

export async function sendContributionNotification(
  adminEmail: string | null,
  contributorName: string,
  fundTitle: string,
  amount: number,
  currency: string,
  registryName: string,
): Promise<boolean> {
  if (!adminEmail) return false;
  try {
    const transporter = createTransporter();
    const html = baseTemplate(
      'New Contribution!',
      `<h2>Contribution to ${fundTitle}</h2>
       <p><strong>${contributorName}</strong> contributed <strong>${currency} ${amount}</strong> to your <strong>${fundTitle}</strong> fund in <strong>${registryName}</strong>!</p>`
    );
    await transporter.sendMail({
      from: emailFrom(),
      to: adminEmail,
      subject: `${contributorName} contributed to ${fundTitle}!`,
      html,
      text: `${contributorName} contributed ${currency} ${amount} to ${fundTitle} in ${registryName}!`,
    });
    return true;
  } catch (error) {
    console.error('Failed to send contribution notification:', error);
    return false;
  }
}
