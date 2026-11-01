# Orientações para implementação

Estas regras se aplicam às futuras implementações deste projeto. Antes de cada tarefa, inspecione os arquivos envolvidos e confirme se as configurações descritas aqui ainda correspondem ao repositório.

## Contexto do produto

- Este é um site institucional e comercial de uma empresa que oferece criação de landing pages profissionais.
- O público inclui MEIs, micro, pequenos e médios empresários, profissionais autônomos e prestadores de serviços.
- O objetivo é gerar leads qualificados e pedidos de orçamento, principalmente por WhatsApp e formulários.
- A marca ainda não tem nome definido. Não invente nome, logotipo, depoimentos, números, cases, preços, garantias ou promessas comerciais.
- Use português brasileiro na interface. Use inglês para nomes de variáveis, funções, classes e arquivos, respeitando os padrões existentes.

## Stack e estrutura do repositório

- O projeto usa Angular 21, TypeScript strict, Tailwind CSS 4 e HTML semântico. Confira `package.json`, `angular.json` e os `tsconfig` antes de escolher APIs ou padrões.
- O ponto de entrada Angular é `src/main.ts`; a configuração da aplicação está em `src/app/app.config.ts`, as rotas em `src/app/app.routes.ts` e os estilos globais em `src/styles.css`.
- O Tailwind está integrado pelo plugin `@tailwindcss/postcss`, com `@import 'tailwindcss'` em `src/styles.css`. Para tokens de tema, use a configuração CSS-first compatível com Tailwind 4, preferencialmente `@theme` nesse arquivo. Não crie configuração de outra versão sem necessidade comprovada.
- A aplicação começou com o scaffold padrão do Angular. Não trate o conteúdo inicial como arquitetura ou identidade visual aprovada; confira o estado atual antes de reutilizá-lo.
- Prefira componentes standalone e APIs nativas do Angular. Use Signals para estado local quando apropriado, control flow moderno (`@if`, `@for`), carregamento lazy quando fizer sentido e `ChangeDetectionStrategy.OnPush` em componentes novos, salvo incompatibilidade justificada.
- Organize responsabilidades de forma consistente com o código existente. Adote divisões como `core`, `shared` e `features` somente quando trouxerem valor real. Evite abstrações e dependências adicionais sem justificativa.
- Preserve o TypeScript strict e as verificações rigorosas de templates. Evite `any`, tipifique interfaces públicas e não ignore erros de compilação para contorná-los.

## Identidade visual

Centralize estes tokens no tema CSS do Tailwind, em `src/styles.css`, e reutilize-os nas telas:

| Token | Valor |
| --- | --- |
| Primária | `#10B981` |
| Primária em hover | `#059669` |
| Fundo escuro | `#0B1F1A` |
| Texto | `#0F172A` |
| Branco | `#FFFFFF` |
| Fundo claro | `#F8FAFC` |
| Acento suave | `#D1FAE5` |

- Evite repetir valores hexadecimais nos componentes; use os tokens ou utilitários derivados do tema.
- Mantenha uma apresentação premium, minimalista, moderna e comercial, com tipografia consistente, hierarquia visual, espaçamento generoso, cards discretos e chamadas para ação evidentes.
- Prefira superfícies claras e reserve fundos escuros para uso estratégico. Evite excesso de gradientes, sombras, animações, glassmorphism e decoração sem função.

## Experiência e conversão

- Projete primeiro para celular e confira o comportamento em celulares, tablets e desktops, sem overflow horizontal.
- Na página principal, quando o escopo permitir, deixe clara a proposta de valor na primeira dobra e ofereça um CTA principal visível. Apresente benefícios objetivos, explicação do serviço, processo de contratação, exemplos apenas quando forem reais e autorizados, FAQ e chamada final.
- Use linguagem simples e convincente para pessoas que não dominam tecnologia. Descreva resultados possíveis sem garantir aumento de vendas ou outros resultados comerciais.
- Todo botão e link de ação deve ter um destino ou comportamento funcional. Não simule navegação, envio de formulário ou integração inexistente.
- Não crie prova social fictícia nem apresente conteúdo de demonstração como informação real da empresa.

## Acessibilidade e qualidade visual

- Use elementos HTML semânticos, estrutura de títulos coerente, labels associadas aos campos e texto alternativo útil para imagens informativas.
- Garanta navegação por teclado, foco visível, contraste adequado e respeito a `prefers-reduced-motion`; considere WCAG 2.2 AA como objetivo.
- Verifique o contraste antes de combinar texto branco com verde claro. Não dependa apenas de cor para comunicar estados ou instruções.
- Siga o formatter e as convenções presentes no repositório. Não introduza CSS global desnecessário nem estilos inline quando a estrutura existente oferecer uma alternativa apropriada.

## Performance e SEO

- Priorize Core Web Vitals, imagens otimizadas com dimensões explícitas, carregamento tardio para imagens abaixo da dobra, fontes eficientes e JavaScript mínimo.
- Use títulos e metadados descritivos, um H1 principal por página e hierarquia correta de headings. Considere URLs amigáveis, Open Graph, sitemap e `robots.txt` conforme o escopo.
- Avalie SSR ou prerender apenas diante de uma necessidade real de SEO e de infraestrutura; não habilite esses recursos sem análise.
- Não invente resultados ou métricas de Lighthouse.

## Formulários, privacidade e segurança

- Valide os dados e apresente estados de erro, envio e sucesso que correspondam ao comportamento real.
- Não exponha segredos no frontend, não simule envio real e não integre serviços externos sem autorização explícita.
- Considere a LGPD: colete apenas os dados necessários e explique de forma clara como serão usados para contato.
- Em links externos abertos em nova aba, use os atributos de segurança apropriados, como `rel="noopener noreferrer"`.

## Fluxo de trabalho

1. Inspecione a estrutura, os arquivos relevantes e a arquitetura existente antes de implementar.
2. Para mudanças maiores, apresente um plano curto e indique os arquivos que serão afetados.
3. Implemente somente o escopo solicitado; evite refatorações sem relação com a tarefa.
4. Reutilize componentes e tokens existentes. Não adicione dependências sem justificar o motivo.
5. Execute verificações disponíveis e pertinentes quando solicitado ou apropriado. Os scripts atualmente configurados em `package.json` incluem `npm run build` e `npm test`; não há script de lint configurado. Não afirme que uma verificação passou sem executá-la.
6. Ao concluir, informe os arquivos alterados, decisões relevantes e resultados das verificações executadas.
7. Peça esclarecimento quando faltar uma decisão de negócio necessária. Não preencha lacunas com conteúdo fictício.

## Critérios de aceite

Cada implementação deve ser funcional, responsiva, acessível, tipada, visualmente consistente e alinhada ao objetivo de conversão. Deve também respeitar os dados reais disponíveis, a configuração instalada e o escopo solicitado.
