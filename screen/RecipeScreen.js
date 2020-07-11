import React from 'react';
import { Dimensions, Linking, View, Text, StyleSheet, FlatList } from 'react-native';
import { Button , SearchBar, Overlay, Header } from 'react-native-elements';

const screenWidth = Math.round(Dimensions.get('window').width)
const screenHeight = Math.round(Dimensions.get('window').height)

export default class RecipeScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            search: '',
            loading:false,
            recipeList:[],
            isVisible:false,
            recipe: {
                contributor_id: null,
                description: '',
                id: null,
                ingredients: [],
                minutes: null,
                n_ingredients: null,
                n_steps: null,
                name: '',
                nutrition: [],
                steps: [],
                submitted: '',
                tags: []
            }
        }
    }

    updateSearch = (search) => {
        this.setState({ search:search })
    }
    
    fireSearch = () => {
        const { search } = this.state
        this.setState({ loading:true })
        let url = 'https://api.achronaz.com/recipes/search'
        url += '?foodkeyword='+search+'&apikey=a3f123bd30469f6d6caa8cf1488a237156636e746eddef54b11906d690ddc7a1'
        fetch(url, {method: 'GET'})
        .then(response => response.json())
        .then(response => this.setState({ recipeList:response }))
        .catch(err => console.log(err))
        .finally(()=>this.setState({ loading:false }))
    }

    showRecipeDetails = (id) => {
        const { recipeList } = this.state
        let recipe = recipeList.filter(item => item.id = id)[0]
        this.setState({
            recipe: {
                contributor_id: recipe.contributor_id,
                description: recipe.description,
                id: recipe.id,
                ingredients: JSON.parse(recipe.ingredients.replace(/'/g, '"')),
                minutes: recipe.minutes,
                n_ingredients: recipe.n_ingredients,
                n_steps: recipe.n_steps,
                name: recipe.name,
                nutrition: JSON.parse(recipe.nutrition.replace(/'/g, '"')),
                steps: JSON.parse(recipe.steps.replace(/'/g, '"')),
                submitted: recipe.submitted,
                tags: JSON.parse(recipe.tags.replace(/'/g, '"'))
            },
            isVisible:true
        })
    }
    
    render(){
        const { search, recipe } = this.state
        return (
            <View style={styles.container}> 
                <Header centerComponent={{ text: 'Food Recipe', style: { color: '#000',fontSize:18 } }}
                    containerStyle={{ backgroundColor: '#fbfbfb' }}/>   
                <SearchBar
                    placeholder="food keyword"
                    platform="android"
                    showLoading={this.state.loading}
                    onChangeText={this.updateSearch}
                    onEndEditing={this.fireSearch}
                    value={search} />

                <FlatList
                    data={this.state.recipeList}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.item}>
                            <Text style={styles.title}>{item.name}</Text>
                            <View style={{flexDirection:'row'}}>
                                <Button onPress={() => this.showRecipeDetails(item.id)} title="Details" type="clear" />
                                <Button onPress={() => Linking.openURL('https://www.food.com/recipe/'+item.id)} title="Link" type="clear" />
                            </View>
                        </View>
                    )}/>

                <Overlay isVisible={this.state.isVisible}>
                    <Text style={styles.title}>{recipe.name}</Text>
                    <Text style={styles.content}>{recipe.description}</Text>
                    <Text style={styles.content}>{recipe.tags.join(',')}</Text>
                    <Button onPress={() => this.setState({isVisible:false})} title="Close" />
                </Overlay>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    item: {
        backgroundColor: '#fbfbfb',
        padding: 12,
        marginTop: 8,
        marginHorizontal: 8,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    title: {
      fontSize: 18,
    },
    content: {
        fontSize: 12,
    },
  });
  