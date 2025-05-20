import Home from './Home/page';
import Head from 'next/head';

export default function HomePage() {
  return (
    <>
      <Head>
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='anonymous' />
        <link
          href='https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap'
          rel='stylesheet'
        />
        <title>RegionX Hub</title>
      </Head>
      <Home />
    </>
  );
}
