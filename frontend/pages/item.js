import SingleItem from '../components/SingleItem'
import gql from 'graphql-tag'

const Item = props => (
  <div>
    <SingleItem id={props.query.id}></SingleItem>
  </div>
)

export default Item
