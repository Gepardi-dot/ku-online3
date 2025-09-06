import Link from 'next/link'

export default function AuthCodeError() {
  return (
    <div className="flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Authentication Error
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          There was an error signing you in. Please try again.
        </p>
        <div className="mt-6 text-center">
          <Link
            href="/auth"
            className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
          >
            Go back to sign in
          </Link>
        </div>
      </div>
    </div>
  )
}