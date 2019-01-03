function Person(name, foods) {
  this.name = name
  this.foods = foods
}

Person.prototype.fetchFavFoods = function() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(this.foods)
    }, 2000);
  })
}

describe('mocking', () => {
  it('mocks a function', () => {
    const fetchDogs = jest.fn()
    fetchDogs('snickers')
    expect(fetchDogs).toHaveBeenCalled()
    expect(fetchDogs).toHaveBeenCalledWith('snickers')
    expect(fetchDogs).toHaveBeenCalledTimes(1)
  })

  it('can create a person', () => {
    const me = new Person('Wes', ['pizza', 'burgs'])
    expect(me.name).toEqual('Wes')
  })

  it('can fetch food', async () => {
    const me = new Person('Wes', ['pizza', 'burgs'])
    const favFoods = await me.fetchFavFoods()
    expect(favFoods).toContain('pizza')
  })

  it('mock fetch food', async () => {
    const me = new Person('Wes', ['pizza', 'burgs'])
    me.fetchFavFoods = jest.fn().mockResolvedValue(['sushi', 'ramen'])
    const favFoods = await me.fetchFavFoods()
    expect(favFoods).toContain('sushi')
  })
})
