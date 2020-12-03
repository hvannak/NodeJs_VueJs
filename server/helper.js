const updatemessage = "You update successfully"
const savemessage = "You save successfully"

function getendpoints(routerConst) {
    return routerConst.stack.filter(x=> x.route && x.route.path && Object.keys(x.route.methods) != 0)
    .map(layer => ({ method :layer.route.stack[0].method.toUpperCase(), path: layer.route.path}));
}

module.exports = {
    updatemessage: updatemessage,
    savemessage: savemessage,
    getendpoints: getendpoints
}
