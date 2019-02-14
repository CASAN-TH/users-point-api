'use strict';
// use model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var PointSchema = new Schema({
    user_id: {
        type: String
    },
    total:{
        type: Number,
        default: 0
    },
    used:{
        type: Number,
        default: 0
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date
    },
    createby: {
        _id: {
            type: String
        },
        username: {
            type: String
        },
        displayname: {
            type: String
        }
    },
    updateby: {
        _id: {
            type: String
        },
        username: {
            type: String
        },
        displayname: {
            type: String
        }
    }
});

mongoose.model("Point", PointSchema);