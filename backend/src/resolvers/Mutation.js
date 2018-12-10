const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { randomBytes } = require('crypto')
const { promisify } = require('util')

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
  async signin(parent, { email, password }, ctx, info) {
    // check if there is a user with that email
    const user = await ctx.db.query.user({ where: { email } })
    if (!user) {
      throw new Error(`No such user foudn for email ${email}`)
    }
    // check if their password is correct
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      throw new Error('Invalid Password!')
    }
    // generate the jwt
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET)

    // set jwt to cookie
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
    })

    return user
  },
  signout(parents, args, ctx, info) {
    ctx.response.clearCookie('token')
    return { message: 'OK' };
  },
  async requestReset(parent, args, ctx, info) {
    // check if this is a real user
    const user = await ctx.db.query.user({where: { email: args.email }})
    if (!user) {
      throw new Error(`No such user found for email: ${args.email}`)
    }

    // set a reset token & expiry
    const resetToken = (await promisify(randomBytes)(20)).toString('hex')
    const resetTokenExpiry = Date.now() + 3600000 // 1 hour from now
    const res = await ctx.db.mutation.updateUser({
      where: { email: args.email },
      data: { resetToken, resetTokenExpiry }
    })

    return { message: 'success' }

    // email them that reset token

  },
  async resetPassword(parent, args, ctx, info) {
    // check if the password matches
    if (args.password !== args.confirmPassword) {
      throw new Error('Your passwords dont match')
    }
    // check if its a legit reset token
    
    // check if its expired)
    const [user] = await ctx.db.query.users({
      where: {
        resetToken: args.resetToken,
        resetTokenExpiry_gte: Date.now() - 3600000,
      },
    });
    if (!user) {
      throw new Error("This token is invalid or expired")
    }
    // hash the new password
    const password = await bcrypt.hash(args.password, 10)
    // save the new password to user and remove old resetToken fields
    const updatedUser = await ctx.db.mutation.updateUser({
      where: { email: user.email },
      data: {
        password,
        resetToken: null,
        resetTokenExpiry: null,
      }
    })
    // generate jwt
    const token = jwt.sign({ userId: updatedUser.id }, process.env.APP_SECRET)
    // set jwt cookie
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365,
    })
    return updatedUser
  },
};

module.exports = Mutations;
