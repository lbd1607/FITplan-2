import { Suspense } from "react"
import { Link, BlitzPage, useMutation, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import logout from "app/auth/mutations/logout"
import LoadingAnimation from "app/core/components/LoadingAnimation"

const UserInfo = () => {
  const currentUser = useCurrentUser()
  const [logoutMutation] = useMutation(logout)

  if (currentUser) {
    return (
      <>
        <div className="modal-card">
          <div className="cardcol">
            <p className="formfieldlabel">
              Username: <span className="font-bold">{currentUser.name ?? "None"}</span>
            </p>
            <p className="formfieldlabel">
              Email: <span className="font-bold">{currentUser.email ?? "None"}</span>
            </p>
            <p className="formfieldlabel">
              Password: <span className="font-bold">{"**********" ?? "None"}</span>
            </p>
            <div className="px-8 pb-6">
              <Link href={Routes.ResetPasswordPage()}>
                <a className="cursor-pointer text-blue-500 underline hover:text-blue-700 ">
                  Change password
                </a>
              </Link>
            </div>

            <p className="formfieldlabel">
              Role:{" "}
              <span className="font-bold capitalize">
                {currentUser.role.toLowerCase() ?? "None"}
              </span>
            </p>
            <div className="grid grid-cols-2 gap-8 px-8">
              <button
                className="btn save w-full"
                onClick={async () => {
                  await logoutMutation()
                }}
              >
                Log out
              </button>
              {/* <button className="btn cancel w-full">
                <Link href="/ForgotPasswordPage">Change Password</Link>
              </button> */}
              <button className="btn cancel w-full">
                <Link href={Routes.Home()}>Cancel</Link>
              </button>
            </div>
          </div>
        </div>
      </>
    )
  } else {
    return (
      <>
        <div className="card-container">
          <div className="modal-card">
            <div className="cardcol">
              <div className="grid grid-cols-1">
                <Link href={Routes.SignupPage()}>
                  <a className="btn cancel">
                    <strong>Sign Up</strong>
                  </a>
                </Link>
                <Link href={Routes.LoginPage()}>
                  <a className="btn save">
                    <strong>Login</strong>
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }
}

const Profile: BlitzPage = () => {
  return (
    <div>
      <main className="flex flex-col items-center justify-center py-10 px-0">
        <div className="">
          <Suspense fallback={<LoadingAnimation />}>
            <UserInfo />
          </Suspense>
        </div>
      </main>
    </div>
  )
}

Profile.suppressFirstRenderFlicker = true
Profile.getLayout = (page) => <Layout title="Home">{page}</Layout>

export default Profile
