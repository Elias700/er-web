import { buildWhatsAppMessage, type ContactFormValue } from './contact.service';

const GREETING = 'Olá, Elias! Vim pelo site da ER WEB e gostaria de um orçamento.';

const base: ContactFormValue = {
  name: 'Maria Souza',
  email: 'maria@exemplo.com',
  phone: '(71) 99999-0000',
  projectType: 'Landing page',
  message: 'Quero uma página para minha clínica.',
};

describe('buildWhatsAppMessage', () => {
  it('monta a mensagem no modelo completo', () => {
    expect(buildWhatsAppMessage(base, GREETING)).toBe(
      [
        GREETING,
        '',
        '*Nome:* Maria Souza',
        '*E-mail:* maria@exemplo.com',
        '*WhatsApp:* (71) 99999-0000',
        '*Tipo de projeto:* Landing page',
        '*Mensagem:* Quero uma página para minha clínica.',
        '',
        'Aguardo seu retorno!',
      ].join('\n'),
    );
  });

  it('omite a linha de campos opcionais vazios', () => {
    const text = buildWhatsAppMessage({ ...base, phone: '   ' }, GREETING);
    expect(text).not.toContain('*WhatsApp:*');
    expect(text).toContain('*E-mail:* maria@exemplo.com\n*Tipo de projeto:*');
  });

  it('remove espaços extras no início e no fim de cada campo', () => {
    const text = buildWhatsAppMessage({ ...base, name: '  Maria Souza  ' }, GREETING);
    expect(text).toContain('*Nome:* Maria Souza\n');
  });

  it('preserva acentos, quebras de linha e emojis', () => {
    const message = 'Olá! Preciso de:\n- cardápio\n- reservas 🍰';
    const text = buildWhatsAppMessage({ ...base, message, projectType: 'Não sei' }, GREETING);
    expect(text).toContain('*Tipo de projeto:* Não sei');
    expect(text).toContain(`*Mensagem:* ${message}`);
    expect(decodeURIComponent(encodeURIComponent(text))).toBe(text);
  });
});
