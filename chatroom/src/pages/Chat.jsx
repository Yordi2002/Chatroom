import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";

const Chat = () =>{
  const [ state, setState ] = useState({ message: "", name: ""})
	const [ chat, setChat ] = useState([])

	const socketRef = useRef()

	useEffect(
		() => {
			socketRef.current = io.connect("ws://localhost:5500")
			socketRef.current.on("message", ({ name, message }) => {
				setChat([ ...chat, { name, message } ])
			})
			return () => socketRef.current.disconnect()
		},
		[ chat ]
	)

	const NaamOfBerichtChange = (e) => {
		setState({ ...state, [e.target.name]: e.target.value })
	}

	const onMessageSubmit = (e) => {
		const { name, message } = state
    if(!name || !message){
      alert("Vul een naam en bericht in!");
      e.preventDefault()
    }else {
      socketRef.current.emit("message", { name, message })
      e.preventDefault()
      setState({ message: "", name })
    }
		
	}
	const ShowChat = () => {
		return chat.map(({ name, message }, index) => (
			<div key={index}>
				<p id="chatBox">
					<b>{name}:</b> <span>{message}</span>
				</p>
			</div>
		))
	}

	return (
		<>
		<div className="ChatContent">
			<form onSubmit={onMessageSubmit}>
				<div className="NaamVeld">
					<input name="name" onChange={(e) => NaamOfBerichtChange(e)} value={state.name} label="Name" placeholder="Naam..."/>
				</div>
				<div className="MessageVeld">
					<input
						name="message" onChange={(e) => NaamOfBerichtChange(e)} value={state.message} label="Message" placeholder="Typ een bericht..."
					/>
				</div>
				<button onClick>Versturen</button>
			</form>
			
		</div>
		<div className="ChatBoxContainer">
			{ShowChat()}
		</div>
	</>
  );
};
export default Chat;
