// function loadTranslationScript(callback) {
//     var script = document.createElement("script");
//     script.type = "text/javascript";

//     if (script.readyState) {  // For old versions of IE
//         script.onreadystatechange = function () {
//             if (script.readyState == "loaded" || script.readyState == "complete") {
//                 script.onreadystatechange = null;
//                 callback();
//             }
//         };
//     } else {  // For modern browsers
//         script.onload = function () {
//             callback();
//         };
//     }

//     script.src = '/jsi18n/';
//     document.getElementsByTagName("head")[0].appendChild(script);
// }
