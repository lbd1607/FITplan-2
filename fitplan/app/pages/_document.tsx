import { Document, Html, DocumentHead, Main, BlitzScript /*DocumentContext*/ } from "blitz"

class MyDocument extends Document {
  // Only uncomment if you need to customize this behaviour
  // static async getInitialProps(ctx: DocumentContext) {
  //   const initialProps = await Document.getInitialProps(ctx)
  //   return {...initialProps}
  // }

  render() {
    return (
      <Html lang="en">
        <DocumentHead />
        {/* Photo by Greg Rosenke on Unsplash bg-hero bg-contain bg-left bg-no-repeat  */}
        <body>
          <Main />

          <BlitzScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
