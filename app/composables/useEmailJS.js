import emailjs from '@emailjs/browser'

export const useEmailJS = () => {
  const config = useRuntimeConfig()

  if (import.meta.client) {
    emailjs.init(config.public.emailjs.publicKey)
  }

  const sendEmail = async (templateParams) => {
    try {
      const response = await emailjs.send(
        config.public.emailjs.serviceId,
        config.public.emailjs.templateId,
        {
          from_name: templateParams.from_name,
          from_email: templateParams.from_email,
          message: templateParams.message,
          to_email: config.public.emailjs.toEmail
        }
      )
      return { success: true, response }
    } catch (error) {
      console.error('Error sending email:', error)
      return { success: false, error }
    }
  }

  const sendQuoteEmail = async (templateParams) => {
    try {
      const templateId = config.public.emailjs.templateQuoteId || config.public.emailjs.templateId
      
      const response = await emailjs.send(
        config.public.emailjs.serviceId,
        templateId,
        {
          from_name: templateParams.from_name,
          from_email: templateParams.from_email,
          message: templateParams.message,
          to_email: config.public.emailjs.toEmail,
          project_type: templateParams.project_type,
          budget: templateParams.budget,
          deadline: templateParams.deadline
        }
      )
      return { success: true, response }
    } catch (error) {
      console.error('Error sending quote email:', error)
      return { success: false, error }
    }
  }

  return {
    sendEmail,
    sendQuoteEmail
  }
}

