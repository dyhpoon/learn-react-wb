import DownShift, { resetIdCounter } from 'downshift';
import gql from 'graphql-tag';
import debounce from 'lodash.debounce';
import Router from 'next/router';
import React, { Component } from 'react';
import { ApolloConsumer } from 'react-apollo';
import { DropDown, DropDownItem, SearchStyles } from './styles/DropDown';

const SEARCH_ITEMS_QUERY = gql`
  query SEARCH_ITEMS_QUERY($searchTerm: String!) {
    items(where: { OR:
      [
        { title_contains: $searchTerm },
        { description_contains: $searchTerm },
      ]
    }) {
      id
      image
      title
    }
  }
`

function routeToItem(item) {
  Router.push({
    pathname: '/item',
    query: {
      id: item.id
    }
  })
}

export default class Search extends Component {
  state = {
    items: [],
    loading: false,
  }

  onChange = debounce(async (e, client) => {
    this.setState({ loading: true })
    const res = await client.query({
      query: SEARCH_ITEMS_QUERY,
      variables: { searchTerm: e.target.value }
    })

    this.setState({ items: res.data.items, loading: false })
  }, 350)

  render() {
    resetIdCounter()
    return (
      <SearchStyles>
        <DownShift onChange={routeToItem} itemToString={item => item ? item.title : '' }>
          {({ getInputProps, getItemProps, isOpen, inputValue, highlightedIndex }) => {
            return (
              <div>
                <ApolloConsumer>
                  {(client) => {
                    return <input 
                      {...getInputProps({
                        onChange: e => {
                          e.persist()
                          this.onChange(e, client)
                        },
                        type: "search",
                        placeholder: "Search for items",
                        id: "search",
                        className: this.state.loading ? 'loading': '',
                      })}
                    />
                  }}
                </ApolloConsumer>

                { isOpen && (
                  <DropDown>
                    {this.state.items.map((item, index) => {
                      return (
                        <DropDownItem {...getItemProps({ item })} key={item.id} highlighted={index === highlightedIndex}>
                          <img width="50" src={item.image} alt={item.title} />
                          {item.title}
                        </DropDownItem>
                      )
                    })}
                    {!this.state.items.length && !this.state.loading && (<DropDownItem>Nothing Found</DropDownItem>)}
                  </DropDown>
                ) }
              </div>
            )
          }}
        </DownShift>
      </SearchStyles>
    )
  }
}
