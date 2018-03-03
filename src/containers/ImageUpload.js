import React, { Component } from 'react';
import {
    Form
} from 'react-form';
import "../styles/forms.css";

class StyledForm extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    submit = (submittedValues) => {
        let url = 'http://0.0.0.0:8080/api/kitchens/image';
        fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                data_uri: this.state.data_uri
            })
        })
            .then(res => res.json())
            .then(url => {
                console.log(url)
                this.setState({ img_uri: url })
            })
    }

    handleFile = (e) => {

        const reader = new FileReader();
        const file = e.target.files[0];

        reader.onload = (upload) => {
            this.setState({
                data_uri: upload.target.result,
                img_uri: upload.target.result
            });
        };

        reader.readAsDataURL(file);
    }

    render = () => {
        return (
            <Form
                onSubmit={this.submit}
                defaultValues={{ rememberMe: true }}>
                {formApi => (
                    <form onSubmit={formApi.submitForm} id="form2" className="form-container">
                        <div className="input-div" >
                            <label htmlFor="image">Upload an image</label>
                            <input type="file" accept="image/*" field="image" id="image" onChange={this.handleFile} />
                        </div>
                        {this.state.img_uri ?
                            <img src={this.state.img_uri} alt="kitchen" className="upload-thumb" />
                            :
                            null
                        }
                        <div className="input-div" >
                            <button id="submit" type="submit" className="mb-4 btn btn-orange">Upload</button>
                        </div>
                    </form>
                )}
            </Form>

        )
    }
}

export default StyledForm;