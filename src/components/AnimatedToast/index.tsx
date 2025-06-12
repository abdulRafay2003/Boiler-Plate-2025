// import React, {useEffect, useRef} from 'react';
// import {
//   Animated,
//   StyleSheet,
//   Text,
//   View,
//   Dimensions,
//   Image,
// } from 'react-native';

// const SCREEN_WIDTH = Dimensions.get('window').width;

// const AnimatedToast = ({
//   type = 'success',
//   message,
//   subMessage,
//   onClose,
// }: any) => {
//   const slideAnim = useRef(new Animated.Value(-100)).current;
//   const opacityAnim = useRef(new Animated.Value(0)).current;
//   const icon =
//     type === 'error'
//       ? require('@/assets/images/icons/exclamination.png')
//       : require('@/assets/images/icons/tick.png');

//   useEffect(() => {
//     // Slide in
//     Animated.parallel([
//       Animated.timing(slideAnim, {
//         toValue: 0,
//         duration: 400,
//         useNativeDriver: true,
//       }),
//       Animated.timing(opacityAnim, {
//         toValue: 1,
//         duration: 300,
//         useNativeDriver: true,
//       }),
//     ]).start();

//     // Slide out after 5 seconds
//     const timer = setTimeout(() => {
//       Animated.parallel([
//         Animated.timing(opacityAnim, {
//           toValue: 0,
//           duration: 300,
//           useNativeDriver: true,
//         }),
//         Animated.timing(slideAnim, {
//           toValue: -100,
//           duration: 400,
//           useNativeDriver: true,
//         }),
//       ]).start(() => {
//         onClose?.(); // Optional callback
//       });
//     }, 5000);

//     return () => clearTimeout(timer);
//   }, []);

//   return (
//     <Animated.View
//       style={[
//         styles.toastContainer,
//         {
//           backgroundColor: type === 'error' ? '#FFCDD2' : '#B2E8C5',
//           transform: [{translateY: slideAnim}],
//           opacity: opacityAnim,
//         },
//       ]}>
//       <View style={styles.circle}>
//         <Image
//           source={icon}
//           style={{
//             width: 20,
//             height: 20,
//             tintColor: type === 'error' && 'red',
//           }}
//           resizeMode="contain"
//         />
//       </View>
//       <View style={styles.textContainer}>
//         <Text style={styles.title}>{message}</Text>
//         <Text style={styles.subtitle}>{subMessage}</Text>
//       </View>
//     </Animated.View>
//   );
// };

// const styles = StyleSheet.create({
//   toastContainer: {
//     position: 'absolute',
//     zIndex: 100,
//     top: 0,
//     marginTop: 10,
//     alignSelf: 'center',
//     width: SCREEN_WIDTH - 40,
//     backgroundColor: '#B2E8C5',
//     padding: 16,
//     borderRadius: 15,
//     flexDirection: 'row',
//     alignItems: 'center',
//     elevation: 5,
//     shadowColor: '#000',
//     shadowOpacity: 0.2,
//     shadowOffset: {width: 1, height: 2},
//     shadowRadius: 4,
//   },
//   circle: {
//     width: 40,
//     height: 40,
//     borderRadius: 100,
//     backgroundColor: 'white',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginRight: 12,
//   },
//   check: {
//     color: 'white',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
//   textContainer: {
//     flex: 1,
//   },
//   title: {
//     fontWeight: 'bold',
//     fontSize: 15,
//     color: '#000',
//   },
//   subtitle: {
//     fontSize: 13,
//     color: '#333',
//     marginTop: 2,
//   },
//   bubbleLarge: {
//     position: 'absolute',
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     backgroundColor: '#A2E3B3',
//     top: -30,
//     left: -30,
//     opacity: 0.3,
//   },
//   bubbleSmall: {
//     position: 'absolute',
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     backgroundColor: '#A2E3B3',
//     bottom: -20,
//     right: -20,
//     opacity: 0.2,
//   },
// });

// export default AnimatedToast;

import React, {useEffect, useRef} from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  PanResponder,
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

const AnimatedToast = ({
  type = 'success',
  message,
  subMessage,
  onClose,
}: any) => {
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const panY = useRef(new Animated.Value(0)).current;

  const icon =
    type === 'error'
      ? require('@/assets/images/icons/exclamination.png')
      : require('@/assets/images/icons/tick.png');

  const dismissToast = () => {
    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => onClose?.());
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => gesture.dy < -10, // Only upward
      onPanResponderMove: (_, gesture) => {
        panY.setValue(gesture.dy);
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dy < -50) {
          dismissToast();
        } else {
          // Reset if swipe wasn't enough
          Animated.spring(panY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    }),
  ).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(dismissToast, 4000);
    return () => clearTimeout(timer);
  }, []);

  const animatedStyle = {
    backgroundColor: type === 'error' ? '#FFCDD2' : '#B2E8C5',
    transform: [{translateY: Animated.add(slideAnim, panY)}],
    opacity: opacityAnim,
  };

  return (
    <Animated.View
      style={[styles.toastContainer, animatedStyle]}
      {...panResponder.panHandlers}>
      <View style={styles.circle}>
        <Image
          source={icon}
          style={{
            width: 20,
            height: 20,
            tintColor: type === 'error' ? 'red' : undefined,
          }}
          resizeMode="contain"
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{message}</Text>
        <Text style={styles.subtitle}>{subMessage}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    zIndex: 100,
    top: 0,
    marginTop: 10,
    alignSelf: 'center',
    width: SCREEN_WIDTH - 40,
    backgroundColor: '#B2E8C5',
    padding: 16,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: {width: 1, height: 2},
    shadowRadius: 4,
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 100,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  check: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#000',
  },
  subtitle: {
    fontSize: 13,
    color: '#333',
    marginTop: 2,
  },
  bubbleLarge: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#A2E3B3',
    top: -30,
    left: -30,
    opacity: 0.3,
  },
  bubbleSmall: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#A2E3B3',
    bottom: -20,
    right: -20,
    opacity: 0.2,
  },
});

export default AnimatedToast;
