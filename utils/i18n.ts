import i18n from "i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import { initReactI18next } from "react-i18next"

const resources = {
  ja: {
    translation: {
      "Welcome to React": "Welcome to React and react-i18next!",
      "Hello,world!": "こんにちWORLD初めもして！",
      "This is the microblogging community. Publish anything you want: text, links, picture.":
        "匿名のミニブログのサービスです。テキストや画像、URLなど、あなたの投稿したいものを投稿してください。",
      Settings: "設定",
      Profile: "プロフィール",
      Messages: "DM",
      Notifications: "通知",
      Home: "ホーム",
      Stream: "ストリーム",
      Email: "メールアドレス",
      Password: "パスワード",
      "Sign Up": "新規登録",
      Login: "ログイン",
    },
  },
}

i18n.use(LanguageDetector).use(initReactI18next).init({
  fallbackLng: false,
  keySeparator: false,
  nsSeparator: false,
  resources,
})

export default i18n
