import {
  request,
  PERMISSIONS,
  RESULTS,
  openSettings,
  checkMultiple,
} from 'react-native-permissions';
import {Platform, Linking, Alert} from 'react-native';

export enum PermissionResult {
  GRANTED = 'granted',
  DENIED = 'denied',
  BLOCKED = 'blocked',
}

const openSettingsPrompt = (type: string): Promise<boolean> =>
  new Promise(resolve => {
    Alert.alert(
      'Permission Blocked',
      `Permission for ${type} is blocked. Would you like to open settings to grant the permission?`,
      [
        {text: 'Cancel', style: 'cancel', onPress: () => resolve(false)},
        {
          text: 'Open Settings',
          onPress: () => {
            Platform.OS === 'ios' ? openSettings() : Linking.openSettings();
            resolve(true);
          },
        },
      ],
      {cancelable: false},
    );
  });

const handleError = (type: string, error: any): PermissionResult => {
  console.error(`Error requesting ${type} permission:`, error);
  Alert.alert(
    'Permission Error',
    `An error occurred while requesting ${type} permission.`,
    [{text: 'OK', onPress: () => Linking.openSettings()}],
    {cancelable: false},
  );
  return PermissionResult.DENIED;
};

import type {Permission} from 'react-native-permissions';

async function requestSinglePermission(
  permission: Permission,
  type: string,
): Promise<PermissionResult> {
  try {
    const result = await request(permission);

    switch (result) {
      case RESULTS.GRANTED:
        console.log(`${type} permission granted`);
        return PermissionResult.GRANTED;

      case RESULTS.DENIED:
        console.log(`${type} permission denied`);
        return PermissionResult.DENIED;

      case RESULTS.BLOCKED:
        console.log(`${type} permission blocked`);
        await openSettingsPrompt(type);
        return PermissionResult.BLOCKED;

      default:
        return PermissionResult.DENIED;
    }
  } catch (error) {
    return handleError(type, error);
  }
}

export async function requestMicrophonePermission(): Promise<PermissionResult> {
  const permission =
    Platform.OS === 'ios'
      ? PERMISSIONS.IOS.MICROPHONE
      : PERMISSIONS.ANDROID.RECORD_AUDIO;
  return requestSinglePermission(permission, 'Microphone');
}

export async function requestCameraPermission(): Promise<PermissionResult> {
  const permission =
    Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA;
  return requestSinglePermission(permission, 'Camera');
}

export async function requestSpeechRecognitionPermission(): Promise<PermissionResult> {
  const permission =
    Platform.OS === 'ios'
      ? PERMISSIONS.IOS.SPEECH_RECOGNITION
      : PERMISSIONS.ANDROID.RECORD_AUDIO;
  return requestSinglePermission(permission, 'Speech Recognition');
}

export async function checkMicrophoneAndSpeechPermissions(): Promise<
  PermissionResult[]
> {
  const micPermission =
    Platform.OS === 'ios'
      ? PERMISSIONS.IOS.MICROPHONE
      : PERMISSIONS.ANDROID.RECORD_AUDIO;
  const speechPermission =
    Platform.OS === 'ios'
      ? PERMISSIONS.IOS.SPEECH_RECOGNITION
      : PERMISSIONS.ANDROID.RECORD_AUDIO;

  try {
    const results = await checkMultiple([micPermission, speechPermission]);
    const output: PermissionResult[] = [];

    for (const [index, permission] of [
      micPermission,
      speechPermission,
    ].entries()) {
      const type = index === 0 ? 'Microphone' : 'Speech Recognition';
      const result = results[permission];

      switch (result) {
        case RESULTS.GRANTED:
          output.push(PermissionResult.GRANTED);
          break;
        case RESULTS.DENIED:
          output.push(PermissionResult.DENIED);
          break;
        case RESULTS.BLOCKED:
          output.push(PermissionResult.BLOCKED);
          await openSettingsPrompt(type);
          break;
        default:
          output.push(PermissionResult.DENIED);
      }
    }

    return output;
  } catch (error) {
    return [
      handleError('Microphone/Speech', error),
      handleError('Speech', error),
    ];
  }
}
