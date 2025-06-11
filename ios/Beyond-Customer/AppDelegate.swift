import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import GoogleMaps
import Firebase
import AVFoundation
import FBSDKCoreKit

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
  var window: UIWindow?

  var reactNativeDelegate: ReactNativeDelegate?
  var reactNativeFactory: RCTReactNativeFactory?

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    // Set audio session category for background playback
        do {
          try AVAudioSession.sharedInstance().setCategory(.playback, mode: .default, options: [])
        } catch {
          print("Failed to set audio session category: \(error)")
        }

        // Configure Firebase
      FirebaseApp.configure()
    ApplicationDelegate.shared.application(
          application,
          didFinishLaunchingWithOptions: launchOptions
        )
     GMSServices.provideAPIKey("AIzaSyB6Exy0gBgnHuqPa3CMzfQrlK3ujiU8nBU")
    let delegate = ReactNativeDelegate()
    let factory = RCTReactNativeFactory(delegate: delegate)
    delegate.dependencyProvider = RCTAppDependencyProvider()

    reactNativeDelegate = delegate
    reactNativeFactory = factory

    window = UIWindow(frame: UIScreen.main.bounds)

    factory.startReactNative(
      withModuleName: "Beyond-Customer",
      in: window,
      launchOptions: launchOptions
    )

    return true
  }
  func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey : Any] = [:]) -> Bool {
      // Facebook login URL handler
      return ApplicationDelegate.shared.application(app, open: url, options: options)
    }
}

class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {
  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }

  override func bundleURL() -> URL? {
#if DEBUG
    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
}
