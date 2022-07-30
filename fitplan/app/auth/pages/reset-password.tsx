import { Suspense } from "react"
import { BlitzPage, useRouterQuery, Link, useMutation, useRouter } from "blitz"
import Layout from "app/core/layouts/Layout"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import { Form, FORM_ERROR } from "app/core/components/Form"
import { Field } from "react-final-form"
import { ResetPassword } from "app/auth/validations"
import resetPassword from "app/auth/mutations/resetPassword"

const ResetPasswordForUser = () => {
  /* const ResetPasswordPage: BlitzPage = () => { */
  const currentUser = useCurrentUser()
  const query = useRouterQuery()
  const [resetPasswordMutation, { isSuccess }] = useMutation(resetPassword)
  const router = useRouter()

  if (currentUser) {
    return (
      <>
        <main className="py-10 px-0 flex flex-col justify-center items-center">
          <div>
            <div className="modal-card">
              <div className="cardcol">
                <h1 className="pl-0">Change Password for {currentUser.name || "None"}</h1>

                {isSuccess ? (
                  <div>
                    <h2>Password Reset Successfully</h2>
                    <p>
                      Go to the <Link href="/">homepage</Link>
                    </p>
                  </div>
                ) : (
                  <div className="-ml-6">
                    {console.log(query.token as string)}
                    <Form
                      submitText="Confirm"
                      cancelText="Cancel"
                      cancelURL="/"
                      initialValues={{
                        password: "",
                        passwordConfirmation: "",
                        token: query.token as string,
                      }}
                      /* schema={ResetPassword.omit({ token: true })}
                      initialValues={{ password: "", passwordConfirmation: "" }} */
                      onSubmit={async (values) => {
                        try {
                          await resetPasswordMutation(values)
                        } catch (error) {
                          if (error.name === "ResetPasswordError") {
                            return {
                              [FORM_ERROR]: error.message,
                            }
                          } else {
                            return {
                              [FORM_ERROR]:
                                "Sorry, we had an unexpected error. Please try again. " +
                                error.message,
                            }
                          }
                        }
                      }}
                      onCancel={async () => {
                        try {
                          router.back()
                        } catch (error) {
                          console.error(error)
                          return {
                            [FORM_ERROR]: error.toString(),
                          }
                        }
                      }}
                    >
                      <div className="py-6 px-6 mb-6">
                        <div className="">
                          <label className="formfieldlabel">New password</label>
                          <Field
                            component="input"
                            name="password"
                            className="inputbox"
                            aria-required="true"
                            type="password"
                          />
                        </div>

                        <div className="pt-6">
                          <label className="formfieldlabel">Confirm new password</label>
                          <Field
                            component="input"
                            name="passwordConfirmation"
                            className="inputbox"
                            aria-required="true"
                            type="password"
                          />
                        </div>
                      </div>
                    </Form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </>
    )
  } else {
    return (
      <>
        <div className="card-container">
          <div className="modal-card">
            <div className="cardcol">
              <div className="grid grid-cols-1">
                <Link href="/signup">
                  <a className="btn cancel">
                    <strong>Sign Up</strong>
                  </a>
                </Link>
                <Link href="/login">
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

const ResetPasswordPage: BlitzPage = () => {
  return (
    <div>
      <main className="py-10 px-0 flex flex-col justify-center items-center">
        <div className="">
          <Suspense fallback="Loading...">
            <ResetPasswordForUser />
          </Suspense>
        </div>
      </main>
    </div>
  )
}

ResetPasswordPage.getLayout = (page) => <Layout title="Reset Your Password">{page}</Layout>

export default ResetPasswordPage
