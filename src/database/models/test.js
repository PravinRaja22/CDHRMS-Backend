var crypto = require("crypto");

const KEY_SECRET = 'qqWsVNBm671TiaXyisvKWE4N';
let order_id = 'order_FsL3VuJQqtNNVf';
let payment_id = 'pay_FsL3q1v05M2lTL';

console.log(crypto.createHmac('sha256', KEY_SECRET).update(order_id+"|"+payment_id).digest('hex'));