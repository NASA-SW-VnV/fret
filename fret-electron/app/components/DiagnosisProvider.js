import React from 'react';
export const DiagnosisContext = React.createContext();  //exporting context object
class DiagnosisProvider extends React.Component {
	state = {reqs: [],
			 color: ''}
	setMessage = (value) => {
		this.setState({
			reqs : value.reqs,
			color : value.color
		});
	}

	render() {
	        return (
	            <DiagnosisContext.Provider value={{ state: this.state, setMessage: this.setMessage}}>
	            {this.props.children}
	            </DiagnosisContext.Provider>)
	    }
}

export default DiagnosisProvider;
