(ns ubolonton.cljs-xulrunner
  (:require [cemerick.austin.repls :as repls]
            [cemerick.austin :as austin]))

(defn run []
  (let [repl-env (reset! repls/browser-repl-env
                         (austin/repl-env))]
    (repls/cljs-repl repl-env)))
