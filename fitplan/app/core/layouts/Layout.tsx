import React, { ReactNode, Suspense, useRef, useEffect, useState } from "react"
import { Head, Link, useMutation, useRouter } from "blitz"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import logout from "app/auth/mutations/logout"
import Modal from "react-modal"

Modal.setAppElement("#__next")

/* Set nav links to active when route == path for active styling */
export const MyNav = () => {
  const router = useRouter()
  return (
    <ul className="">
      <li className={router.asPath == "/" ? "active" : ""}>
        <Link href="/">Home</Link>
      </li>
      <li className={router.asPath == "/workouts" ? "active" : ""}>
        <Link href="/workouts">Workouts</Link>
      </li>
      <li className={router.asPath == "/exercises" ? "active" : ""}>
        <Link href="/exercises">Exercises</Link>
      </li>
      <li className={router.asPath == "/plans" ? "active" : ""}>
        <Link href="/plans">Plans</Link>
      </li>
    </ul>
  )
}

/* User's avatar. Default is first letter of email */
export const Avatar = (props) => {
  const canvasRef = useRef(props) /* Init ref for canvas */
  const currentUser = useCurrentUser() /* Get user currently signed in for avatar */
  var text = "" /* Init text as str */
  const [logoutMutation] = useMutation(logout)

  /* Get first character, capitalize it, and convert to string for avatar if user is signed in, otherwise set avatar char to question mark */
  if (currentUser) {
    text = currentUser.email.charAt(0).toUpperCase().toString()
  } else {
    text = "?"
  }

  if (currentUser) {
    /* Draw avatar */
    const draw = (ctx) => {
      /* Draw rectangle, then form into circle for avatar */
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
      ctx.fillStyle = "rgba(75, 85, 99)"
      ctx.beginPath()
      ctx.arc(18, 18, 18, 0, 2 * Math.PI)
      /* Draw text in avatar circle */
      ctx.fill()
      ctx.font = "110% Montserrat medium"
      ctx.textAlign = "center"
      ctx.fillStyle = "#fff"
      ctx.fillText(text, 18, 24)
    }
    /* Create avatar drawing */
    useEffect(() => {
      const canvas = canvasRef.current
      const context = canvas.getContext("2d")

      canvas.height = 40
      canvas.width = 40

      draw(context)
    }, [draw])
  }

  {
    /* Setup modal, contain modal open and close functions */
    const [modalIsOpen, modalSetIsOpen] = useState(false)
    const openModal = () => {
      modalSetIsOpen(true)
    }
    const closeModal = () => {
      modalSetIsOpen(false)
      // router.push("/")
      return <Link href="/" />
    }

    return (
      <>
        <button className="p-2 mr-6" onClick={openModal}>
          <canvas className="avatar-canvas" ref={canvasRef} {...props} />
        </button>
        <div>
          <Modal
            className="logout-modal"
            portalClassName="no-overlay-modal"
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
          >
            <Link href="/">
              <a
                className="logout-link itemrow-dark flex w-full border-transparent"
                onClick={async () => {
                  await logoutMutation()
                }}
              >
                Log out
              </a>
            </Link>
            <Link href="/profile">
              <a
                className="logout-link itemrow-dark flex w-full border-transparent"
                onClick={closeModal}
              >
                Profile
              </a>
            </Link>
          </Modal>
        </div>
      </>
    )
  }
}

/* Navbar */
class Nav extends React.Component {
  render() {
    return (
      <div className="navbar grid grid-flow-col">
        <img src="/fitplanIcon.svg" alt="" className="h-6 my-4 ml-7 mr-2" />
        <div className="grid grid-cols-10">
          <h3 className="brand tracking-wider">FITPLAN</h3>
        </div>

        <div className="px-6 py-5 mr-6 flex-auto">
          <MyNav />
        </div>

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
        <link rel="icon" href="/fitplanIcon.svg" />
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
