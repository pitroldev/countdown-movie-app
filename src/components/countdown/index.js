import React, {Component} from 'react';
// import {PermissionsAndroid} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {
  View,
  LoadingView,
  Text,
  RedText,
  Row,
  LittleText,
  LittleRedText,
} from './styles.js';
import BackgroundTimer from 'react-native-background-timer';
import {UIActivityIndicator} from 'react-native-indicators';

class CountdownTimer extends Component {
  state = {
    loading: false,
    TimeToDeath: Date,
    playing: false,
    retrieved: false,
    years: 0,
    days: 0,
    hours: 10,
    minutes: 25,
    seconds: 19,
  };

  componentDidMount() {
    // this.AskPermission();
    BackgroundTimer.setTimeout(() => this.setState({loading: true}), 2000);
    this.getTimeToDeath();
    BackgroundTimer.setTimeout(() => this.playScream(), 10000);
    this.interval = BackgroundTimer.setInterval(() => this.EndTime(), 1000);
  }

  // AskPermission = async () => {
  //   try {
  //     const camera = await PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.CAMERA,
  //     );
  //     const microphone = await PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
  //     );
  //     const location = await PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
  //     );
  //     if (
  //       camera === PermissionsAndroid.RESULTS.GRANTED &&
  //       microphone === PermissionsAndroid.RESULTS.GRANTED &&
  //       location === PermissionsAndroid.RESULTS.GRANTED
  //     ) {
  //       console.log('Camera permission top');
  //       this.setState({loading: true});
  //     } else {
  //       console.log('Camera permission denied');
  //       await AsyncStorage.removeItem('@TimeToDeath');
  //       this.getTimeToDeath();
  //     }
  //   } catch (err) {
  //     console.warn(err);
  //   }
  // };

  NotificationAtt(message) {
    const PushNotification = require('react-native-push-notification');

    PushNotification.localNotification({
      vibration: 1500,
      message,
      soundName: 'scream.mp3',
    });
  }

  componentWillUnmount() {
    BackgroundTimer.clearInterval(this.interval);
  }

  playScream = () => {
    const Sound = require('react-native-sound');
    Sound.setCategory('Playback');

    const scream = new Sound('scream.mp3', Sound.MAIN_BUNDLE, () => {
      scream.setVolume(0.5);
      scream.play();
    });
    return this.setState({playing: false});
  };

  randomScreamTime = (FinalHour) => {
    if (FinalHour) {
      return Math.floor(Math.random() * 5000);
    }
    return Math.floor(Math.random() * 100000);
  };

  checkTimeToSound = () => {
    const {years, days, playing, hour, retrieved} = this.state;
    if (years === 0 && days === 0 && !playing && !retrieved) {
      console.log('is close');
      if (hour === 0) {
        console.log('final hour');
        const time = this.randomScreamTime(true);
        this.setState({playing: true});
        const waiting = BackgroundTimer.setTimeout(() => {
          this.playScream();
        }, time);
        return waiting;
      }
      const time = this.randomScreamTime();
      this.setState({playing: true});
      const waiting = BackgroundTimer.setTimeout(() => {
        this.playScream();
      }, time);
      return waiting;
    }
  };

  getTimeToDeath = async () => {
    try {
      const storage = await AsyncStorage.getItem('@TimeToDeath');
      const TimeToDeath = new Date(JSON.parse(storage));
      BackgroundTimer.setTimeout(
        () => this.NotificationAtt('User agreement broken'),
        600000,
      );
      if (storage === null || storage === undefined) {
        throw new Error();
      }
      return this.setState({TimeToDeath, retrieved: true});
    } catch (err) {
      const Today = new Date();
      const year = Today.getFullYear();
      const month = Today.getMonth();
      const day = Today.getDate();
      const EndDate = new Date(year + 60, month, day);
      const TimeToDeath = new Date(
        Today.getTime() + Math.random() * (EndDate.getTime() - Today.getTime()),
      );
      await AsyncStorage.removeItem('@TimeToDeath');
      await AsyncStorage.setItem('@TimeToDeath', JSON.stringify(TimeToDeath));

      this.NotificationAtt('Countdown 1.0 is now installed.');
      BackgroundTimer.setTimeout(
        () => this.NotificationAtt('User agreement broken'),
        300000,
      );
      this.setState({TimeToDeath, retrieved: true});
      // return await this.AskPermission();
    }
  };

  EndTime = () => {
    this.checkTimeToSound();
    const now = new Date();
    const {TimeToDeath} = this.state;
    const distance = TimeToDeath.getTime() - now.getTime();
    const years = TimeToDeath.getFullYear() - now.getFullYear();
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const days = Math.floor((distance / (1000 * 60 * 60 * 24)) % 365);
    return this.setState({seconds, minutes, hours, days, years});
  };

  Years = () => {
    if (this.state.years === 0) {
      return (
        <Row>
          <RedText>{'0' + this.state.years}</RedText>
          <LittleRedText>YRS</LittleRedText>
        </Row>
      );
    }
    return (
      <Row>
        <Text>
          {this.state.years > 9 ? this.state.years : '0' + this.state.years}
        </Text>
        <LittleText>YRS</LittleText>
      </Row>
    );
  };

  Days = () => {
    if (this.state.years === 0) {
      if (this.state.days === 0) {
        return (
          <Row>
            <RedText>{'0' + this.state.days}</RedText>
            <LittleRedText>DAY</LittleRedText>
          </Row>
        );
      }
    }
    return (
      <Row>
        <Text>
          {this.state.days > 9 ? this.state.days : '0' + this.state.days}
        </Text>
        <LittleText>DAY</LittleText>
      </Row>
    );
  };

  Hours = () => {
    if (this.state.years === 0) {
      if (this.state.days === 0) {
        if (this.state.hours === 0) {
          return (
            <Row>
              <RedText>{'0' + this.state.hours}</RedText>
              <LittleRedText>HRS</LittleRedText>
            </Row>
          );
        }
      }
    }
    return (
      <Row>
        <Text>
          {this.state.hours > 9 ? this.state.hours : '0' + this.state.hours}
        </Text>
        <LittleText>HRS</LittleText>
      </Row>
    );
  };

  Minutes = () => {
    if (this.state.years === 0) {
      if (this.state.days === 0) {
        if (this.state.hours === 0) {
          if (this.state.minutes === 0) {
            return (
              <Row>
                <RedText>{'0' + this.state.minutes}</RedText>
                <LittleRedText>MIN</LittleRedText>
              </Row>
            );
          }
        }
      }
    }
    return (
      <Row>
        <Text>
          {this.state.minutes > 9
            ? this.state.minutes
            : '0' + this.state.minutes}
        </Text>
        <LittleText>MIN</LittleText>
      </Row>
    );
  };

  Seconds = () => {
    if (this.state.years === 0) {
      if (this.state.days === 0) {
        if (this.state.hours === 0) {
          if (this.state.minutes === 0) {
            if (this.state.seconds === 0) {
              return (
                <Row>
                  <RedText>{'0' + this.state.seconds}</RedText>
                  <LittleRedText>SEC</LittleRedText>
                </Row>
              );
            }
          }
        }
      }
    }
    return (
      <Row>
        <Text>
          {this.state.seconds > 9
            ? this.state.seconds
            : '0' + this.state.seconds}
        </Text>
        <LittleText>SEC</LittleText>
      </Row>
    );
  };

  render() {
    if (!this.state.loading) {
      return (
        <LoadingView>
          <UIActivityIndicator color="#bbb" />
        </LoadingView>
      );
    }
    return (
      <View>
        {this.Years()}
        {this.Days()}
        {this.Hours()}
        {this.Minutes()}
        {this.Seconds()}
      </View>
    );
  }
}

export default CountdownTimer;