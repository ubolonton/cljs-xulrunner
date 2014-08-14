(ns ubolonton.cljs-xulrunner.util
  (:require-macros [cljs.core.async.macros :refer [go go-loop]])
  (:require [cljs.core.async :refer [<! >! put! timeout chan]]))

(def Cc (.-classes js/Components))

(def Ci (.-interfaces js/Components))

(def Cu (.-utils js/Components))

(defn class [class-id]
  (aget Cc (str class-id)))

(defn interface [interface-id]
  (aget Ci (str interface-id)))

(defn as [obj interface-id]
  (.QueryInterface obj (interface interface-id)))

(defn create [class-id interface-id]
  (.createInstance (class class-id) (interface interface-id)))

(defn xml-http-request []
  (-> (create "@mozilla.org/xmlextras/xmlhttprequest;1" "nsIXMLHttpRequest")
      (as "nsIJSXMLHttpRequest")
      (as "nsIDOMEventTarget")))

(defn post [url data]
  (let [request (xml-http-request)
        result (chan 1)]
    (doto request
      (aset "onload" (fn [event]
                       (put! result (.-responseText request))))
      (aset "timeout" 50000)
      (.open "POST" url true)
      (.send data))
    result))

;;; Temp hack while piggy-backing on MozRepl for development Not
;;; simply js/repl.print, because it's a method (using this), not a
;;; function.
(set-print-fn!
 (fn [str]
   (js/repl.print str)))
