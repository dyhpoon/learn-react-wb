const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const Mutations = {
  async createItem(parent, args, ctx, info) {
    // TODO: check if log in

    const item = await ctx.db.mutation.createItem({
      data: {
        ...args
      }
    }, info)
    
    return item
  },
  async updateItem(parent, args, ctx, info) {
    // first take a copy of the updates
    const updates = { ...args }
    // remove the id from the updates
    delete updates.id
    // run the update method
    const item = await ctx.db.mutation.updateItem({
      data: updates,
      where: { id: args.id }
    }, info)

    return item
  },
  async deleteItem(parent, args, ctx, info) {
    const where = { id: args.id }

    // find the item
    const item = await ctx.db.query.item({ where }, `{ id, title }`)

    // check if they own that item, or have the permissions
    // TODO

    // delete it
    return ctx.db.mutation.deleteItem({ where }, info)
  },
  async signup(parent, args, ctx, info) {
    args.email = args.email.toLowerCase()
    const password = await bcrypt.hash(args.password, 10)
    const user = await ctx.db.mutation.createUser({
      data: {
        ...args,
        password,
        permissions: { set: ['USER'] }
      }
    }, info)
    // create the JWT token for them
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET)

    // set jwt to cookie
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
    })

    return user
  },
};

module.exports = Mutations;
