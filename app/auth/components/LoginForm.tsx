import { AuthenticationError, Link, useMutation, Routes, PromiseReturnType, useRouter } from "blitz"
import { Form, FORM_ERROR } from "app/core/components/Form"
import { Field } from "react-final-form"
import login from "app/auth/mutations/login"
import { Login } from "app/auth/validations"

type LoginFormProps = {
  onSuccess?: (user: PromiseReturnType<typeof login>) => void
}

export const LoginForm = (props: LoginFormProps) => {
  const router = useRouter()
  const [loginMutation] = useMutation(login)

  return (
    <div className="grid justify-center w-fit mx-auto">
      <div className="modal-card">
        <div className="cardcol">
          <h1 className="pl-0">Sign In</h1>
          <div className="-ml-6">
            <Form
              submitText="Login"
              schema={Login}
              initialValues={{ email: "", password: "" }}
              onSubmit={async (values) => {
                try {
                  const user = await loginMutation(values)
                  props.onSuccess?.(user)
                } catch (error: any) {
                  if (error instanceof AuthenticationError) {
                    return { [FORM_ERROR]: "Sorry, those credentials are invalid" }
                  } else {
                    return {
                      [FORM_ERROR]:
                        "Sorry, we had an unexpected error. Please try again. - " +
                        error.toString(),
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
              <div className="py-6 px-6">
                <div className="">
                  <label className="formfieldlabel required-field">Email</label>
                  <Field
                    component="input"
                    name="email"
                    className="inputbox"
                    aria-required="true"
                    type="email"
                  />
                </div>
                <div className="pt-6">
                  <label className="formfieldlabel required-field">Password</label>
                  <Field
                    component="input"
                    name="password"
                    className="inputbox"
                    aria-required="true"
                    type="password"
                  />
                </div>

                <div className="pb-4 pt-2">
                  <Link href={Routes.ForgotPasswordPage()}>
                    <a className="cursor-pointer underline text-blue-500 hover:text-blue-700 ">
                      Forgot your password?
                    </a>
                  </Link>
                </div>
              </div>
            </Form>
          </div>

          <div>
            Or{" "}
            <Link href={Routes.SignupPage()}>
              <span className="cursor-pointer underline text-blue-500 hover:text-blue-700">
                Sign Up
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginForm
