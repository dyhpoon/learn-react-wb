import ItemComponent from '../components/Item';
import { shallow } from 'enzyme'
import toJSON from 'enzyme-to-json'

const fakeItem = {
  id: 'abc123',
  title: 'the title',
  price: 3013,
  description: 'this is a description',
  image: 'dog.jpg',
  largeImage: 'largedog.jpg',
}

describe('<Item/>', () => {
  it('renders and displays properly', () => {
    const wrapper = shallow(<ItemComponent item={fakeItem}/>)
    expect(wrapper.find('PriceTag').children().text()).toBe('$30.13')
    expect(wrapper.find('Title a').text()).toBe(fakeItem.title)
    expect(wrapper.find('img').props().src).toBe(fakeItem.image)
    expect(wrapper.find('img').props().alt).toBe(fakeItem.title)
  })

  it('renders out the buttons properly', () => {
    const wrapper = shallow(<ItemComponent item={fakeItem}/>)
    const buttonList = wrapper.find('.buttonList');
    expect(buttonList.children()).toHaveLength(3)
    expect(buttonList.find('Link').exists()).toBeTruthy()
  })

  it('snapshot', () => {
    const wrapper = shallow(<ItemComponent item={fakeItem} />)
    expect(toJSON(wrapper)).toMatchSnapshot()
  })
})