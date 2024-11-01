import Head from 'next/head'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Chat Interface</title>
        <meta name="description" content="Um chat interface moderno" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp