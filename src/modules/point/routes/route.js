'use strict';
var controller = require('../controllers/controller'),
    policy = require('../policy/policy');
module.exports = function (app) {
    var url = '/api/points';
    var urlWithParam = '/api/points/:pointId';
    app.route(url).all(policy.isAllowed)
        .get(controller.getList)
        .post(controller.create);

    app.route(urlWithParam).all(policy.isAllowed)
        .get(controller.read)
        .put(controller.update)
        .delete(controller.delete);

    app.route('/api/points-user')
        .post(
            controller.findpointByID,
            controller.returnData
        )

    app.param('pointId', controller.getByID);
}