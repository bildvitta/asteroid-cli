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
    const formattedName = name.charAt(0).toUpperCase() + name.slice(1)

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

      await generate({
        template: `${key}.vue.ejs`,
        target: crudPaths[key],
        props: {
          name,
          formattedName,
          singleName,
          listName,
          createName,
          formName,
          editName
        }
      })
    }

    print.debug(result)

    print.info(`Generated file at models/${name}-model.js`)
  }
}
