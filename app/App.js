import React, { Component } from "react";
import {
  AppRegistry,
  AsyncStorage,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import styles from "./styles";
import Idea from "./Components/Idea";

let API_URL = "http://ideaapi.neverodd.co.uk";
//let API_URL = "http://localhost:3000";

export default class IdeaBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ideas: [],
      notificationMessage: "",
      notificationVisible: false,
      notificationError: false,
      sortOrder: "Date"
    };
    this.fetchIdeas = this.fetchIdeas.bind(this);
    this.sortIdeas = this.sortIdeas.bind(this);
    this.createIdea = this.createIdea.bind(this);
    this.deleteIdea = this.deleteIdea.bind(this);
    this.updateIdea = this.updateIdea.bind(this);
    this.showNotification = this.showNotification.bind(this);
  }

  componentWillMount() {
    // Check for ideas in AsyncStorage
    AsyncStorage.getItem("ideas")
      .then(req => JSON.parse(req))
      .then(json =>
        this.setState({
          ideas: json
        })
      );

    // Fetch latest ideas from API
    this.fetchIdeas();
  }

  fetchIdeas() {
    fetch(API_URL + "/ideas", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => {
        console.log(response);
        if (response.ok) {
          response.json().then(json => {
            this.setState(
              {
                ideas: json
              },
              function() {
                AsyncStorage.setItem("ideas", JSON.stringify(json));
              }
            );
          });
        } else {
          this.showNotification("Unable to fetch ideas from API.", true);
        }
      })
      .catch(
        function(error) {
          console.log(error);
          this.showNotification(
            "Unable to fetch ideas from API. Please check network.",
            true
          );
        }.bind(this)
      );
  }

  sortIdeas() {
    let sort_parameter =
      this.state.sortOrder === "Date" ? "title" : "created_at";
    console.log(sort_parameter);
    // Sort ideas based on sort_parameter
    let sorted_ideas = this.state.ideas.sort(
      (a, b) =>
        a[sort_parameter] && b[sort_parameter]
          ? a[sort_parameter].localeCompare(b[sort_parameter])
          : 0
    );
    console.log(sorted_ideas);
    this.setState({
      ideas: sorted_ideas,
      sortOrder: this.state.sortOrder === "Date" ? "Name" : "Date"
    });
  }

  createIdea() {
    // Fetch new idea from the API
    fetch(API_URL + "/ideas/new", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => {
        if (response.ok) {
          response.json().then(json => {
            // Add newly created idea to ideas array
            let newIdea = Object.assign({}, json, {
              title: null,
              body: null
            });
            this.setState(
              {
                ideas: [...this.state.ideas, newIdea]
              },
              function() {
                AsyncStorage.setItem("ideas", JSON.stringify(this.state.ideas));
              }
            );
          });
        } else {
          this.showNotification("Unable to create idea.", true);
        }
      })
      .catch(
        function(error) {
          this.showNotification(
            "Unable to create idea. Please check network.",
            true
          );
        }.bind(this)
      );
  }

  updateIdea(idea, key, value) {
    if (value !== idea[key]) {
      let index = this.state.ideas
        .map(function(i) {
          return i.id;
        })
        .indexOf(idea.id);
      fetch(API_URL + "/idea/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id: idea.id,
          title: key === "title" ? value : idea.title,
          body: key === "body" ? value : idea.body
        })
      })
        .then(response => {
          if (response.ok) {
            // Update idea with newly saved value
            let updatedIdea = Object.assign({}, this.state.ideas[index], {
              [key]: value
            });
            // Replace updated idea in ideas array
            this.setState(
              {
                ideas: [
                  ...this.state.ideas.slice(0, index),
                  updatedIdea,
                  ...this.state.ideas.slice(index + 1)
                ]
              },
              function() {
                AsyncStorage.setItem("ideas", JSON.stringify(this.state.ideas));
                this.showNotification("Idea successfully updated.");
              }
            );
          } else {
            this.showNotification("Unable to update idea.", true);
          }
        })
        .catch(
          function(error) {
            this.showNotification(
              "Unable to update idea. Please check network.",
              true
            );
          }.bind(this)
        );
    }
  }

  deleteIdea(idea) {
    fetch(API_URL + "/idea/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id: idea.id
      })
    })
      .then(response => {
        if (response.ok) {
          // Remove idea from ideas array
          this.setState(
            {
              ideas: this.state.ideas.filter(function(i) {
                return i.id !== idea.id;
              })
            },
            function() {
              AsyncStorage.setItem("ideas", JSON.stringify(this.state.ideas));
              this.showNotification("Idea successfully deleted.");
            }
          );
        } else {
          this.showNotification("Unable to delete idea.", true);
        }
      })
      .catch(
        function(error) {
          this.showNotification(
            "Unable to delete idea. Please check network.",
            true
          );
        }.bind(this)
      );
  }

  showNotification(message, isError) {
    this.setState(
      {
        notificationVisible: true,
        notificationMessage: message,
        notificationError: isError || false
      },
      function() {
        if (this._timer != null) {
          clearTimeout(this._timer);
        }
        this._timer = setTimeout(
          function() {
            this.setState({ notificationVisible: false });
          }.bind(this),
          3000
        );
      }
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.topBar}>
          <TouchableHighlight
            onPress={this.sortIdeas}
            style={styles.topBarButton}
            underlayColor="transparent"
          >
            <Text style={styles.topBarButtonText}>
              &#9660; {this.state.sortOrder}
            </Text>
          </TouchableHighlight>
          <Text style={[styles.topBarHeading, styles.H1]}>Idea Board</Text>
          <TouchableHighlight
            onPress={this.createIdea}
            style={styles.topBarButton}
            underlayColor="transparent"
          >
            <Text style={styles.topBarButtonText}>Add Idea</Text>
          </TouchableHighlight>
        </View>

        <KeyboardAwareScrollView
          style={styles.ideasContainerScroll}
          contentContainerStyle={[styles.ideasContainer]}
        >
          {this.state.ideas.map(function(idea, index) {
            return (
              <Idea
                key={idea.id}
                idea={idea}
                delete={this.deleteIdea}
                update={this.updateIdea}
                isLastIdea={index + 1 === this.state.ideas.length}
              />
            );
          }, this)}
        </KeyboardAwareScrollView>
        {this.state.notificationVisible && (
          <View
            style={[
              styles.notificationBox,
              this.state.notificationError ? styles.notificationError : null
            ]}
          >
            <Text style={styles.notificationText}>
              {this.state.notificationMessage}
            </Text>
          </View>
        )}
      </View>
    );
  }
}
