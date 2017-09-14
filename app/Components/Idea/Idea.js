import React, { Component } from "react";
import {
  AppRegistry,
  AsyncStorage,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View
} from "react-native";
import styles from "./styles";

class Idea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: this.props.idea.title || "",
      body: this.props.idea.body || "",
      wordCountVisible: false,
      focusedField: null
    };
    this.updateIdeaValue = this.updateIdeaValue.bind(this);
    this.deleteIdea = this.deleteIdea.bind(this);
    this.bodyFieldFocus = this.bodyFieldFocus.bind(this);
    this.bodyFieldWordCount = this.bodyFieldWordCount.bind(this);
  }

  updateIdeaValue(key) {
    this.setState({ focusedField: null, wordCountVisible: false });

    //Check if entered value has not changed from default value
    if (this.state[key] === "" && this.props.idea[key] == null) {
      return;
    }
    // Update idea based on updated field value
    this.props.update(this.props.idea, key, this.state[key]);
  }

  deleteIdea() {
    this.props.delete(this.props.idea);
  }

  bodyFieldFocus() {
    // Display character count on focus if < 15 characters remain
    this.setState({
      wordCountVisible: this.state.body.length > 125 ? true : false,
      focusedField: "body"
    });
  }

  bodyFieldWordCount(text) {
    // Hide when remaining character count >15, display when <15
    let remaining_count = 140 - text.length;
    let remaining_count_visible =
      (this.state.wordCountVisible && remaining_count < 16) ||
      (!this.state.wordCountVisible && remaining_count < 15) ||
      false;
    this.setState({
      body: text,
      wordCountVisible: remaining_count_visible
    });
  }

  render() {
    return (
      <View style={[styles.ideaBox]}>
        <TextInput
          autoCorrect={false}
          autoFocus={
            this.props.isLastIdea && this.state.title === "" ? true : false
          }
          onBlur={() => this.updateIdeaValue("title")}
          onChangeText={title => this.setState({ title: title })}
          onFocus={field => this.setState({ focusedField: "title" })}
          onSubmitEditing={event => {
            this.refs.bodyField.focus();
          }}
          placeholder="Enter title..."
          ref="titleField"
          returnKeyType={"next"}
          style={[
            styles.ideaTextField,
            this.state.focusedField === "title" ? styles.ideaFieldFocused : null
          ]}
          underlineColorAndroid="transparent"
          value={this.state.title}
        />

        <TextInput
          autoCorrect={false}
          maxLength={140}
          multiline={true}
          numberOfLines={4}
          onChangeText={this.bodyFieldWordCount}
          onEndEditing={() => this.updateIdeaValue("body")}
          onFocus={this.bodyFieldFocus}
          placeholder="Enter content..."
          ref="bodyField"
          style={[
            styles.ideaTextArea,
            this.state.focusedField === "body" ? styles.ideaFieldFocused : null
          ]}
          underlineColorAndroid="transparent"
          value={this.state.body}
        />

        <View style={styles.ideaFooter}>
          <TouchableHighlight
            onPress={this.deleteIdea}
            style={styles.deleteButton}
          >
            <Text style={styles.deleteButtonText}>Delete Idea</Text>
          </TouchableHighlight>
          <View style={styles.characterCountBox}>
            {this.state.wordCountVisible ? (
              <Text style={styles.characterCount}>
                {this.state.body.length}
              </Text>
            ) : null}
          </View>
        </View>
      </View>
    );
  }
}

export default Idea;
