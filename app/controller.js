
const user = require('../controller/user_controller');
const index = require('../controller/index_controller');


module.exports={
    index : new index,
    user: new user
}