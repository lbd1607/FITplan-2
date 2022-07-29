import { useMutation, useRouter } from "blitz"
import { Form, FORM_ERROR } from "app/core/components/Form"
import { Field } from "react-final-form"
import signup from "app/auth/mutations/signup"
import { Signup } from "app/auth/validations"

type SignupFormProps = {
  onSuccess?: () => void
}

export const SignupForm = (props: SignupFormProps) => {
  const [signupMutation] = useMutation(signup)
  const router = useRouter()

  return (
    <div>
      <div className="modal-card">
        <div className="cardcol">
          <h1 className="pl-0">Create an Account</h1>
          <div className="-ml-6">
            <Form
              submitText="Create Account"
              schema={Signup}
              initialValues={{ email: "", password: "" }}
              onSubmit={async (values) => {
                try {
                  await signupMutation(values)
                  props.onSuccess?.()
                } catch (error: any) {
                  if (error.code === "P2002" && error.meta?.target?.includes("email")) {
                    // This error comes from Prisma
                    return { email: "This email is already being used" }
                  } else {
                    return { [FORM_ERROR]: error.toString() }
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
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignupForm
