'use strict';
var mongoose = require('mongoose'),
    model = require('../models/model'),
    Point = mongoose.model('Point'),
    errorHandler = require('../../core/controllers/errors.server.controller'),
    _ = require('lodash');

exports.getList = function (req, res) {
    Point.find(function (err, datas) {
        if (err) {
            return res.status(400).send({
                status: 400,
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp({
                status: 200,
                data: datas
            });
        };
    });
};

exports.create = function (req, res) {
    var newPoint = new Point(req.body);
    newPoint.createby = req.user;
    newPoint.save(function (err, data) {
        if (err) {
            return res.status(400).send({
                status: 400,
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp({
                status: 200,
                data: data
            });
        };
    });
};

exports.getByID = function (req, res, next, id) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            status: 400,
            message: 'Id is invalid'
        });
    }

    Point.findById(id, function (err, data) {
        if (err) {
            return res.status(400).send({
                status: 400,
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            req.data = data ? data : {};
            next();
        };
    });
};

exports.read = function (req, res) {
    res.jsonp({
        status: 200,
        data: req.data ? req.data : []
    });
};

exports.update = function (req, res) {
    var updPoint = _.extend(req.data, req.body);
    updPoint.updated = new Date();
    updPoint.updateby = req.user;
    updPoint.save(function (err, data) {
        if (err) {
            return res.status(400).send({
                status: 400,
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp({
                status: 200,
                data: data
            });
        };
    });
};

exports.delete = function (req, res) {
    req.data.remove(function (err, data) {
        if (err) {
            return res.status(400).send({
                status: 400,
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp({
                status: 200,
                data: data
            });
        };
    });
};

exports.findpointByID = function (req, res, next) {
    var user_id = req.body.user_id;
    Point.find({ user_id: user_id }, function (err, datas) {
        if (err) {
            return res.status(400).send({
                status: 400,
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            req.result = datas;
            next();
        }
    })
};

exports.returnData = function (req, res) {
    res.jsonp({
        status: 200,
        data: req.result ? req.result : 'data can pass'
    });
};

exports.findUsedById = function (req, res, next) {
    var user_id = req.body.user_id;
    Point.find({ user_id: user_id }, function (err, datas) {
        if (err) {
            return res.status(400).send({
                status: 400,
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            req.used = datas[0].used;
            next();
        }
    })
};

exports.plusUsed = function (req, res, next) {
    var user_id = req.body.user_id;
    var used = req.used + 1 + req.body.bonus;
    Point.findOneAndUpdate({ user_id: user_id }, { $set: { used: used } }, { new: true }, function (err, datas) {
        if (err) {
            return res.status(400).send({
                status: 400,
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            req.result = datas;
            // console.log(datas)
            next();
        }
    })
};

exports.findTotalById = function (req, res, next) {
    var user_id = req.body.user_id;
    Point.find({ user_id: user_id }, function (err, datas) {
        if (err) {
            return res.status(400).send({
                status: 400,
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            req.total = datas[0].total;
            next();
        }
    })
};

exports.plusTotal = function (req, res, next) {
    var user_id = req.body.user_id;
    var total = req.total + 1;
    Point.findOneAndUpdate({ user_id: user_id }, { $set: { total: total } }, { new: true }, function (err, datas) {
        if (err) {
            return res.status(400).send({
                status: 400,
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            req.result = datas;
            // console.log(datas)
            next();
        }
    })
};