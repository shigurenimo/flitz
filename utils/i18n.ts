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
      Email: "メールアドレス",
      Home: "ホーム",
      Login: "ログイン",
      Messages: "DM",
      Notifications: "通知",
      Password: "パスワード",
      Profile: "プロフィール",
      Settings: "設定",
      Stream: "ストリーム",
      Update: "更新する",
      "Please enter an email address.": "メールアドレスを入力してください",
      Name: "名前",
      Biography: "自己紹介",
      "Web site": "ウェブサイト",
      "Icon Image": "アイコン画像",
      "Header Image": "ヘッダー画像",
      Upload: "タップしてアップロード",
      Images: "画像",
      "Succeeded in updating": "更新しました",
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
