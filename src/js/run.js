// Run this in the REPL, replacing paths accordingly
let (
  {Services} = Components.utils.import("resource://gre/modules/Services.jsm"),
  base = "file:///home/ubolonton/Programming/projects/cljs-xulrunner/",
  bootstrapModule = "file:///home/ubolonton/Programming/projects/cljs-xulrunner/src/js/bootstrap.js",
  bootstrap = {}
) {
  let window = Components.classes["@mozilla.org/appshell/appShellService;1"]
        .getService(Components.interfaces.nsIAppShellService)
        .hiddenDOMWindow.wrappedJSObject;
  Services.scriptloader.loadSubScript(bootstrapModule, bootstrap);
  let env = bootstrap.main(base);
  // Manually set some important globals. TODO: Allow reusing an
  // existing context instead of always creating an almost-empty one
  // (see bootstrap/goog_make_env)
  env.Element = window.Element;
  env.window = window;
  env.document = window.document;
  env.setTimeout = window.setTimeout;
  // MozREPL piggy-backing. TODO: Use own's REPL
  env.repl = repl;
  // Enter the context
  repl.enter(env);
};

// Run "lein repl", then run ubolonton.xulrunner.run

// Run these in MozREPL *after* running the above, replace the url
// with the one printed by ubolonton.xulrunner.run (minus the "start"
// part, that's for nrepl)
goog.require("ubolonton.xulrunner.repl");
ubolonton.xulrunner.repl.connect("http://localhost:38746/7864/repl");

// If you use a nrepl client (e.g. connecting to "lein repl" with
// cider, turn off pretty printing, as clojure.pprint has not been
// implemented for Clojurescript
