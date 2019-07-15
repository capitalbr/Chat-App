import React from "react";

import { scrollTo } from "../../util/frontend_util";
import CampaignMessageIndexContainer from "../messages/campaign_message_index_container.js";
class CampaignShow extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      loaded: false,
      currentUser: null,
      userChar: null,
      campaign: null,
      campMsgs: [],
      campChars: [],
      messageDM: "",
      messageDescribe: "",
      messageSay: "",
      messageChat: ""
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleMessageInput = this.handleMessageInput.bind(this);

  }

  componentDidMount() {
    this.props.fetchUser(this.props.currentUser.id)
      .then(() => this.setState({currentUser: this.props.currentUser}));
      
    this.props.fetchCampaignByName(this.props.match.params.name)
      .then(dat => {
        this.setState({campaign: dat.campaign.data})
        this.props.getCampaignCharacters(dat.campaign.data._id)
          .then(dat => {
            this.setState({campChars: dat.characters.data});

          })
      });

  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.campaign !== this.props.campaign) {
      this.setState({campaign: this.props.campaign });
    }

    if (prevProps.characters !== this.props.characters) {
      let {character_ids} = this.props.campaign;
      let {characters} = this.props;
      this.setState({
        campChars: Object.values(characters)
          .filter(char => character_ids.includes(char._id))
        }
      )

      if (this.state.currentUser) {
        const { campaign, currentUser } = this.state;
        let inter = campaign.character_ids
          .filter(id => currentUser.character_ids);
        if (inter.length) this.setState({
          userChar: Object.values(this.props.characters)
            .filter(char => char._id === inter[0])[0]
        })
      }

    }

  }

  getMessageButtons() {
    const { campaign, currentUser } = this.state;
    let buttons = []

    if (campaign.created_by === currentUser._id) {
      buttons.push(
        <button key="message-btn-dm"
          className="message-btn btn-glow"
          onClick={() => this.showMessageForm("dm")}
        >DM
        </button>
      )
    }

    return buttons.concat([
      <button key="message-btn-describe"
        className="message-btn btn-glow"
        onClick={() => this.showMessageForm("describe")}
      >Describe
      </button>,
      <button key="message-btn-say"
        className="message-btn btn-glow"
        onClick={() => this.showMessageForm("say")}
      >Say
      </button>,
      <button key="message-btn-chat"
        className="message-btn btn-glow"
        onClick={() => this.showMessageForm("chat")}
      >Chat
      </button>
    ]);


  }
  handleMessageInput(which) {
    return event => this.setState({ [which]: event.target.value });
  }
  getMessageForms() {
    let { messageChat, messageSay, messageDescribe, messageDM } = this.state;

 

    return (
      <>
        <form id="chat" className="message-form">
          <textarea className="chat"
            rows={`${2 + Math.floor(messageChat.length / 125)}`}
            type="text"
            onChange={this.handleMessageInput("messageChat")}
            onKeyDown={this.onMessageEnter("messageChat")}
            value={messageChat}
            placeholder="Chat..."
          />
        </form>

        <form id="say" className="message-form">
          <textarea className="say"
            rows={`${2 + Math.floor(messageChat.length / 125)}`}
            type="text"
            onChange={this.handleMessageInput("messageSay")}
            onKeyDown={this.onMessageEnter("messageSay")}
            value={messageSay}
            placeholder="Say..."
          />
        </form>

        <form id="describe" className="message-form">
          <textarea className="describe"
            rows={`${2 + Math.floor(messageChat.length / 125)}`}
            type="text"
            onChange={this.handleMessageInput("messageDescribe")}
            onKeyDown={this.onMessageEnter("messageDescribe")}
            value={messageDescribe}
            placeholder="Describe..."
          />
        </form>

        <form id="dm" className="message-form">
          <textarea className="dm"
            rows={`${2 + Math.floor(messageChat.length / 125)}`}
            type="text"
            onChange={this.handleMessageInput("messageDM")}
            onKeyDown={this.onMessageEnter("messageDM")}
            value={messageDM}
            placeholder="DM..."
          />
        </form>

      </>

    )

  }
  handleSubmit(which) {
    const { currentUser, campaign, userChar } = this.state;
    let character_id = (userChar && ["messageSay", "messageDescribe"].includes(which)) ? userChar._id : null;
    let newMessage = Object.assign({
      body: this.state[which],
      user_id: currentUser._id,
      campaign_id: campaign._id,
      character_id: character_id,
      // ...( !(userChar && which === "messageSay") && { character_id: userChar._id } ),
      type: which.slice(7)
    })
    this.setState({ [which]: "" });
    console.log(newMessage);
    this.props.createMessage(newMessage);
    return event => event.prevenDefault();
  }
  onMessageEnter(which) {
    return event => {
      if (event.keyCode === 13 && event.shiftKey == false) {
        event.preventDefault();
        this.handleSubmit(which);
      }
    }
  }
  showMessageForm(which) {
    let forms = document.getElementsByClassName("message-form");
    let form = document.getElementById(which);

    if (form.style.display === "block") {
      form.style.display = "none";
      return;
    }

    for (let form of forms) {
      form.style.display = "none"
    }
    form.style.display = "block";
    form.getElementsByClassName(which)[0].focus();
    form.getElementsByClassName(which)[0].select();
  }


  render() {
    const { campaign, currentUser, campChars, userChar } = this.state;

    let campMessageIndex, messageButtons, messageForms = <div></div>;
    if (campChars.length && currentUser && campaign) {
      campMessageIndex = <CampaignMessageIndexContainer
        currentUser={currentUser}
        campaign={campaign}
        characters={campChars}
        userChar={userChar}
      />

      messageButtons = this.getMessageButtons();
      messageForms = this.getMessageForms();
    }


    return (
      <div id="campaign-show">
        <div id="campaign-show-container">

          <div id="campaign-content">
            <h1>Campaign Name</h1>
            <div id="campaign">
              {campMessageIndex}
            </div>

            <div id="campaign-content-footer">
              {/* <h1>Command Content Here</h1> */}
              <div id="campaign-command">

                {messageForms}

                <div className="message-btns">
                  {messageButtons}
                </div>
              </div>
            </div>

          </div>

          <div id="campaign-extra">
            <h1>Extra Chat Content Here?</h1>
            <div id="campaign-extra-content">
            </div>
          </div>

        </div>
      </div>
    )
  }

}

export default CampaignShow;
