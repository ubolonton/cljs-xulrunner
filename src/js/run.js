// Run this in the REPL, replacing paths accordingly
let (
  {Services} = Components.utils.import("resource://gre/modules/Services.jsm"),
  base = "file:///home/ubolonton/Programming/projects/cljs-xulrunner/",
  bootstrapModule = "file:///home/ubolonton/Programming/projects/cljs-xulrunner/src/js/bootstrap.js",
  bootstrap = {}
) {
  Services.scriptloader.loadSubScript(bootstrapModule, bootstrap);
  let env = bootstrap.main(base);
  // let w = makeI().window;
  // env.Element = w.Element;
  // env.window = w;
  // env.document = w.document;
  env.repl = repl;
  repl.enter(env);
};

// Try these *after* running the above

goog.require("ubolonton.cljs_xulrunner.util");

cljs.core.println("?");

// ubolonton.cljs_xulrunner.util


// clojure.browser.repl.connect("http://localhost:40208/9405");


// env = loadScript("file:///home/ubolonton/Programming/projects/cljs-xulrunner/src/js/bootstrap.js").main()
