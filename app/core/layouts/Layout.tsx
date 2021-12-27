import { Head, BlitzLayout, Link, useMutation, useRouter, Router, Routes } from "blitz"
import React, { ReactNode, Suspense, useRef, useEffect, useState, Component } from "react"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import logout from "app/auth/mutations/logout"
import { v4 as uuid } from "uuid"
import Modal from "react-modal"

Modal.setAppElement("#__next")

/* Set nav links to active when route == path for active styling */
export const MyNav = () => {
  const router = useRouter()
  const currentUser = useCurrentUser()
  if (currentUser) {
    return (
      <>
        <ul className="">
          <li className={router.asPath == "/" ? "active" : ""}>
            <Link href={Routes.Home()}>Home</Link>
          </li>
          <li className={router.asPath == "/workouts" ? "active" : ""}>
            <Link href={Routes.WorkoutsPage()}>Workouts</Link>
          </li>
          <li className={router.asPath == "/exercises" ? "active" : ""}>
            <Link href={Routes.ExercisesPage()}>Exercises</Link>
          </li>
          <li className={router.asPath == "/plans" ? "active" : ""}>
            <Link href={Routes.PlansPage()}>Plans</Link>
          </li>
        </ul>
      </>
    )
  } else {
    return (
      <>
        {" "}
        <div className="py-5 px-24 flex-auto"></div>
      </>
    )
  }
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
      return <Link href={Routes.Home()} />
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
            <Link href={Routes.Home()}>
              <a
                className="logout-link itemrow-dark flex w-full border-transparent"
                onClick={async () => {
                  await logoutMutation()
                }}
              >
                Log out
              </a>
            </Link>
            <Link href={Routes.Profile()}>
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
        <Suspense fallback="">
          <div className="px-6 py-5 mr-6 flex-auto">
            <MyNav />
          </div>
        </Suspense>

        <Suspense fallback="Loading...">
          <Avatar />
        </Suspense>
      </div>
    )
  }
}

const Layout: BlitzLayout<{ title?: string }> = ({ title, children }) => {
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
