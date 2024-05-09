#WebServer + RestServer base

Ejecutar 
 ``` npm install ```


token POST -> headers -> x-token 



parsear jwt :
 function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
};
# socket-chat
# socket-chat
# socket-chat
# socket-chat
