import { View, Text, SafeAreaView, StatusBar, Image, TextInput, Touchable, TouchableOpacity, ScrollView } from 'react-native'
import React,{ useCallback, useEffect, useState } from 'react'
import theme from '../theme'
import{MagnifyingGlassIcon, MapIcon}from 'react-native-heroicons/outline'
import{CalendarDaysIcon, MapPinIcon}from 'react-native-heroicons/solid'
import{debounce} from 'lodash'
import{fetchLocations, fetchWeatherForecast} from '../api/weather'
import { weatherImages } from '../constants'
import * as Progress from 'react-native-progress'

const HomeScreen = () => {
  const [showSearch, toggleSearch] = useState(false);
  const [locations, setLocations] = useState([]);
  const [weather, setWeather] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const handleLocation = (loc) =>{
    console.log('location: ',loc);
    setLocations([]);
    toggleSearch(false);
    setLoading(true);
    fetchWeatherForecast({
      cityName: loc.name,
      days: '7'
    }).then(data=>{
      setWeather(data);
      setLoading(false);
  console.log('got forecast: ',data);
    })
  }

  const handleSearch =value=>{
    //Fetch locations
    if(value.length>2){
      fetchLocations({cityName: value}).then(data=>{
        setLocations(data);
      }
      )
    } 
   
  }
  useEffect(()=>{
    fetchMyWeatherData();
  },[]);
 const fetchMyWeatherData = async ()=>{
  fetchWeatherForecast({
    cityName: 'London',
    days: '7'
  }
  ).then(data=>{
    setWeather(data);
    setLoading(false);
    //console.log('got forecast',data);
  })
 }
 const handleTextDebounce = useCallback(debounce(handleSearch, 1200), []);

 const {current, location} = weather;

  return (
    <View style={{ flex: 1, position: 'relative' }}>
      <StatusBar style="light" />
      <Image blurRadius={20} source={require('../assets/Wallpaper.jpg')} style={{ position: 'absolute', height: '100%', width: '100%' }} />
      {
          loading? (
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Progress.CircleSnail thickness={10} size={100} color= "white"/>
            </View> 
          ):(
            <SafeAreaView style={{ flex: 1, position: 'relative' }}>
        
            {/* search section */}
            <View style={{ height: '10%',width: '90%',left:18, marginHorizontal: 4, position: 'relative', zIndex: 50 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', borderRadius: 999, backgroundColor: showSearch? theme.bgWhite(0.3): 'transparent' }}>
                {
                  showSearch? (
                    <TextInput
                    onChangeText={handleTextDebounce}
                  placeholder='Search City'
                  placeholderTextColor='darkslategray'
                  style={{ paddingLeft: 6, height: 40, width:20, flex: 1, fontSize: 18, color: 'darkslategray' }}
                />
                  ):null
                }
                
                <TouchableOpacity onPress={() => toggleSearch(!showSearch)} style ={{backgroundColor: theme.bgWhite(0.3), padding:12, margin:4,width: 40, height: 40, borderRadius:20}}>
                <MagnifyingGlassIcon style={{size:25, color:'darkslategray', top:-3, left:-3}}/> 
                </TouchableOpacity>
              </View>
              {
                locations.length > 0 && showSearch ? (
                  <View style={{ position: 'absolute', width: '100%', top: 50, marginVertical: 10 }}>
                    <View style={{ backgroundColor: 'white', borderRadius: 20, paddingVertical: 10 }}>
                      {
                        locations.map((loc, index) => {
                          let showBorder = index + 1 !== locations.length;
                          let borderStyles = showBorder ? { borderBottomWidth: 2, borderBottomColor: 'lightgray' } : {};
                          return (
                            <TouchableOpacity
                              onPress={() => handleLocation(loc)}
                              key={index}
                              style={{ flexDirection: 'row', alignItems: 'center', padding: 3, paddingHorizontal: 4, marginBottom: index !== locations.length - 1 ? 1 : 0, marginVertical: 7, ...borderStyles }}
                            >
                              <MapPinIcon style={{ size: 20, color: 'gray' }} />
                              <Text style={{ color: 'black', fontSize: 18, marginLeft: 8 }}>{loc?.name},{loc?.country}</Text>
                            </TouchableOpacity>
                          );
                        })
                      }
                    </View>
                  </View>
        ) : null}
      </View>
      {/*forecast section*/}
       <View style={{marginHorizontal: 4,flexDirection: 'row',justifyContent: 'space-around', flex: 1,marginBottom: 2,}}>
      {/*location*/}
      <Text style={{width:201 ,color: 'white', fontSize: 24,fontWeight: 'bold',textAlign: 'center', left:160, top:-10}}>
          {location?.name},
          <Text style={{fontSize: 18, color: '#ccc', fontWeight: 'bold',textAlign: 'center'}}>
            {" "+location?.country}
          </Text>
      </Text>
       {/*Weather Image*/}
      <View style={{flexDirection: 'row', justifyContent: 'center',position:'absolute',top: 20, left: 20 }}>
          <Image style={{width:200, height:200, top:80, left:75}}source={weatherImages[current?.condition?.text]}/>
      </View>
      {/*Degree celcius*/}
      <View style={{marginVertical: 8, alignItems:'center'}}>
          <Text style={{marginLeft:140,textAlign: 'center',fontWeight: 'bold',color: 'white',fontSize: 48,marginTop: 310}}>
            {current?.temp_c}°
          </Text>
          <Text style={{ marginLeft: 130, textAlign: 'center', letterSpacing: 2,color: 'white',fontSize: 20,marginTop:20}}>
            {current?.condition?.text}
          </Text>
      </View>
      {/*other stats*/}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 4, }}>
         <View style={{flexDirection: 'row', alignItems: 'center', marginHorizontal: 2, }}>
         <Image style={{width:60, height:50, top:230, left:-120, }} source={require('../assets/windspeedicon.png')}/>
         <Text style={{color: 'white', fontWeight: 'bold', fontSize: 16, top: 230, left: -128 }}>
            {current?.wind_kph}km
         </Text>
         </View>
         <View style={{flexDirection: 'row', alignItems: 'center', marginHorizontal: 2, }}>
         <Image style={{width:60, height:50, top:230, left:-90, }} source={require('../assets/raindropicon.png')}/>
         <Text style={{color: 'white', fontWeight: 'bold', fontSize: 16, top: 230, left: -100 }}>
            {current?.humidity}%
         </Text>
         </View>
         <View style={{flexDirection: 'row', alignItems: 'center', marginHorizontal: 2, }}>
         <Image style={{width:60, height:50, top:230, left:-65, }} source={require('../assets/sunicon.png')}/>
         <Text style={{color: 'white', fontWeight: 'bold', fontSize: 16, top: 230, left: -70 }}>
            {weather?.forecast?.forecastday[0]?.astro?.sunrise}
         </Text>
         </View>
      </View>
       </View>
    
       {/*forecast for the next days*/}
       <View style={{marginBottom: 8, marginTop: 12}}>
        <View style={{flexDirection: 'row', alignItems: 'center', marginHorizontal: 5, justifyContent: 'space-between'}}>
            <CalendarDaysIcon style={{left:20,size:40,color:"white",top:-20}} />
            <Text style={{color:"white",fontSize: 16, left:-250, top:-20}}>
              Daily forecast
            </Text>
        </View>
        <ScrollView horizontal
         contentContainerStyle={{ paddingHorizontal: 15 }}
         showsHorizontalScrollIndicator={false}>
          {
            weather?.forecast?.forecastday?.map((item, index)=>{
              let date = new Date(item.date);
              let options = {weekday: 'long'};
              let dayName=date.toLocaleDateString('en-US',options);
              dayName= dayName.split(',')[0]
                return (
                  <View key={index}
                     style={{backgroundColor:theme.bgWhite(0.3),flexDirection: 'column',justifyContent: 'center',alignItems: 'center',height:120,width: 90,borderRadius: 12, paddingVertical: 3,paddingHorizontal: 0, marginEnd: 4, marginTop: 0,  marginBottom: 0, marginLeft: 0 }}>
                    <Image style={{width:90, height:80}} source={weatherImages[item?.day?.condition?.text]}/>
                    <Text style={{color:"white"}}>{dayName}</Text>
                    <Text style={{color:"white", fontWeight:"bold"}}>{item?.day?.avgtemp_c}°</Text>
                 </View>
                )
             } )
          }
          
        </ScrollView>
       </View>
    </SafeAreaView>
          )
        }
    
</View>
);
};

export default HomeScreen;