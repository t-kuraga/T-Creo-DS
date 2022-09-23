// Inject listening 
var s = document.createElement('script');
s.src = chrome.runtime.getURL(`js/t-creo-listener.js?extId=${chrome.runtime.id}`);
s.type = "module"
s.setAttribute("extId", chrome.runtime.id);
s.onload = function () {
    this.remove();
};
(document.head || document.documentElement).appendChild(s);
