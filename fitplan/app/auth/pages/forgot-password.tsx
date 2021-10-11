import { BlitzPage, useMutation, useRouter } from "blitz"
import Layout from "app/core/layouts/Layout"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import { Form, FORM_ERROR } from "app/core/components/Form"
import { ForgotPassword } from "app/auth/validations"
import forgotPassword from "app/auth/mutations/forgotPassword"
import { Field } from "react-final-form"

const ForgotPasswordPage: BlitzPage = () => {
  const [forgotPasswordMutation, { isSuccess }] = useMutation(forgotPassword)
  const router = useRouter()

  return (
    <main className="py-10 px-0 flex flex-col justify-center items-center">
      <div>
        <div className="modal-card">
          <div className="cardcol">
            <h1 className="pl-0">Forgot your password?</h1>

            {isSuccess ? (
              <div>
                <h2>Request Submitted</h2>
                <p>
                  If your email is in our system, you will receive instructions to reset your
                  password shortly.
                </p>
              </div>
            ) : (
              <div className="-ml-6">
                <Form
                  submitText="Send Password Reset"
                  schema={ForgotPassword}
                  initialValues={{ email: "" }}
                  onSubmit={async (values) => {
                    try {
                      await forgotPasswordMutation(values)
                    } catch (error) {
                      return {
                        [FORM_ERROR]: "Sorry, we had an unexpected error. Please try again.",
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
                  <div className="py-6 px-6">
                    <div className="">
                      <label className="formfieldlabel">Email</label>
                      <Field
                        component="input"
                        name="email"
                        className="inputbox"
                        aria-required="true"
                        type="email"
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
  )
}

ForgotPasswordPage.redirectAuthenticatedTo = "/"
ForgotPasswordPage.getLayout = (page) => <Layout title="Forgot Your Password?">{page}</Layout>

export default ForgotPasswordPage
