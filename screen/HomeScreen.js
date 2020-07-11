import React from 'react'
import { 
    Alert,
    Image,
    View, 
    Text,
    Dimensions,
    TouchableOpacity,
    ActivityIndicator,
    Modal,
    StyleSheet
 } from 'react-native'
import ImagePicker from 'react-native-image-picker'
import Canvas, {Image as CanvasImage} from 'react-native-canvas'

import { Icon, Header } from 'react-native-elements'

const options = {
    title: 'Select Image',
    storageOptions: {
        skipBackup: true,
        path: 'images'
    }
}

const screenWidth = Math.round(Dimensions.get('window').width)
const screenHeight = Math.round(Dimensions.get('window').height)

export default class HomeScreen extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            photo:null,
            imageWidth:screenWidth,
            imageHeight:screenHeight - 175,
            scaleRatio:1,
            predictions:[],
            waitingResponse: false
        }
        this.canvas = React.createRef()
    }

    scaleImage = (rotate=false) => {
        const { width, height } = this.state.photo

        let scaleRatio = width > screenWidth ? screenWidth / width : 1

        //handle image height out of screen height
        if(height * scaleRatio > (screenHeight - 175)){
            scaleRatio = height / (screenHeight - 175)
        }

        this.setState({  
            imageWidth: width * scaleRatio,
            imageHeight: height * scaleRatio,
            scaleRatio: scaleRatio
        }, () => { this.resetCanvas() })
    }

    launchCamera = () => {
        ImagePicker.launchCamera(options, (response) => {
            if (response.uri) {
                this.setState({ photo: response, predictions:[] },() => { this.scaleImage(true) })
            }
        })
    }

    launchImageLibrary = () => {
        ImagePicker.launchImageLibrary(options, response => {
            if (response.uri) {
              this.setState({ photo: response, predictions:[] },() => { this.scaleImage() })
            }
        })
    }

    handleLabelClick = (event) => {
        x = event.nativeEvent.locationX
        y = event.nativeEvent.locationY
        const { predictions,scaleRatio } = this.state
        //console.log(x+","+y)
        for(let i=0; i < predictions.length; i++){
            let pred = predictions[i]
            x1 = scaleRatio * pred.x1
            y1 = scaleRatio * pred.y1
            x2 = scaleRatio * pred.x2
            y2 = scaleRatio * pred.y2
            if(x >= x1 && x <= x2 && y >= y1 && y <= y2){
                console.log(pred.label+","+pred.prob)
                //naviagte to other screen
                return
            }
        }
    }

    getPredictions = () => {
        if(this.state.photo != null){
            let self = this
            this.setState({waitingResponse:true})
            let formData  = new FormData()
            formData.append('image',{
                uri:this.state.photo.uri,
                name:this.state.photo.fileName,
                type:this.state.photo.type
            })
            formData.append('apikey','a3f123bd30469f6d6caa8cf1488a237156636e746eddef54b11906d690ddc7a1')
            fetch('https://api.achronaz.com/darknet/detect',{ method: 'POST', body: formData })
            .then(response => response.json())
            .then(response => self.setState({ predictions:response }))
            .catch(error => console.log("ERROR:"+error))
            .finally(()=>{
                this.setState({waitingResponse:false})
                this.handleCanvas()
            })
        } else {
            Alert.alert("Error", "No Photo Selected.",[
                { text: "Cancel", onPress: () => console.log("Cancel Pressed"),style: "cancel" },
                { text: "OK", onPress: () => console.log("OK Pressed") }
            ],{ cancelable: false })
        }
    }

    resetCanvas = () => {
        this.setState({predictions:[]})
        const canvas = this.canvas.current
        canvas.width = this.state.imageWidth
        canvas.height = this.state.imageHeight
    }

    handleCanvas = () => {

        const { predictions,scaleRatio,imageWidth,imageHeight } = this.state
        const canvas = this.canvas.current
        const context = canvas.getContext('2d')
        canvas.width = imageWidth
        canvas.height = imageHeight
        context.strokeStyle = 'green'
        context.lineWidth = 2
        context.fillStyle = 'yellow'

        for(let i=0; i < predictions.length; i++){
            pred = predictions[i]
            x1 = scaleRatio * pred.x1
            y1 = scaleRatio * pred.y1
            x2 = scaleRatio * pred.x2
            y2 = scaleRatio * pred.y2
            context.strokeRect(x1, y1, x2-x1, y2-y1)
            context.fillText(pred.label + "("+ parseFloat(pred.prob).toFixed(2) +")", x1+2, y1+8)
        }

    }
    
    componentDidMount(){
        this.handleCanvas();
    }

    render(){
        const photo = this.state.photo || require('../assets/placeholder.jpg');
        return (
        <View style={{flexDirection:'column', overflow:'scroll'}}>
            <Header centerComponent={{ text: 'Bounding Box Detection', style: { color: '#000',fontSize:18 } }}
                    containerStyle={{ backgroundColor: '#fbfbfb' }}/>
            <TouchableOpacity onPress={(event) => this.handleLabelClick(event)}
                    style={{
                        width:this.state.imageWidth,
                        height:this.state.imageHeight}} >
                <Image 
                    source={{ uri: photo.uri }} 
                    style={{
                        resizeMode:'cover',
                        width:this.state.imageWidth,
                        height:this.state.imageHeight,
                        position:'absolute'}}/>
                <Canvas 
                    ref={this.canvas} 
                    style={{
                        position:'absolute'}}/>
            </TouchableOpacity>
            <View style={{flexDirection:'row', justifyContent:'space-around'}}>
                <Icon onPress={() => this.launchImageLibrary()} raised name='ios-images' type='ionicon'/>
                <Icon onPress={() => this.getPredictions()} raised name='ios-cloud-upload' type='ionicon'/>
                <Icon onPress={() => this.resetCanvas()} raised name='ios-trash' type='ionicon'/>
            </View>
            <Modal animationType="fade" visible={this.state.waitingResponse} transparent={true}>
                <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)'}}>
                <ActivityIndicator size="large" color="#ffffff" />
                    <Text style={{fontSize:24, color: '#fff'}}> Loading ... </Text>
                </View>
            </Modal>
        </View>
        );
    }
    //<Icon onPress={() => this.launchCamera()} raised name='ios-camera' type='ionicon'/>
}

const styles = StyleSheet.create({})