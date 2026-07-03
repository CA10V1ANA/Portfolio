import { useState, type FormEvent } from 'react';
import emailjs from '@emailjs/browser';
import { toast } from 'sonner';
import { EMAILJS_CONFIG } from '@/lib/constants';
import type { ContactFormData } from '@/types';

const INITIAL_STATE: ContactFormData = { name: '', email: '', message: '' };

type FormErrors = Partial<Record<keyof ContactFormData, string>>;

function validate(data: ContactFormData): FormErrors {
  const errors: FormErrors = {};

  if (!data.name.trim() || data.name.trim().length < 2) {
    errors.name = 'Informe seu nome completo.';
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Informe um e-mail válido.';
  }

  if (!data.message.trim() || data.message.trim().length < 10) {
    errors.message = 'A mensagem deve ter pelo menos 10 caracteres.';
  }

  return errors;
}

export function useContactForm() {
  const [formData, setFormData] = useState<ContactFormData>(INITIAL_STATE);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(field: keyof ContactFormData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validate(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    if (!EMAILJS_CONFIG.serviceId || !EMAILJS_CONFIG.templateId || !EMAILJS_CONFIG.publicKey) {
      toast.error('Formulário de contato não configurado.', {
        description: 'Configure as variáveis do EmailJS no arquivo .env para habilitar o envio.',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
        },
        { publicKey: EMAILJS_CONFIG.publicKey },
      );

      toast.success('Mensagem enviada com sucesso!', {
        description: 'Obrigado pelo contato, responderei o mais breve possível.',
      });
      setFormData(INITIAL_STATE);
    } catch {
      toast.error('Não foi possível enviar sua mensagem.', {
        description: 'Tente novamente em instantes ou entre em contato por e-mail.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return { formData, errors, isSubmitting, handleChange, handleSubmit };
}
