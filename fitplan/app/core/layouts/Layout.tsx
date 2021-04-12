import React, { ReactNode, useReducer, Suspense, createRef, useRef, useEffect } from "react"
import { Head, Link } from "blitz"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"

/* User's avatar. Default is first letter of username or email */
export const Avatar = (props) => {
  const canvasRef = useRef(props) /* Init ref for canvas */
  const currentUser = useCurrentUser() /* Get user currently signed in for avatar */
  var text = "" /* Init text as str */

  /* Get first character, capitalize it, and convert to string for avatar if user is signed in, otherwise set avatar char to question mark */
  if (currentUser) {
    text = currentUser.email.charAt(0).toUpperCase().toString()
    //text = "W"
  } else {
    text = "?"
  }

  /* Draw avatar */
  const draw = (ctx) => {
    /* Draw rectangle, then form into circle for avatar */
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.fillStyle = "#666"
    ctx.beginPath()
    ctx.arc(20, 20, 20, 0, 2 * Math.PI)
    /* Draw text in avatar circle */
    ctx.fill()
    ctx.font = "120% Montserrat medium"
    ctx.textAlign = "center"
    ctx.fillStyle = "#fff"
    ctx.fillText(text, 20, 26)
  }
  /* Create avatar drawing */
  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext("2d")

    canvas.height = 40
    canvas.width = 40

    draw(context)
  }, [draw])

  return (
    <div className="p-3 ml-44">
      <canvas className="" ref={canvasRef} {...props} />
    </div>
  )
}

/* Navbar */
class Nav extends React.Component {
  render() {
    return (
      <div className="navbar">
        <h3 className="brand">f.i.t.plan</h3>

        <div className="p-5">
          <ul className="navlinks">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/workouts">Workouts</Link>
            </li>
            <li>
              <Link href="/exercises">Exercises</Link>
            </li>
            <li>
              <Link href="/plans">Weekly Plans</Link>
            </li>
          </ul>
        </div>
        <div className="w-1/2">{""}</div>

        <Suspense fallback="Loading...">
          <Avatar />
        </Suspense>
      </div>
    )
  }
}

type LayoutProps = {
  title?: string
  children: ReactNode
}

const Layout = ({ title, children }: LayoutProps) => {
  return (
    <>
      <Head>
        <title>{title || "fitplan"}</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <Nav />

      {children}
    </>
  )
}

export default Layout
