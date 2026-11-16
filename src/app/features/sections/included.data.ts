/**
 * Seção "O que está incluso".
 * Revise cada item: mantenha só o que você realmente entrega em todos os projetos.
 */
export interface IncludedItem {
  readonly title: string;
  readonly description: string;
}

export const INCLUDED = {
  kicker: 'O que está incluso',
  title: 'Tudo o que sua página precisa para funcionar',
  subtitle: 'Itens que fazem parte da entrega. Detalhes extras são combinados no orçamento.',
  items: [
    // TODO: confirmar
    { title: 'Layout responsivo', description: 'Funciona bem no celular, no tablet e no computador.' },
    // TODO: confirmar
    { title: 'Botão de WhatsApp', description: 'Contato direto com um clique, com mensagem pronta.' },
    // TODO: confirmar
    { title: 'Formulário de contato', description: 'Para quem prefere deixar uma mensagem.' },
    // TODO: confirmar
    { title: 'SEO básico', description: 'Títulos, descrições e estrutura para os buscadores entenderem a página.' },
    // TODO: confirmar
    { title: 'Otimização de velocidade', description: 'Imagens leves e código enxuto para carregar rápido.' },
    // TODO: confirmar
    { title: 'Integração com Instagram e redes', description: 'Links para seus perfis e para a página ser compartilhada.' },
    // TODO: confirmar
    { title: 'Suporte após a entrega', description: 'Acompanhamento para tirar dúvidas depois da publicação.' },
    // Itens que dependem do pacote. Descomente se forem incluídos:
    // { title: 'Domínio', description: 'Registro do endereço do site (ex.: seunegocio.com.br).' },
    // { title: 'Hospedagem', description: 'Servidor onde o site fica publicado.' },
  ] satisfies readonly IncludedItem[],
} as const;
