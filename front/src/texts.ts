// Static Texts

export const txtHeader = {
  title: "OchaCoder's SignIn System",
}

export const txtGeneral = {
  greetingUser: "Welcome back, ",
  greetingGuest: "Welcome, guest.",
  signUp: "Sign Up",
  signIn: "Sign In",
  signOut: "Sign Out",
  cancel: "Cancel",
  name: "Name",
  email: "Email",
  password: "Password",
  confirmPassword: "Confirm password",
  resetPassword: "Reset password",
  deleteAccount: "Delete Account",
  update: "Update",
}

export const txtErr = {
  code403: "Forbidden: Unauthorized request",
  code500: "Unexpected Error.",
  userOffline: "You are offline. Check your internet connection.",
  frontDown: "The server is unreachable. Please try again later.",
  backDown: "The server is unreachable. Please try again later.",
}

export const txtTip = {
  call: {
    noAccount: `Don't have an account?`,
    joinNow: `Join now!`,
    clickHere: `Click here`,
    forgotPassword: `If you have forgotten your password,`,
    alreadyHasAccount: `Already have an account?`,
  },
  inputHelper: {
    name: { empty: `Please enter your name.` },
    email: {
      empty: `Please enter your email.`,
      invalid: `Please enter a valid email address.`,
    },
    password: { empty: `Please enter your password.`, invalid: `Please enter a valid password.` },
    confirmPassword: { empty: `Please confirm your password.`, noMatch: "Password is not matching." },
  },
  password: {
    title: "Password must include:",
    tipLength: "At least 8 characters",
    tipLetter: "At least one letter (A-Z, a-z)",
    tipNumber: "At least one number (0-9)",
    tipSpecial: "At least one special character (! @ # $ % & … )",
  },
}
