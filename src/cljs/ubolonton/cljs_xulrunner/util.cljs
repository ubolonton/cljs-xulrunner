(ns ubolonton.cljs-xulrunner.util)

(defn post [url data callback]
  (let [request (XMLHttpRequest.)]
    (doto request
      (aset "onload" (fn [event]
                       (callback (.-responseText request))))
      (aset "timeout" 50000)
      (.open "POST" url true)
      (.send data))))
