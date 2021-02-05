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
      Update: "更新",
      "Please enter an email address.": "メールアドレスを入力してください",
      Name: "名前",
      Biography: "自己紹介",
      "Web site": "ウェブサイト",
      "Icon Image": "アイコン画像",
      "Header Image": "ヘッダー画像",
      Upload: "タップしてアップロード",
      Images: "画像",
      Image: "画像",
      Submit: "送信",
      "Succeeded in updating": "更新しました",
      Logout: "ログアウトする",
      "Only image files are allowed.": "アップロードできないファイルです。",
      "File size exceeds 2 MiB": "画像サイズが大き過ぎます。",
      "Remove images": "画像取り消し",
      "What's happening?": "いまどうしてる？",
      "The Push API is supported": "このデバイスはPush通知に対応していません。",
      "Failed to send a test notificaiton.": "テスト通知の送信に失敗しました",
      "Test notificaiton": "テスト",
      "Turn off push notifications": "通知をオフにする",
      "Turn on push notifications": "通知をオンにする",
      "Changes have bee saved": "変更が保存されました",
      "This feature does not support iOS devices.":
        "この機能はiOS端末をサポートしていません。",
      "Only one device can use this feature. If you have already set it on another device, turn it off once.":
        "通知を設定できるデバイスは一つのみです。他のデバイスで設定したい場合は、一度オフにしてください。",
      "Get push notifications to find out what’s going on when you’re not on Flitz. You can turn them off anytime.":
        "この機能をオンにすると、Flitzアプリを開いていない時でも、通知を受け取ることができます。また、この機能はいつでもオフにできます。",
      "Logout Success": "ログアウトしました",
      Username: "ユーザーID",
      "※Username can't be duplicated.": "※ユーザーIDは重複できません。",
      Change: "変更",
      Passowrd: "パスワード",
      "Current Password": "現在のパスワード",
      "New Password": "新しいパスワード",
      Account: "アカウント",
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
