import React from 'react'
import { Dimensions, View, Text, StyleSheet, Platform } from 'react-native'
import MapView, { PROVIDER_GOOGLE, Callout } from 'react-native-maps'
import { SearchBar, Header } from 'react-native-elements'
import { Marker } from 'react-native-maps'

import Geolocation from '@react-native-community/geolocation'
import { request, PERMISSIONS } from 'react-native-permissions'

const screenWidth = Math.round(Dimensions.get('window').width)
const screenHeight = Math.round(Dimensions.get('window').height)

export default class MapScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          foodkeyword: '',
          loading:false,
          initialPosition:{
            latitude: 22.344499199999998,
            longitude: 114.15388159999999,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121
          },
          results:[]
        }
    }

    updateSearch = (foodkeyword) => {
      this.setState({ foodkeyword })
    }

    fireSearch = () => {
      const { foodkeyword,initialPosition } = this.state
      this.setState({ loading:true })
      let url = 'https://api.achronaz.com/place/search'
      url += `?foodkeyword=${foodkeyword}&latlng=${initialPosition.latitude},${initialPosition.longitude}&radius=${500}`
      url += '&apikey=a3f123bd30469f6d6caa8cf1488a237156636e746eddef54b11906d690ddc7a1'
      fetch(url, {method: 'GET'})
      .then(response => response.json())
      .then(response => this.setState({ results:response.results }))
      .catch(err => console.log(err))
      .finally(()=>this.setState({ loading:false }))
    }

    requestLocationPermission = async () => {
      if(Platform.OS === 'ios'){
        let response = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
        console.log('iPhone '+response)
        if(response === 'granted'){
          this.locateCurrentPosition();
        }
      } else {
        let response = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
        console.log('Android '+response)
        if(response === 'granted'){
          this.locateCurrentPosition();
        }
      }
    }

    locateCurrentPosition = () => {
      Geolocation.getCurrentPosition(
        (position) => {
            console.log(position)
            let initialPosition = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              latitudeDelta: 0.015,
              longitudeDelta: 0.0121,
            }
            this.setState({initialPosition})
        },
        (error) => console.log(new Date(), error),
        {enableHighAccuracy: false, timeout: 10000, maximumAge: 3000}
      )
    }

    render(){
      const { foodkeyword,loading,initialPosition } = this.state

      let markers = this.state.results.map(place => (
        <Marker
          key={place.id}
          coordinate={{
            latitude: place.geometry.location.lat,
            longitude: place.geometry.location.lng,
          }}
          title={place.name}
          description={place.formatted_address}
        />
      ))

      return (
          <View>
            <Header centerComponent={{ text: 'Restaurant Location', style: { color: '#000',fontSize:18 } }}
                    containerStyle={{ backgroundColor: '#fbfbfb' }}/>   
            <SearchBar
                    placeholder="food keyword"
                    onChangeText={this.updateSearch}
                    onEndEditing={this.fireSearch}
                    platform="android"
                    showLoading={loading}
                    value={foodkeyword}
                    color="#fbfbfb" />
            <View style={styles.container}>
              <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                region={initialPosition}>
                  {markers}
              </MapView>
            </View>
          </View>
          
        )
    }

    componentDidMount(){
      this.requestLocationPermission()
    }
}

const styles = StyleSheet.create({
    container: {
      //...StyleSheet.absoluteFillObject,
      height: screenHeight-300,
      width: screenWidth,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    map: {
      ...StyleSheet.absoluteFillObject,
    },
});