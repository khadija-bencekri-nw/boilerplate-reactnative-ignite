const en = {
  common: {
    ok: "OK!",
    cancel: "Cancel",
    confirm: "Confirm",
    back: "Back",
    logOut: "Log Out", // @demo remove-current-line
    errorUnexpected: "An error has occured, please try again",
    tryAgain: "Try again",
    congrats: "Congratulations",
    sessionExpired: "Session Expired",
    sessionExpiredMsg: "Your session has expired. Please log in again.",
    proceed: "Proceed",
    permissionDenied: "Permission Denied"
  },
  welcomeScreen: {
    postscript:
      "psst  — This probably isn't what your app looks like. (Unless your designer handed you these screens, and in that case, ship it!)",
    readyForLaunch: "Your app, almost ready for launch!",
    exciting: "(ohh, this is exciting!)",
    letsGo: "Let's go!", // @demo remove-current-line
  },
  errorScreen: {
    title: "Something went wrong!",
    friendlySubtitle:
      "This is the screen that your users will see in production when an error is thrown. You'll want to customize this message (located in `app/i18n/en.ts`) and probably the layout as well (`app/screens/ErrorScreen`). If you want to remove this entirely, check `app/app.tsx` for the <ErrorBoundary> component.",
    reset: "RESET APP",
    traceTitle: "Error from %{name} stack", // @demo remove-current-line
  },
  emptyStateComponent: {
    generic: {
      heading: "So empty... so sad",
      content: "No data found yet. Try clicking the button to refresh or reload the app.",
      button: "Let's try this again",
    },
  },
  // @demo remove-block-start
  errors: {
    invalidEmail: "Invalid email address.",
  },
  loginScreen: {
    signIn: "Sign In",
    enterDetails:
      "Enter your details below to unlock top secret info. You'll never guess what we've got waiting. Or maybe you will; it's not rocket science here.",
    emailFieldLabel: "Email",
    passwordFieldLabel: "Password",
    emailFieldPlaceholder: "Enter your email address",
    passwordFieldPlaceholder: "Super secret password here",
    tapToSignIn: "Tap to sign in!",
    hint: "Hint: you can use any email address and your favorite password :)",
    google: "Continue with Google",
    apple: "Continue with Apple",
    joinSentence: "Don’t have an account? Sign up",
    errors:{
      authError: "Email or password is incorrect."
    }
  },
  signUpScreen: {
    headline: "Account informations",
    step1: "step 1  of 2",
    step2: "step 2  of 2",
    fullName: "Full name",
    next: "Next, your personal informations",
    headline2: "Personal information",
    pickRole: "Pick a role",
    developer: "Full-Stack Developer",
    techLead: "Tech Lead",
    chooseDate: "Start date",
    startdate: "Choose a starting date",
    balance: "Available balance",
    create: "Create my account",
    back: "Back, my account informations",
    firstHeadline: "Curated tools",
    secondHeadline: "to gear you up!",
    subtitle: "Join Nimbleway’s worktools initiative to get you suited up for your daily tasks.",
    join: "Join",
    signIn: "Sign In",
    Errors: {
      emailRequired: "Email is required.",
      emailNotValid: "Enter a valid email address.",
      pwdRequired: "Password is required.",
      pwdNotValid: "Password must be at least 6 characters.",
    },
    selectRole: "Please select a role.",
    pickDate: "Please pick a date.",
    userExistsMsg: "An account with this email already exists. Please log in or use another email."
  },
  dashboardScreen:{
    fetchUserError: "An error occurred while fetching user",
    fetchPurchaseError: "An error occurred while fetching purchases",
  },
  productScreen: {
    brand: "Brand",
    model: "Model",
    store: "Store",
    purchaseDate: "Purchase Date",
    price: "Price",
    purchased: "✓ Purchased",
    invoiceMedia: "Invoice and media",
    review: "Review",
    rateAction: "How would you rate this product?",
    rateText: "Rating this product will help other Theodoers make the right choice in terms of gear."
  },
  profileScreen: {
    userInfo: {
      title: "Theodoer information",
      email: "Email",
      password: "Password",
      role: "Role"
    },
    notification: {
      title: "Notifications",
      mail: "Mail notifications",
      approval: "Approval/Refusal notifications",
      actionCheck: "Tick this box if you wish to receive notifications about your order status"
    }
  },   
  mainTabNavigator: {
    dashboardTab: "Dashboard",
    coworkersTab: "Coworkers",
    getInspiredTab: "Get inspired",
    profileTab: "Profile",
  },
}

export default en
export type Translations = typeof en
