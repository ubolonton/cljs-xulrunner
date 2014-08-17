(ns ubolonton.xulrunner.repl
  (:require-macros [cljs.core.async.macros :refer [go go-loop alt!]])
  (:require [clojure.browser.repl :as repl]
            [ubolonton.xulrunner.util :as util]
            [cljs.core.async :refer [<! put! chan close!]]))

;;; TODO: Stop piggy-backing on clojure.browser.repl

(def connections (atom nil))

;;; FIX: Error handling when POSTing

;;; TODO: Allow closing/ending session

(defn connect [repl-server-url]
  (let [incoming (chan)
        print (chan)
        result (chan)]
    (swap! connections (constantly {:incoming incoming
                                    :print print
                                    :result result}))
    ;; Server-communication loop
    (go-loop [data (repl/wrap-message :ready "ready")]
      (util/log "net:posting" data)
      (util/post repl-server-url data incoming)
      (util/log "net:waiting for response")
      (alt!
        result
        ([value _]
           (util/log "chan:sending result" value)
           (if-not (nil? value)
             (recur (repl/wrap-message :result value))))
        print
        ([value _]
           (util/log "chan:sending print" value)
           (if-not (nil? value)
             (recur (repl/wrap-message :print value))))))
    ;; REPL loop
    (go-loop [code (<! incoming)]
      ;; XXX: repl/evaluate-javascript takes conn but does nothing
      ;; with it, we just pass it nil
      (util/log "repl:got code" code)
      (when-not (nil? code)
        ;; XXX: This should not be here. But where?
        (when-not (= code "ignore__")
          (util/log "repl:executing")
          (>! result (repl/evaluate-javascript nil code))
          (util/log "repl:executed"))
        (recur (<! incoming)))
      (util/log "repl:closing")
      (close! result)
      (close! print))))

;;; XXX: Monkey-patch clojure.browser.repl/repl-print
(aset js/clojure.browser.repl "repl_print"
      (fn [data]
        (util/log "repl:printing" data)
        (put! (:print @connections) (pr-str data))))

;;; Temp hack while piggy-backing on MozRepl for development Not
;;; simply js/repl.print, because it's a method (using this), not a
;;; function.
(comment
  (defn log [str]
    (js/repl.print str))
  (set-print-fn! log)

  (aset js/clojure.browser.repl "repl_print" log))
