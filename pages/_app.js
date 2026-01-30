import Head from 'next/head';
import '../styles/globals.css'; // Pastikan path css ini sesuai file aslimu

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        {/* 1. Judul Tab Browser */}
        <title>RITUAL VAULT | Secure Protocol</title>
        
        {/* 2. Ikon Kecil di Tab (Favicon) */}
        <link rel="icon" href="/logo.png" type="image/png" />
        
        {/* 3. (Bonus) Biar kalau link dishare di WA/Discord ada gambarnya */}
        <meta name="description" content="Access Restricted. Secure Weekly Protocol." />
        <meta property="og:title" content="RITUAL VAULT" />
        <meta property="og:description" content="Can you crack the code? Enter the vault." />
        <meta property="og:image" content="/logo.png" />
      </Head>

      <Component {...pageProps} />
    </>
  );
}

export default MyApp;