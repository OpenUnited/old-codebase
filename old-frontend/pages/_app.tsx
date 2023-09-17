import React from "react";
import {wrapper} from "../lib/redux";
import { apolloClient } from '../lib/apolloClient';
import { ApolloProvider as ApolloHooksProvider } from '@apollo/react-hooks'
import '../styles/index.less';
import 'react-sortable-tree/style.css';
// import '../static/manifest.json';

export default wrapper.withRedux(({Component, pageProps}) => {

    return (
        <ApolloHooksProvider client={apolloClient}>
            <link rel="manifest" href="../static/manifest.json" />
            <Component {...pageProps} />
        </ApolloHooksProvider>
    );
});