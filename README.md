# Jenky

Jenky is a beautiful radiator for your [Jenkins][] CI server.

![Jenky in action][screenshot]

A radiator show the status of your integration server's build and test jobs in
a large format suitable for showing on a large TV or monitor screen on a wall
of your office.

## Deployment

Jenky is a Javascript/HTML application that runs entirely in your browser. It
does need to be served over HTTP. Any HTTP server will do. Jenky runs directly
from source; it does not need to be compiled.

## Configuration

Jenky comes with an [example configuration file][conf]. Copy or rename this
file to `conf.js`, in the same directory. Open that file and replace `'change
me'` with the URL of your Jenkins installation. That's it!

### Detailed instructions

1. [Download][] and extract Jenky to a folder that an HTTP server is serving.
2. Add your Jenkins's URL to [js/conf.js][conf].
3. (Optional) Add your [TypeKit][] kit ID to `js/conf.js` and change the
   default font.
4. Open the URL to the folder you extracted Jenky into in your browser.

## User interface

Most radiators are functional but not pretty. Jenky tries to be both. This
means that how Jenky presents information is just as important as the
information itself.

We have made most of the choices related to aesthetics and user experience for
you. This includes things like colours, use of white space, and making the
information hierarchy obvious.

### Font

Among these choices is the choice of typeface. By default, Jenky uses [Freight
Sans Pro][freight], a lovely sans serif that is well suited for Jenky's large,
sparse displays of text. It is included in the [TypeKit][] font hosting
service's portfolio plan and higher. You can tell Jenky your TypeKit kit ID
that includes Freight Sans Pro, and Jenky will automatically use your kit. Add
your kit ID to the `js/conf.js` file you copied from the example configuration
file. The key for the kit ID is `typekitKitId`.

Jenky's default configuration specifies a suitable set of fallback fonts in
case Freight Sans Pro is not available. You can also change the value of the
`font` key in Jenky's configuration file. This value can be any valid CSS
`font-family` value.

The important part in choosing a font for Jenky is to view the font on an
actual radiator screen, where Jenky will actually be used.  Fonts look very
different on a 13-inch laptop screen and a 50-inch TV.

## Status and contributing

Jenky is currently in alpha. It is usable but not robust. Jenky is also
missing tests. (How do you test a project that's mostly UI?)

If you have any ideas about how to improve Jenky, we would love to hear from
you! Any [GitHub issues][issues] or even [pull requests][] you send are highly
appreciated. If you just want to send a message to the authors, that's fine
too.

If you do want to implement a feature or think fix something, we encourage you to
take a look at the current [issues][]. If the feature or fix you want to work
on is not listed in the issues, please add it.

## Authors

- [wolverian](https://github.com/wolverian) ([Twitter][tw/wolverian])
- [vluoto](https://github.com/vluoto)
- [anttieov](https://github.com/anttieov)

[screenshot]: https://raw.github.com/Eficode/jenky/master/img/screenshot.png
[Download]: https://github.com/Eficode/jenky/zipball/master
[Jenkins]: http://jenkins-ci.org
[TypeKit]: http://typekit.com
[conf]: https://github.com/Eficode/jenky/blob/master/js/conf.example.js
[freight]: https://typekit.com/fonts/freight-sans-pro
[issues]: https://github.com/eficode/jenky/issues
[pull requests]: https://github.com/eficode/jenky/pulls
[tw/wolverian]: https://twitter.com/wolverian
