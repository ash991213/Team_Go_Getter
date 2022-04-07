require('dotenv').config();
const jwt = require('jsonwebtoken');

const secretKey = process.env.SECRET_KEY; // salt
const algorithm = process.env.JWT_ALG; // 사용 알고리즘
const expiresIn = process.env.JWT_EXP; // 만료기간
const issuer = process.env.JWT_ISSUER; // 토큰 발급자

const option = { algorithm, expiresIn, issuer };

function makeToken(payload) {
  return jwt.sign(payload, secretKey, option);
}

function decodePayload(token) {
  console.log(token)
  return jwt.verify(token, secretKey);
}

module.exports = { makeToken, decodePayload };