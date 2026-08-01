# Zubba Frontend

Expo React Native starter project with TypeScript, React Navigation, Redux Toolkit, and a scalable folder structure.

## Stack

- Expo
- TypeScript
- React Navigation
- Redux Toolkit

## Scripts

- `npm run start`
- `npm run android`
- `npm run ios`
- `npm run web`
- `npm run typecheck`

## Structure

- `src/components`
- `src/screens`
- `src/navigation`
- `src/store`
- `src/slices`
- `src/hooks`
- `src/types`
- `assets`

## Notes

The project is scaffolded with placeholder screens and reusable primitives. UI implementation from screenshots will be added in the next phase.


## Port forwarding on android
1. Connect data transfer cable between your android to the pc
2. ```npx expo prebuild --clean```
3. ```npx expo run:android```

## Build android apk
1. ```cd android```
2. ```./gradlew clean --no-daemon```
2. ```./gradlew assembleRelease --no-daemon```
- Apk in android/app/bulid/outputs/apk/release/**.apk
