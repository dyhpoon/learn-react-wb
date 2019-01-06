// this file connects to the remote prismaDB, gives us the ability to query it with JS
const { Prisma } = require('prisma-binding')
const fs = require('fs')
const path = require('path')

// TODO: temp fix of unable to read prisma.graphql in now deployment
fs.readdirSync(path.join(__dirname, './generated'))

const db = new Prisma({
  typeDefs: path.join(__dirname, './generated/prisma.graphql'),
  endpoint: process.env.PRISMA_ENDPOINT,
  secret: process.env.PRISMA_SECRET,
  debug: false,
})

module.exports = db
