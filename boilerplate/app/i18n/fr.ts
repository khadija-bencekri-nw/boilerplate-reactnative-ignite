import type { Translations } from "./en"

const fr: Translations = {
  common: {
    ok: "OK !",
    cancel: "Annuler",
    back: "Retour",
    logOut: "Déconnexion",
    confirm: "",
    errorUnexpectedTitle: "",
    errorUnexpected: "",
    tryAgain: "",
    congrats: "",
    sessionExpired: "",
    sessionExpiredMsg: "",
    proceed: "",
    permissionDenied: "",
    close: "",
    loginAgain: "",
  },
  welcomeScreen: {
    postscript:
      "psst  — Ce n'est probablement pas à quoi ressemble votre application. (À moins que votre designer ne vous ait donné ces écrans, dans ce cas, mettez la en prod !)",
    readyForLaunch: "Votre application, presque prête pour le lancement !",
    exciting: "(ohh, c'est excitant !)",
    letsGo: "Allons-y !",
    continueAs: "",
  },
  errorScreen: {
    title: "Quelque chose s'est mal passé !",
    friendlySubtitle:
      "C'est l'écran que vos utilisateurs verront en production lorsqu'une erreur sera lancée. Vous voudrez personnaliser ce message (situé dans `app/i18n/fr.ts`) et probablement aussi la mise en page (`app/screens/ErrorScreen`). Si vous voulez le supprimer complètement, vérifiez `app/app.tsx` pour le composant <ErrorBoundary>.",
    reset: "RÉINITIALISER L'APPLICATION",
    traceTitle: "Erreur depuis %{name}", // @demo remove-current-line
  },
  emptyStateComponent: {
    generic: {
      heading: "Si vide... si triste",
      content:
        "Aucune donnée trouvée pour le moment. Essayez de cliquer sur le bouton pour rafraîchir ou recharger l'application.",
      button: "Essayons à nouveau",
    },
  },
  errors: {
    invalidEmail: "Adresse e-mail invalide.",
  },
  loginScreen: {
    signIn: "Se connecter",
    enterDetails:
      "Entrez vos informations ci-dessous pour débloquer des informations top secrètes. Vous ne devinerez jamais ce que nous avons en attente. Ou peut-être que vous le ferez ; ce n'est pas de la science spatiale ici.",
    emailFieldLabel: "E-mail",
    passwordFieldLabel: "Mot de passe",
    emailFieldPlaceholder: "Entrez votre adresse e-mail",
    passwordFieldPlaceholder: "Mot de passe super secret ici",
    tapToSignIn: "Appuyez pour vous connecter !",
    hint: "Astuce : vous pouvez utiliser n'importe quelle adresse e-mail et votre mot de passe préféré :)",
    google: "",
    apple: "",
    joinSentence: "",
    errors: {
      authError: "",
      mailError: "",
      mailErrorDesc: "",
    },
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
    subtitle: "Join Theodo’s worktools initiative to get you suited up for your daily tasks.",
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
    userExistsMsg: "An account with this email already exists. Please log in or use another email.",
  },
  dashboardScreen: {
    fetchUserError: "An error occurred while fetching user",
    fetchPurchaseError: "An error occurred while fetching purchases",
    purchasesListTitle: "Purchases",
    purchased: "Purchased",
    noPurchases: "No purchases for this account",
    purchases: "Purchases",
  },
  addProductScreen: {
    congrats: "Congratulations",
    congratsMsg: "Your purchase has been added successfully.",
    goToList: "Go to product List",
    invalidTypes: "Invalid file type",
    invalidTypesDesc: "Only JPEG and PNG are supported.",
    backToForm: "Go back to my form",
    multipleImages: "Add multiple photos",
    qualityNote:
      "Adding more high-resolution photos will help the platform stay consistent and evolve in terms of products imagery.",
    fillForm: "Fill the form before submitting",
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
    rateText:
      "Rating this product will help other Theodoers make the right choice in terms of gear.",
  },
  profileScreen: {
    userInfo: {
      title: "Theodoer information",
      email: "Email",
      password: "Password",
      role: "Role",
    },
    notification: {
      title: "Notifications",
      mail: "Mail notifications",
      approval: "Approval/Refusal notifications",
      actionCheck: "Tick this box if you wish to receive notifications about your order status",
    },
    editInfo: "Edit your info",
  },
  mainTabNavigator: {
    dashboardTab: "Dashboard",
    coworkersTab: "Coworkers",
    getInspiredTab: "Get inspired",
    profileTab: "Profile",
  },
  header: {
    balance: "",
    total: "",
    balanceInfo: "",
    totalInfo: "",
  },
}

export default fr
