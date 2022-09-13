# Changelog
Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

### Sobre os "BREAKING CHANGES"
Podemos ter pequenas breaking changes sem alterar o `major` version, apesar de serem pequenas, podem alterar o comportamento da funcionalidade caso não seja feita uma atualização, **preste muita atenção** nas breaking changes dentro das versões quando existirem.

## [2.0.0-beta.4] - 13-09-2022

### Removido
- Removido a prop `use-empty-result` que estava com o valor `false`, seguindo nosso padrão.

### Corrigido
- Corrigido o alias que estava de forma incorreta no `route.js.ejs`.

## [2.0.0-beta.3] - 08-09-2022

### Corrigido
- Corrigido ícone de "o_create" no botão de editar, alterado para "o_edit".
- Corrigido entidade hardcoded no `single.vue.ejs`. 
- Corrigido valor inicial do model results no `list.vue.ejs`.
- Corrigido validação para criação das rotas.

## [2.0.0-beta.2] - 07-09-2022

### Corrigido
- Entidades com o valor em camelCase nas páginas de list, single e form.
- Corrigido o nome da função no vuex, de `getStoreModule` para `createStoreModule`.

## [2.0.0-beta.1] - 07-09-2022
### Adicionado
- É gerado as páginas com a versão 3 de asteroid, utilizando os componentes `QasListView`, `QasFormView`, `QasSingleView`.
- Adicionado o gerador das rotas da entidade com base na escolha do usuário.
- Adicionado o gerador de arquivo da store da entidade, com a possibilidade de usar `pinia` e `vuex`.
