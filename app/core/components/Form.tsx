import { ReactNode, PropsWithoutRef, useRef } from "react"
import { Form as FinalForm, FormProps as FinalFormProps } from "react-final-form"
import * as z from "zod"
import { Link } from "blitz"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import "@fortawesome/fontawesome-svg-core/styles.css"

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
          {submitError && (
            <div role="alert">
              <div className="error h-3 my-2">
                <FontAwesomeIcon
                  icon={"arrow-down"}
                  size="1x"
                  className="ml-4 mr-2 text-orange-500 "
                />
                {submitError}
              </div>
            </div>
          )}
          {/* Form fields supplied as children are rendered here */}
          {children}

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
