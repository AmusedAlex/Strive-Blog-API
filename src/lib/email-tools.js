import sgMail from "@sendgrid/mail";

export const sendConfirmationMail = async (recipientemail) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: recipientemail, // Change to your recipient
    from: process.env.OWN_EMAIL, // Change to your verified sender
    subject: "You sucessfully added a blogPost",
    text: "yeah it's true, you sucessfully added a BlogPost",
    html: "<strong>yeah it's true, you sucessfully added a BlogPost</strong>",
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
};
