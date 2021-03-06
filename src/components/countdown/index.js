import React, {Component} from 'react';
import {Platform} from 'react-native';
import {request, PERMISSIONS} from 'react-native-permissions';
import AsyncStorage from '@react-native-community/async-storage';
import DeviceInfo from 'react-native-device-info';
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
    loading: true,
    playing: false,
    retrieved: false,
    TimeToDeath: Date,
    years: Number,
    days: Number,
    hours: Number,
    minutes: Number,
    seconds: Number,
  };

  componentDidMount() {
    this.askPermission();
    this.getTimeToDeath();
    BackgroundTimer.setTimeout(() => this.playScream(), 30000);
    this.interval = BackgroundTimer.setInterval(() => this.deathTimer(), 1000);
  }

  componentWillUnmount() {
    BackgroundTimer.clearInterval(this.interval);
  }

  askPermission = async () => {
    try {
      if (Platform.OS === 'ios') {
        await request(PERMISSIONS.IOS.CAMERA);
        await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
        await request(PERMISSIONS.IOS.MICROPHONE);
        await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      } else {
        await request(PERMISSIONS.ANDROID.CAMERA);
        await request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);
        await request(PERMISSIONS.ANDROID.RECORD_AUDIO);
        await request(PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION);
      }
      BackgroundTimer.setTimeout(() => this.setState({loading: false}), 2000);
    } catch (err) {
      console.warn('askPermission', err);
    }
  };

  notificationAtt(message) {
    const PushNotification = require('react-native-push-notification');
    PushNotification.localNotification({
      vibration: 1500,
      message,
      soundName: 'scream.mp3',
      largeIcon: 'icon',
      smallIcon: 'ic_stat',
    });
  }

  playScream = () => {
    if (!this.state.playing) {
      this.setState({playing: true});
      const Sound = require('react-native-sound');
      Sound.setCategory('Playback');

      const scream = new Sound('scream.mp3', Sound.MAIN_BUNDLE, () => {
        scream.setVolume(0.5);
        scream.play();
      });
      return this.setState({playing: false});
    }
  };

  randomizeScream = (FinalHour) => {
    if (FinalHour) {
      return Math.floor(Math.random() * 7000);
    }
    return Math.floor(Math.random() * 100000);
  };

  soundCheck = () => {
    const {years, days, minutes, retrieved, seconds} = this.state;
    if (years === 0 && days === 0 && retrieved) {
      if (minutes < 10) {
        if (seconds < 2) {
          BackgroundTimer.setTimeout(async () => {
            this.notificationAtt(':)');

            return BackgroundTimer.clearInterval(this.interval);
          }, 0);
        }
        const time = this.randomizeScream(true);
        const waiting = BackgroundTimer.setTimeout(() => {
          this.playScream();
        }, time);
        return waiting;
      }
      const time = this.randomizeScream();
      const waiting = BackgroundTimer.setTimeout(() => {
        this.playScream();
      }, time);
      return waiting;
    }
  };

  generateDeathTime = async () => {
    try {
      const TimeToDeath = new Date();
      const IdInt = parseInt(DeviceInfo.getUniqueId(), 16);
      let ms;
      if (Platform.OS === 'ios') {
        ms = IdInt * 1000;
      } else {
        ms = IdInt / 10000000;
      }
      while (ms > 1900000000000) {
        ms / 2;
      }
      TimeToDeath.setMilliseconds(TimeToDeath.getMilliseconds() + ms);

      await AsyncStorage.removeItem('@TimeToDeath');
      await AsyncStorage.setItem('@TimeToDeath', JSON.stringify(TimeToDeath));

      this.notificationAtt('Countdown 1.0 is now installed.');
      BackgroundTimer.setTimeout(
        () => this.notificationAtt('User agreement broken'),
        300000,
      );
      this.setState({TimeToDeath, retrieved: true});
    } catch (err) {
      this.generateRandomDeathTime();
      console.warn('generateDeathTime', err);
    }
  };

  getTimeToDeath = async () => {
    try {
      const storage = await AsyncStorage.getItem('@TimeToDeath');
      const TimeToDeath = new Date(JSON.parse(storage));
      BackgroundTimer.setTimeout(
        () => this.notificationAtt('User agreement broken'),
        300000,
      );
      if (storage === null || storage === undefined) {
        throw new Error();
      }
      const now = new Date();
      if (TimeToDeath <= now) {
        BackgroundTimer.clearInterval(this.interval);
        this.setState({seconds: 0, minutes: 0, hours: 0, days: 0, years: 0});
      }

      return this.setState({TimeToDeath, retrieved: true});
    } catch (err) {
      return this.generateDeathTime();
    }
  };

  generateRandomDeathTime = async () => {
    try {
      const Today = new Date();
      const year = Today.getFullYear();
      const month = Today.getMonth();
      const day = Today.getDate();
      const DeathDate = new Date(year + 60, month, day);
      const TimeToDeath = new Date(
        Today.getTime() +
          Math.random() * (DeathDate.getTime() - Today.getTime()),
      );
      await AsyncStorage.removeItem('@TimeToDeath');
      await AsyncStorage.setItem('@TimeToDeath', JSON.stringify(TimeToDeath));

      this.NotificationAtt('Countdown 1.0 is now installed.');
      BackgroundTimer.setTimeout(
        () => this.NotificationAtt('User agreement broken'),
        300000,
      );
      this.setState({TimeToDeath, retrieved: true});
    } catch (err) {
      console.warn('generateRandomDeathTime', err);
    }
  };

  deathTimer = () => {
    this.soundCheck();
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
    if (this.state.loading) {
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
