#生成签名
keytool -genkey -alias app.keystore -keyalg RSA -validity 40000 -keystore app.keystore

#APK签名
jarsigner -verbose -keystore app.keystore -signedjar 商户端.apk platforms\android\build\outputs\apk\android-release-unsigned.apk app.keystore

#输入密钥库的密码短语
zrwc_app
