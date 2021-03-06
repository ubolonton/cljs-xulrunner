# cljs-xulrunner

Tools to bring Clojurescript to XULRunner programs: Firefox, Thunderbird, Conkeror.

## Usage

- After cloning, compile
```sh
lein cljsbuild once
```
- Install MozRepl.
- Open the REPL.
- Follow the instructions in `src/js/run.js`.

## Highlights
- Potentially have access to the whole XULRunner runtime, not just a page's context.

## TODOs
- Fix prints scheduled by timeout/interval being ignored. To be fair clojure.browser.repl has the same problem! As an aside, this is better solved on the printing side (in Clojure).
- Allow runtime addition of dependencies.
- Make a REPL extension to stop piggy-backing on MozRepl..
- Swap client-server role (XULRunner programs should be servers).
- Add other transports (TCP, WebSockets).
- Set it up so that `goog.require` can load from jar files.
- Add more introspection features.
- Firefox dev tool!

## Copyright and license

Copyright © 2014 Nguyễn Tuấn Anh

Distributed under [Eclipse Public License](http://opensource.org/licenses/EPL-1.0).
