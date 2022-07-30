import { ReactNode, PropsWithoutRef, useRef } from "react"
import { Form as FinalForm, FormProps as FinalFormProps } from "react-final-form"
import * as z from "zod"
import { Link } from "blitz"

export { FORM_ERROR } from "final-form"

export interface FormProps<S extends z.ZodType<any, any>>
  extends Omit<PropsWithoutRef<JSX.IntrinsicElements["form"]>, "onSubmit"> {
  /** All your form fields */
  children?: ReactNode
  /** Text to display in the submit button */
  submitText?: string
  /* Text to display in the cancel button*/
  cancelText?: string
  /** URL to page for returning to parent on cancel */
  cancelURL?: string
  schema?: S
  onSubmit: FinalFormProps<z.infer<S>>["onSubmit"]
  onCancel: () => void
  initialValues?: FinalFormProps<z.infer<S>>["initialValues"]
}

export function Form<S extends z.ZodType<any, any>>({
  children,
  submitText,
  cancelText,
  cancelURL,
  schema,
  initialValues,
  onSubmit,
  onCancel,
  ...props
}: FormProps<S>) {
  const a11yRef = useRef(null)
  return (
    <FinalForm
      initialValues={initialValues}
      validate={async (values) => {
        if (!schema) return
        try {
          await schema.parse(values)
        } catch (error) {
          return error.formErrors.fieldErrors
        }
      }}
      onSubmit={onSubmit}
      onCancel={onCancel}
      render={({ handleSubmit, submitting, submitError }) => (
        <form onSubmit={handleSubmit} className="form" {...props}>
          {/* Form fields supplied as children are rendered here */}
          {children}
          {submitError && (
            <div role="alert">
              <p className="error absolute bg-white mb-5 h-2 bottom-28">{submitError}</p>
            </div>
          )}
          <div className="btn-div w-full">
            {submitText && (
              <div>
                <button
                  className="btn save min-w-full"
                  type="submit"
                  disabled={submitting}
                  ref={a11yRef}
                >
                  {submitText}
                </button>
              </div>
            )}

            {cancelText && cancelURL && (
              <div>
                <Link href={`${cancelURL}`}>
                  <button className="btn cancel min-w-full" ref={a11yRef} onClick={onCancel}>
                    <a>{cancelText}</a>
                  </button>
                </Link>
              </div>
            )}
          </div>
        </form>
      )}
    />
  )
}

export default Form
