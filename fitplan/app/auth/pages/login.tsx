import { useRouter, BlitzPage } from "blitz"
import Layout from "app/core/layouts/Layout"
import { LoginForm } from "app/auth/components/LoginForm"

const LoginPage: BlitzPage = () => {
  const router = useRouter()

  return (
    <div>
      <main className="py-10 px-0 flex flex-col justify-center items-center">
        <div className="w-3/12">
          <LoginForm
            onSuccess={() => {
              const next = (router.query.next as string) ?? "/"
              router.push(next)
            }}
          />
        </div>
      </main>
    </div>
  )
}

LoginPage.redirectAuthenticatedTo = "/"
LoginPage.getLayout = (page) => <Layout title="Log In">{page}</Layout>

export default LoginPage
