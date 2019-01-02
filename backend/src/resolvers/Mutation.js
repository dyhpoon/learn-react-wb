const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { randomBytes } = require('crypto')
const { promisify } = require('util')
const { transport, makeANiceEmail } = require('../mail')
const { hasPermission } = require('../utils')

const Mutations = {
  async createItem(parent, args, ctx, info) {
    if (!ctx.request.userId) {
      throw new Error("You must be logged in to do that")
    }

    const item = await ctx.db.mutation.createItem({
      data: {
        // add user relationship to item object
        user: {
          connect: {
            id: ctx.request.userId
          }
        },
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
    const item = await ctx.db.query.item({ where }, `{ id title user { id } }`)

    // check if they own that item, or have the permissions
    const isOwningItem = item.user.id === ctx.request.userId
    const hasPermission = ctx.request.user.permissions.some(permission => ['ADMIN', 'ITEMDELETE'].includes(permission))

    if (!isOwningItem && !hasPermission) {
      throw new Error("You do not have permission to delete item")
    }

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

    // email them that reset token
    const emailRes = await transport.sendMail({
      from: 'dyhpoon@gmail.com',
      to: user.email,
      subject: 'Your password reset token',
      html: makeANiceEmail(`Your password reset token is here! \n\n <a href="${process.env.FRONTEND_URL}/reset?resetToken=${resetToken}">Click here to reset</a>`),
    })
    
    return { message: 'success' }
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
  updatePermissions(parents, args, ctx, info) {
    // check if they are logged in
    if (!ctx.request.userId) {
      throw new Error("You must be logged in!")
    }

    // check if they have permission to do this
    hasPermission(ctx.request.user, ['ADMIN', 'PERMISSIONUPDATE'])

    // update permissions
    return ctx.db.mutation.updateUser({
      data: {
        permissions: {
          set: args.permissions,
        }
      },
      where: {
        id: args.userId
      },
    }, info,)
  },
  async addToCart(parents, args, ctx, info) {
    // check sign in
    const { userId } = ctx.request
    if (!userId) {
      throw new Error('You need to login first')
    }

    // query the user current cart
    const [ existingCartItem ] = await ctx.db.query.cartItems({
      where: {
        user: { id: userId },
        item: { id: args.id },
      },
    })

    // check if that item is already in their cart, and increment by 1 if it in cart already
    if (existingCartItem) {
      return ctx.db.mutation.updateCartItem({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + 1 },
      }, info)
    }
    // save updated cart
    else {
      return ctx.db.mutation.createCartItem({
        data: {
          user: {
            connect: { id: userId }
          },
          item: {
            connect: { id: args.id }
          }
        }
      }, info)
    }
  },
  async removeFromCart(parents, args, ctx, info) {
    // find cart item
    const cartItem = await ctx.db.query.cartItem({
      where: {
        id: args.id
      }
    }, `{ id, user { id } }`)

    // check if cartItem exists
    if (!cartItem) {
      throw new Error("No Cart Item Found!")
    }

    // make sure they own the cart item
    if (cartItem.user.id !== ctx.request.userId) {
      throw new Error("You do not own this cart item")
    }

    // delete cart item
    return ctx.db.mutation.deleteCartItem({
      where: { id: args.id },
    }, info)
  },
};

module.exports = Mutations;
