# Release [app-release.apk](https://drive.google.com/file/d/1E8_T7slY_GdZLLX0R2FSWFenXDRrKp_k/view?usp=sharing)
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

# download project zip folder instead of clone + npm install if the node_modules are broken
# https://drive.google.com/file/d/1DUzbVSt6g-WMClTqyGSm5MgxUXV8H_Bm/view?usp=sharing

cd android && gradlew clean
cd .. && react-native run-android
```
# build
```
cd android
gradlew assembleRelease     # build app-debug.apk and app-release.apk
gradlew bundleRelease       # build app-debug.apk
# you can find the apk file in "app_19cs095\android\app\build\outputs\apk" 
```
# adb uninstall
```
# sometime, you need to uninstall old version before running on debug mode
adb uninstall com.app_19cs095
```
