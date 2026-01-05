// this file is a provider detector that uses the globalThis object to store the different providers that are availble
// based on the environment file .env
// everytime the app starts, it creates an object providersList that stores the different providers that are available
// note that some are mandatory, they are marked optional: false

export const providersList = {
  prisma: {
    name: "Prisma",
    isAvailable: true,
    optional: false,
  },
  googleAuth: {
    name: "Google Auth",
    isAvailable: !!process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_ID !== '',
    optional: false,
  },
  landingPage: {
    name: "Landing Page",
    isAvailable: true,
    optional: false,
  }
}