import React from 'react'

const Unauthorized = () => {
  return (
    <div className="py-10 bg-white font-serif">
      <section className="flex justify-center items-center">
        <div className="w-full max-w-4xl px-4">
          <div className="text-center">
            <div
              className="h-[400px] bg-center bg-cover flex items-center justify-center"
              style={{
                backgroundImage:
                  "url('https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif')",
              }}
            >
              <h1 className="text-6xl font-bold text-center">404</h1>
            </div>

            <div className="mt-[-50px]">
              <h3 className="text-2xl font-semibold mb-4">
                Looks like you're lost
              </h3>
              <p className="mb-6 text-gray-600">
                The page you are looking for is not available!
              </p>
              <a
                href="/"
                className="inline-block px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
              >
                Go to Home
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Unauthorized