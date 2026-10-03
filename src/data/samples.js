// Example messages for the "Check a Message" page, so people can try the
// analyzer without having a suspicious message handy.

export const SAMPLES = [
  {
    label: 'Fake account warning',
    text: `From: PayPal Security <service@paypa1-secure.com>
Subject: Your account has been suspended

Dear Customer,

We detected unusual activity on your account. Your account has been suspended until you verify your identity. You must complete verification within 24 hours or your account will be closed permanently.

Click here to restore access: http://paypa1-secure.com/login

You will need to enter your email, password, and card number to confirm.

PayPal Security Team`,
  },
  {
    label: 'Delivery text',
    text: `USPS: Your package is on hold due to an unpaid shipping fee of $1.99. Pay within 12 hours to avoid return: usps-redelivery-help.top/pay`,
  },
  {
    label: 'Normal club email',
    text: `From: Robotics Club <robotics@lincolnhs.org>
Subject: Meeting moved to Thursday

Hi everyone,

This week's meeting is moving to Thursday at 3:30 in Room 214 because of the assembly. We'll keep working on the drivetrain, so bring your notebooks.

See you there,
Mr. Patel`,
  },
]
