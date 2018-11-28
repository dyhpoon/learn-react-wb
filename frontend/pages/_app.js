import App, { Container } from 'next/app';
import { ApolloProvider } from "react-apollo";
import Page from '../components/Page';
import withData from "../lib/withData";

class MyApp extends App {
  static async getInitialProps({ query }) {
    const pageProps = { query }
    return { pageProps }
  }

  render() {
    const { Component, apollo, pageProps } = this.props
    return (
      <Container>
        <ApolloProvider client={apollo}>
          <Page>
            <Component {...pageProps} />
          </Page>
        </ApolloProvider>
      </Container>
    )
  }
}

export default withData(MyApp);
