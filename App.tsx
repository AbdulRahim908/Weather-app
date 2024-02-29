import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View,ImageBackground,Image} from 'react-native';
import * as Location from 'expo-location';
import ForecastItem from './components/forecaststyle';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Stack } from 'expo-router';


//https://api.openweathermap.org/data/2.5/weather?lat=28.4636&lon=16.2518&appid=eba74a3ef7d5ecb8a1c2acf759c1b602

const Base_url=`https://api.openweathermap.org/data/2.5`;
const Weather_Api_key=`eba74a3ef7d5ecb8a1c2acf759c1b602`;
const bgImage='https://images.unsplash.com/photo-1564754943164-e83c08469116?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
type MainWeather={
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  sea_level: number;
  grnd_level: number;
}
type Weather={
  name: String;
  main: MainWeather;
  sys:Country;
  weather: [
    {
      id: number,
      main: String,
      description: String,
      icon: String
    }
  ],
  
};
type Country={
   type: number,
    id: number,
    country: String,
    sunrise: number,
    sunset: number
}

export type WeatherForecast={
  dt:number;
  main: MainWeather;

}

const  App=()=> {
  const [fontsLoaded, fontError] = useFonts({
    'Inter-Black': require('./assets/fonts/InterBlack.otf'),
  });
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);
  const [weather,setWeather]=useState<Weather>();
  const [forecast,setForecast]=useState<WeatherForecast[]>();
  // const [icon,setIcon]=useState<Iconuse[]>();
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  useEffect(() => {
    (async () => {
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      console.log('Location: ',location)
      setLocation(location);
    })();
  }, []);
  useEffect(()=>{
    if(location){
      fetchweather();
      fetchforecast();
      // fetchIcon();
    };
  },[location]);
  const fetchweather=async()=>{

    if(!location){
      return;
    };
    const result=await fetch(`${Base_url}/weather?lat=${location.coords.latitude}&lon=${location.coords.longitude}&appid=${Weather_Api_key}&units=metric`);
    const data =await result.json();
    // console.log(JSON.stringify(data,null,2));
    setWeather(data);
    //fetch data
  };
  const fetchforecast=async()=>{
    //api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
    if(!location){
      return;
    };
    // const numberofdays=5;
    const result=await fetch(`${Base_url}/forecast/?lat=${location.coords.latitude}&lon=${location.coords.longitude}&appid=${Weather_Api_key}&units=metric`);
    const data =await result.json();
    // console.log(JSON.stringify(data,null,2));
    setForecast(data.list)
  };
  // const fetchIcon=async()=>{
  //   //http://openweathermap.org/img/w/${weather.weather.icon}.png
  //   if(!location){
  //     return;
  //   };
  //   const result=await fetch(`http://openweathermap.org/img/w/${weather.weather.icon}.png`);
  //   const data =await result.json();
  //   // console.log(JSON.stringify(data,null,2));
  //   setIcon(data.list)
  // }

 
  if (!weather){
    return <ActivityIndicator/>;
  }



  return (
    <ImageBackground source={{uri:bgImage}} style={styles.container}>
      <View
        style={{...StyleSheet.absoluteFillObject,
        backgroundColor:'rgba(0,0,0,0.5)'}}
        />
     {/* <Stack.Screen options={{headerShown:false}} /> */}
     <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
     <View> 
      <Image  style={{ width: 50, height: 50 }} source={{uri:`https://openweathermap.org/img/w/${weather.weather[0].icon}.png`}}
      onLoad={() => console.log('Image loaded')}
      onError={(e) => console.log('Image load error', e.nativeEvent.error)}
      /> 

       </View>
       {/* <Text style={styles.location}>{weather.weather1.icon}</Text> */}
       
     <Text style={styles.location}>{weather.name},{weather.sys.country}</Text>
      <Text style={styles.temp}>{Math.round(weather.main.temp)}°  </Text>
      <Text style={styles.extra}>Feels like  {Math.round(weather.main.feels_like)}°  </Text>
      <Text style={styles.extra}>Humidity  {Math.round(weather.main.humidity)}%  </Text>
      </View>

      <FlatList
      style={{flexGrow:0,height:200,marginBottom:40}}
      data={forecast}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{gap:10,paddingHorizontal:10}}
      renderItem={({item})=><ForecastItem forecast={item}/>} 
      />
      <StatusBar style="auto" />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  location:{
    // fontFamily:'Intersemi',
    fontWeight:'600',
    fontSize:40,
    color:'white'
    
  },
  temp:{
    fontFamily:'Inter-Black',
    fontSize:90,
    color:'snow'
  },
  extra:{
    fontSize:25,
    color:'white'
    ,fontWeight:'300'

  }
});
export default App;