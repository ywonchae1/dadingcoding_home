import React from 'react';

export default class Receive extends React.Component {
    state = {
        tid: "",
    };

    handlChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        });
    };

    onclick = () => {
        const tidbox = {
          inTid: this.state.tid,
        };
        fetch("http://localhost:3000/teacher", {
          method: "get", //통신방법
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(tidbox),
        })
        .then((res) => res.json()) //추가된 부분
        .then((json) => {
        console.log(json);
        this.setState({ 
            tid: json.tid,
        });
        });
    };
    render() {
        return (
            <div>
            <input name="text" onChange={this.handlChange}></input>
            <button onClick={this.onclick}>전송</button>
            <h3>{this.state.text}</h3>
            </div>
        );
    }
}