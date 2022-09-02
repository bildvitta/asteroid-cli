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
    const generateAll = await prompt.confirm('Deseja gerar o CRUD completo?')

    const result = generateAll ? 
      { 
        list: true,
        form: 'all',
        single: true
      }
      :
      await prompt.ask([
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
          type: 'select',
          name: 'form',
          message: 'Como deseja gerar o formulario?',
          choices: ['all', 'create', 'replace'],
          initial: true
        }
      ])

    const formNames = {
      all: 'Form',
      create: 'Create',
      replace: 'Edit'
    }
    const formName = `${formattedName}${formNames[result.form]}`
    const crudPaths = {
      list: `${currentPath}/src/pages/${name}/${formattedName}List.vue`,
      form: `${currentPath}/src/pages/${name}/${formName}.vue`,
      single: `${currentPath}/src/pages/${name}/${formattedName}Single.vue`,
    }

    for (const key in result) {
      if (!result[key]) continue

      const isForm = key === 'form'

      // Gerar página
      await generate({
        template: `${key}.vue.ejs`,
        props: {
          name,
          formattedName,
          singleName,
          listName,
          createName,
          formName,
          editName,
          ...(isForm && { type: result[key] })
        },
        target: crudPaths[key]
      })
    }

    const camelCaseName = strings.camelCase(name)

    // const routeFile = toolbox.filesystem.read(`${currentPath}/src/router/routes.js`)
    // console.log(routeFile, '<-- routeFile')
    // console.log(`import ${camelCaseName} from './modules/${camelCaseName}'\n${routeFile}`)
    // toolbox.filesystem.write(
    //   `${currentPath}/src/router/routes.js`,
    //   `import ${camelCaseName} from './modules/${camelCaseName}'\n${routeFile}`
    // )

    // Gerar rota
    await generate({
      template: 'route.js.ejs',
      target: `${currentPath}/src/router/modules/${camelCaseName}.js`,
      props: {
        name,
        formattedName,
        result
      }
    })

    // Gerar store
    await generate({
      template: 'store.js.ejs',
      target: `${currentPath}/src/store/modules/${camelCaseName}.js`,
      props: { name }
    })

    print.success(`Model ${name} gerado com sucesso!`)
  }
}
