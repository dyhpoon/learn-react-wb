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
  }
};

module.exports = Mutations;
