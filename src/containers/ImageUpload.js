import React, { Component } from 'react';
import {
    Form
} from 'react-form';
import "../styles/forms.css";

class StyledForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            kitchenName: "default"
        };
    }

    submit = (submittedValues) => {
        let id = localStorage.getItem('mykitchen');
        let access_token = localStorage.getItem('access_token');
        let url = `/api/kitchens/${id}/images/upload`;

        fetch(url, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                access_token,
                image: this.state.image
            })
        })
            .then(res => res.json())
            .then(kitchen => {
                this.setState({ images: kitchen.images, kitchenName: kitchen.name, image: null, message: "Image uploaded" })
                document.getElementById("image").value = "";
            })
            .catch(err => {
                this.setState({ message: "Error uploading. Try again later." })
            })
    }

    handleFile = (e) => {

        const reader = new FileReader();
        const file = e.target.files[0];

        reader.onload = (upload) => {
            this.setState({
                image: upload.target.result
            });
        };

        reader.readAsDataURL(file);
    }

    render = () => {
        if (this.state.images) {
            var images = []
            for (let image of this.state.images) {
                images.push(<div>
                    <img src={image.thumbnail} alt={this.state.kitchenName} />
                    <input type="checkbox" />
                </div>
                );
            }
        }
        return (<div>
            <Form
                onSubmit={this.submit}
                defaultValues={{ rememberMe: true }}>
                {formApi => (
                    <div>
                        <form onSubmit={formApi.submitForm} id="form2" className="form-container">
                            <div className="input-div" >
                                <label htmlFor="image">Upload an image</label>
                                <input type="file" accept="image/*" field="image" id="image" onChange={this.handleFile} />
                            </div>
                            {this.state.image ?
                                <img src={this.state.image} alt="kitchen" className="upload-thumb" />
                                :
                                null
                            }
                            <div className="input-div" >
                                <button id="submit" type="submit" className="mb-4 btn btn-orange">Upload</button>
                            </div>
                            <h4 className="uploaded-message">{this.state.message}</h4>
                        </form>
                        {images ?
                            <div className="images-container">
                                <div>
                                    {images}
                                </div>

                                <button id="delete" type="submit" className="mb-4 btn btn-danger">
                                    <i class="fa fa-trash" aria-hidden="true"></i>&nbsp; Remove
                                    </button>
                            </div>

                            : null
                        }
                    </div>
                )}
            </Form>
        </div>

        )
    }
}

export default StyledForm;