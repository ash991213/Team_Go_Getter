const express = require('express');
const router = express.Router()
const userController = require('./userController.js')
const {createToken} = require('../../../back/utils/jwt')

