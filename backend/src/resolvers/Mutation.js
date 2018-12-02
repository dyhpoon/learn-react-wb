const Mutations = {
  // createDog(parent, args, ctx, info) {
  //   global.dogs = global.dogs || [];
  //   const newDog = { name: args.name }
  //   global.dogs.push(newDog)
  //   return newDog
  // }
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
};

module.exports = Mutations;
