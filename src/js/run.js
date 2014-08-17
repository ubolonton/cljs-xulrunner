// Run this in the REPL, replacing paths accordingly
let (
  {Services} = Components.utils.import("resource://gre/modules/Services.jsm"),
  base = "file:///home/ubolonton/Programming/projects/cljs-xulrunner/",
  bootstrapModule = "file:///home/ubolonton/Programming/projects/cljs-xulrunner/src/js/bootstrap.js",
  bootstrap = {}
) {
  Services.scriptloader.loadSubScript(bootstrapModule, bootstrap);
  let env = bootstrap.main(base);

  // Piggyng-backing on ubolonton's specific conkeror's function. This is
  // important to give the env some globals clojure.browser namespaces
  // expect. XXX: Use standard XULRunner stuff instead
  let w = makeI().window;
  env.Element = w.Element;
  env.window = w;
  env.document = w.document;
  env.setTimeout = w.setTimeout;

  // MozREPL piggy-backing. TODO: Use own's REPL
  env.repl = repl;

  repl.enter(env);
};

// Try these *after* running the above

goog.require("ubolonton.xulrunner.repl");

cljs.core.println("?");

// ubolonton.xulrunner.util


// clojure.browser.repl.connect("http://localhost:40208/9405");


// env = loadScript("file:///home/ubolonton/Programming/projects/cljs-xulrunner/src/js/bootstrap.js").main()
