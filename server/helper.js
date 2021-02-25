const updatemessage = "You update successfully"
const savemessage = "You save successfully"
var jwt = require('jsonwebtoken');

function getendpoints(routerConst) {
    return routerConst.stack.filter(x=> x.route && x.route.path && Object.keys(x.route.methods) != 0)
    .map(layer => ({ method :layer.route.stack[0].method.toUpperCase(), path: layer.route.path}));
}

function getuserId(request) {
    const token = request.header('auth-token');
    return jwt.verify(token,process.env.TOKEN_SECRET);
}


module.exports = {
    updatemessage: updatemessage,
    savemessage: savemessage,
    getendpoints: getendpoints,
    getuserId: getuserId
}

