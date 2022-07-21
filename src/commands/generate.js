const path = require('path')

module.exports = {
  name: 'generate',
  alias: ['g'],
  run: async toolbox => {
    const {
      parameters,
      template: { generate },
      print,
      prompt
    } = toolbox

    const name = parameters.first
    const formattedName = formatName('PascalCase', name)

    const singleName = `${formattedName}Single`
    const listName = `${formattedName}List`
    const createName = `${formattedName}Create`
    const formName = `${formattedName}Form`
    const editName = `${formattedName}Edit`

    const currentPath = toolbox.filesystem.cwd()

    const crudPaths = {
      list: `${currentPath}/src/pages/${name}/${formattedName}List.vue`,
      form: `${currentPath}/src/pages/${name}/${formattedName}Form.vue`,
      single: `${currentPath}/src/pages/${name}/${formattedName}Single.vue`,
    }

    const result = await prompt.ask([
      {
        type: 'confirm',
        name: 'list',
        message: 'Gerar pagina de listagem?',
        initial: true
      },
      {
        type: 'confirm',
        name: 'form',
        message: 'Gerar pagina de formulario?',
        initial: true
      },
      {
        type: 'confirm',
        name: 'single',
        message: 'Gerar pagina de visualização?',
        initial: true
      }
    ])

    for (const key in result) {
      if (!result[key]) continue

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
          editName
        },
        target: crudPaths[key]
      })
    }

    // Gerar rota
    const camelCaseName = formatName('camelCase', name)
    await generate({
      template: 'route.js.ejs',
      target: `${currentPath}/src/router/modules/${camelCaseName}.js`,
      props: {
        name,
        formattedName,
      }
    })

    // Gerar store
    await generate({
      template: 'store.js.ejs',
      target: `${currentPath}/src/store/modules/${camelCaseName}.js`,
      props: { name }
    })

    print.debug(result)

    print.info(`Generated file at models/${name}-model.js`)
  }
}

function formatName (type, name) {
  let nameSplited

  if (type === 'PascalCase') {
    nameSplited = name.split('-').map(currentName => currentName.charAt(0).toUpperCase() + currentName.slice(1))
  }

  if (type === 'camelCase') {
    nameSplited = name.split('-')?.map((currentName, index) => {
      if (!index) {
        return currentName
      }
      
      return currentName.charAt(0).toUpperCase() + currentName.slice(1)
    })
  }

  return nameSplited.join('')
}