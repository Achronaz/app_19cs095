# install react native, android studio and android debug bridge(adb)
```
https://reactnative.dev/docs/environment-setup
https://developer.android.com/studio
https://developer.android.com/studio/command-line/adb
```
# run on android devices
```
adb devices
git clone https://github.com/Achronaz/app_19cs095
cd app_19cs095
npm install

# download project zip folder instead of clone + npm install
# if the node_modules are broken

cd android && gradlew clean
cd .. && react-native run-android
```
# clean
```
cd android
gradlew clean
```
# build
```
cd android
gradlew assembleRelease     # build app-debug.apk
gradlew bundleRelease       # build app-debug.apk and app-release.apk
```
# adb uninstall
```
adb uninstall com.app_19cs095
```
