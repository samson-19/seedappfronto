import "./globals.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { ReduxProvider } from "@/redux/Provider";
import NavMenu from "./components/navigation/NavMenu";
import Script from "next/script";




export const metadata = {
  title: "Seed App",
  description: "Project Demonstration",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
    <head>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/css/bootstrap.min.css" rel="stylesheet" /> 
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"   />




    </head>
    <body >
    <ReduxProvider>
      <NavMenu />

      <main>
      <section className="section">
<div className="container">


      {children}

      </div>
      </section>
      </main>
      </ReduxProvider>



      <Script
        src="https://code.jquery.com/jquery-3.6.0.min.js"
        strategy="beforeInteractive"
      />

      <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" strategy="afterInteractive" />


      


    </body>
  </html>

  );
}
