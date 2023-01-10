import Document, { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script';

class MyDocument extends Document {
	render() {
		return (
			<Html>
				<Head>
					<title>iAmbulance</title>
					<link rel="manifest" href="/manifest.json" />
					<link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
					<link rel="theme-color" href="#0000" />
					<link rel='icon' href="https://img.chibykes.dev/ambulance.png"/>
				</Head>
				<body className="">
					<Main />
					<NextScript />
					<Script
						src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&callback=initMap&v=weekly&libraries=places`}
						strategy='beforeInteractive'
					/>
				</body>
			</Html>
		);
	}
}

export default MyDocument;