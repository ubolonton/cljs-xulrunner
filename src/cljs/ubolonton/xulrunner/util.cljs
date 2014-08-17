(ns ubolonton.xulrunner.util
  (:require-macros [cljs.core.async.macros :refer [go go-loop]])
  (:require [cljs.core.async :refer [<! >! put! timeout chan close!]]))

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

(defn post [url data response-channel]
  (let [request (xml-http-request)]
    (doto request
      (.addEventListener
       "load" (fn [event]
                (if (= (.-status request) 200)
                  (put! response-channel (.-responseText request))
                  (close! response-channel))))
      (.addEventListener
       "error" (fn [event]
                 (close! response-channel)))
      (.open "POST" url true)
      (.send data))
    response-channel))
