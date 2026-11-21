# Plano de internacionalização (pt-BR / en)

## Escopo e estado real em 21/11/2026

O repositório `revcleverson-maker/palavra-mesa-missao` mantém parte do acervo editorial, mas **não deve ser tomado como inventário completo do que está publicado no domínio oficial**. Pastas com documentos históricos, páginas provisórias e arquivos de leitura integral convivem neste repositório.

Esta mudança introduz a navegação entre português e inglês e traduz **integralmente as páginas de apresentação** da coleção, do Volume 1 e do Volume 8. **Não traduz os cadernos completos, sermões ou devocionais.** As páginas em inglês identificam explicitamente os links que conduzem à versão portuguesa.

## Inventário preliminar do repositório

- Volume 1: apresentação e Cadernos 1 e 2 em HTML; conteúdo integral em português.
- Volume 2: edição extensa em HTML; português.
- Volume 3: material HTML/PDF e apresentação provisória; português.
- Volumes 4, 5 e 6: material histórico e páginas incompletas ou de apoio.
- Volume 8: apresentação e Cadernos 1, 2 e 3 em HTML; português.
- Volume 12: Caderno 3 em HTML; português.
- Volume 14: apresentação e Cadernos 1, 2 e 3 em HTML; português (Caderno 3 reúne partes carregadas dinamicamente).
- Acervo de sermões e devocionais avulsos: português.
- Volumes recentes mencionados no projeto editorial, como 17, 18 e 19: devem ser localizados e comparados com o conteúdo publicado no domínio oficial. Não constam como pastas na versão `main` examinada.

## Padrão editorial obrigatório

1. Preservar o português como texto de referência; nunca substituir nem apagar as versões originais.
2. Criar a tradução inglesa em arquivo próprio, com URL e metadados `lang="en"`, `hreflang` e links recíprocos.
3. Traduzir **todo** o conteúdo relevante (capítulos, reflexões, sumários, orações, legendas, descrições de imagens e alternativas para acessibilidade), não apenas os menus.
4. Conferir expressões teológicas e terminologia reformada; diferenciar tradução pastoral de transcrição literal. Conferir a versão bíblica/copyright utilizada para as citações em inglês.
5. Em devocionais, revisar a formatação e as artes 9:16 antes de permitir compartilhamento de imagens; imagens com texto em português exigem arte própria em inglês.
6. Textos de terceiros requerem autorização para reprodução e, se pertinente, tradução. Manter atribuição e eventuais condições indicadas pelos autores.
7. Só expor o selo `English edition available` depois da revisão integral; até lá sinalizar `Portuguese original`.
8. Validar leitura em Android/celular, links, compartilhamento, retorno ao topo e continuidade dos capítulos.

## Próximos passos de publicação

- Identificar a origem do deploy do domínio oficial e inventariar **cada volume/caderno realmente publicado**.
- Priorizar os volumes atuais para ter os três cadernos em inglês antes de ampliar o acervo histórico.
- Traduzir e revisar o conteúdo textual por unidade e publicar cada URL inglesa ao concluir a validação.
- Fazer revisão geral de navegação, acessibilidade, SEO e atribuição antes de liberar para o público.

## Tradutor de páginas — primeira versão (21/11/2026)

Foi criado `assets/tradutor.js`, com um botão flutuante **🌐 Traduzir / Translate** de boa legibilidade no celular, compatível com teclado e com opção para português, inglês, espanhol, francês, alemão, italiano, árabe e japonês.

- Uma página que tenha correspondente editorial em inglês (`link[rel=alternate][hreflang=en]`) abre **a versão publicada/revisada do próprio acervo**. O português original é sempre preservado.
- Na ausência da versão editorial, o botão encaminha a página atual ao recurso de **tradução de sites do Google Tradutor**. A página pode ser aberta em um domínio administrado por terceiro; a navegação, o layout e a disponibilidade dependem do serviço externo e **não foram validados no domínio oficial**.
- A escolha fica armazenada no navegador para aparecer selecionada quando a ferramenta for aberta novamente, sem obrigar um redirecionamento automático ao acessar páginas.
- O componente apresenta aviso de limites teológicos e indicação da tradução integrada do Chrome/Android.
- Não se utiliza o antigo script `translate_a/element.js`, que não é solução mantida/confiável para novas integrações em 2026.
- Tradução automática **não** significa que imagens com texto, PDFs ou citações bíblicas protegidas possam ser republicados em inglês sem revisão.

### Cobertura no repositório

- **38 páginas HTML** têm a inclusão do componente, incluindo as três páginas inglesas novas, sumários e páginas de sermões/devocionais, leitura por capítulos e a página de carregamento do Caderno 3 do Volume 14.
- A página `volume-14/caderno-3/index.html` recebe uma injeção adicional do carregador do tradutor, pois o seu HTML final é montado a partir de arquivos `partes/*.txt` e substitui o documento original no navegador.
- **6 páginas HTML de grande porte** não foram atualizadas porque o conector do GitHub não retorna seu conteúdo textual completo para uma edição segura:
  - `Index V4.html`
  - `volume2.html`
  - `volume-2/index.html`
  - `volume-12/caderno-3/index.html`
  - `volume-14/caderno-1/index.html`
  - `volume-14/caderno-2/index.html`
- `volume-4/Index V4 duplicate.html` não tem uma estrutura HTML completa com `</head>`, portanto não recebeu injeção. Requer inspeção ou substituição por arquivo de leitura definitivo.

### Validação necessária antes de publicar

1. Confirmar qual projeto e qual ramo realmente abastecem `palavramesaemissao.com.br`.
2. Testar clique do tradutor nos navegadores Chrome/Android e Safari/iPhone com link real publicado — **o link externo pode apresentar limitações regionais ou quebrar páginas com scripts dinâmicos**.
3. Confirmar se o Google Tradutor preserva navegação, fragmentos (`#`), imagens e botões de compartilhamento dos cadernos.
4. Integrar as páginas grandes com uma solução no processo de build/deploy (injeção central no HTML ou middleware) ou editar seus arquivos completos por um ambiente Git local.
5. Revisar a solução de tradução embutida ou API profissional caso se exija alternância dentro do próprio domínio, sem abrir o serviço externo.
6. Não considerar esta fase pronta para publicação integral antes de localizar no projeto ativo os volumes recentes.
