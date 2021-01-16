import i18n from "i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import { initReactI18next } from "react-i18next"

const resources = {
  ja: {
    translation: {
      "Dark Mode": "ダーク",
      "Hello,world!": "こんにちWORLD初めもして！",
      "Light Mode": "ライト",
      "Sign Up": "新規登録",
      "This is the microblogging community. Publish anything you want: text, links, picture.":
        "匿名のミニブログのサービスです。テキストや画像、URLなど、あなたの投稿したいものを投稿してください。",
      "Welcome to React": "Welcome to React and react-i18next!",
      Email: "メールアドレス",
      Home: "ホーム",
      Login: "ログイン",
      Messages: "DM",
      Notifications: "通知",
      Password: "パスワード",
      Profile: "プロフィール",
      Settings: "設定",
      Stream: "ストリーム",
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
