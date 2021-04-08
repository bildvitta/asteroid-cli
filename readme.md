# asteroid-cli CLI

A CLI for asteroid-cli.

## Customizing your CLI

Check out the documentation at https://github.com/infinitered/gluegun/tree/master/docs.

## Publishing to NPM

To package your CLI up for NPM, do this:

```shell
$ npm login
$ npm whoami
$ npm lint
$ npm test
(if typescript, run `npm run build` here)
$ npm publish
```

## Usage

> asteroid-cli g [entity]

example:

```bash
asteroid-cli g users
```

It will generate a folder inside `src/pages/users`.

# License

MIT - see LICENSE

