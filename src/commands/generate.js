const { strings } = require('gluegun')

module.exports = {
  name: 'generate',
  alias: ['g'],
  run: async toolbox => {
    const {
      parameters,
      template: { generate },
      print,
      prompt,
      filesystem
    } = toolbox

    const name = parameters.first
    const formattedName = strings.pascalCase(name)
    const singleName = `${formattedName}Single`
    const listName = `${formattedName}List`
    const createName = `${formattedName}Create`
    const editName = `${formattedName}Edit`
    const currentPath = filesystem.cwd()
    const formName = `${formattedName}Form`
    const crudPaths = {
      list: `${currentPath}/src/pages/${name}/${formattedName}List.vue`,
      form: `${currentPath}/src/pages/${name}/${formName}.vue`,
      single: `${currentPath}/src/pages/${name}/${formattedName}Single.vue`,
    }
    const generateAll = await prompt.confirm('Deseja gerar o CRUD completo?', true)

    let result
    if (generateAll) {
      result = { 
        list: true,
        form: 'Todos',
        single: true
      }
    } else {
      result = await prompt.ask([
        {
          type: 'confirm',
          name: 'list',
          message: 'Gerar pagina de listagem?',
          initial: true
        },
        {
          type: 'confirm',
          name: 'single',
          message: 'Gerar pagina de visualização?',
          initial: true
        },
        {
          type: 'confirm',
          name: 'form',
          message: 'Gerar página de formulário?',
          initial: true
        }
      ])

      if (result.form) {
        const formChoice = await prompt.ask([{
          type: 'select',
          name: 'form',
          message: 'Como deseja gerar o formulario?',
          choices: ['Todos', 'Criar', 'Editar'],
          initial: 'Todos'
        }])

        result.form = formChoice.form
      }
    }

    await generatePages({
      result,
      props: {
        name,
        formattedName,
        singleName,
        listName,
        createName,
        formName,
        editName,
        result
      },
      crudPaths,
      generate
    })

    await generateRoutes({
      generate,
      currentPath,
      name,
      props: {
        name,
        formattedName,
        result
      }
    })

    await generateStore({
      generate,
      currentPath,
      name,
      prompt
    })

    print.success(`Model ${name} gerado com sucesso!`)
    print.info('Lembre-se de importar os arquivos de rota e store gerados.')
  }
}

async function generatePages ({ result, props, crudPaths, generate }) {
  for (const key in result) {
    const isForm = key === 'form'

    if (!result[key] || (isForm && !result[key])) continue

    // Gerar página
    await generate({
      template: `${key}.vue.ejs`,
      props: {
        ...props,
        ...(isForm && { type: result[key] })
      },
      target: crudPaths[key]
    })
  }
}

async function generateRoutes ({ generate, currentPath, name, props }) {
  await generate({
    template: 'route.js.ejs',
    target: `${currentPath}/src/router/modules/${name}.js`,
    props
  })
}

async function generateStore ({ currentPath, name, prompt, generate }) {
  const responseStore = await prompt.ask({
    type: 'select',
    name: 'store',
    message: 'Qual tipo de store você deseja?',
    choices: ['pinia', 'vuex'],
    initial: 'pinia'
  })

  const isPinia = responseStore.store === 'pinia'

  await generate({
    template: `${responseStore.store}.js.ejs`,
    target: `${currentPath}/src/${isPinia ? 'stores' : 'store'}/modules/${name}.js`,
    props: { name }
  })
}
