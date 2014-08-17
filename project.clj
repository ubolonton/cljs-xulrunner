(defproject org.ubolonton/xulrunner "0.1.0-SNAPSHOT"
  :description "FIXME: write description"
  :url "http://example.com/FIXME"
  :license {:name "Eclipse Public License"
            :url "http://www.eclipse.org/legal/epl-v10.html"}
  :dependencies [[org.clojure/clojure "1.6.0"]
                 [org.clojure/clojurescript "0.0-2311"]
                 [com.cemerick/piggieback "0.1.3"]
                 [org.clojure/core.async "0.1.319.0-6b1aca-alpha"]]

  :source-paths ["src/clj"]

  :plugins [[lein-cljsbuild "1.0.0"]
            ;; [com.cemerick/austin "0.1.3"]
            ]

  ;; :repl-options {:init-ns ubolonton.xulrunner}

  :profiles {:dev {:repl-options {:init-ns ubolonton.xulrunner}
                   :plugins [[com.cemerick/austin "0.1.3"]]}}

  :cljsbuild
  {:builds
   [{:id "bare"
     :source-paths ["src/cljs"]
     :compiler {:optimizations :none
                :pretty-print true
                :output-dir "build"
                :output-to "build/deps.js"}}
    ;; {:id "simple"
    ;;  :source-paths ["src/cljs"]
    ;;  :compiler {:optimizations :simple
    ;;             :output-dir "build-simple"
    ;;             :output-to "build-simple/main.js"}}
    ;; {:id "advanced"
    ;;  :source-paths ["src/cljs"]
    ;;  :compiler {:optimizations :advanced
    ;;             :output-dir "build-advanced"
    ;;             :output-to "build-advanced/main.js"}}
    ]})
