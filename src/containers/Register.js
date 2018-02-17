import React, { Component } from 'react';
import {
    Form,
    StyledText,
    StyledTextArea,
    StyledRadio,
    StyledRadioGroup,
    StyledSelect,
    StyledCheckbox
} from 'react-form';

const statusOptions = [
    {
        label: 'Single',
        value: 'single'
    },
    {
        label: 'In a Relationship',
        value: 'relationship'
    },
    {
        label: "It's Complicated",
        value: 'complicated'
    }
];

class StyledForm extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    errorValidator = (values) => {
        const validateFirstName = (firstName) => {
            return !firstName ? '* First name is required.' : null;
        };
        const validateLastName = (lastName) => {
            return !lastName ? '* Last name is required.' : null;
        };
        const validateGender = (gender) => {
            return !gender ? '* Gender is required.' : null;
        };
        const validateBio = (bio) => {
            return !bio ? '* Bio is required.' : null;
        };
        const validateAuthorize = (authorize) => {
            return !authorize ? '* Please check authorize.' : null;
        };
        const validateStatus = (status) => {
            return !status ? '* Status is required.' : null;
        };
        return {
            firstName: validateFirstName(values.firstName),
            lastName: validateLastName(values.lastName),
            gender: validateGender(values.gender),
            bio: validateBio(values.bio),
            authorize: validateAuthorize(values.authorize),
            status: validateStatus(values.status)
        };
    }

    warningValidator = (values) => {
        const validateFirstName = (firstName) => {
            return firstName && firstName.length < 2 ? '* First name must be longer than 2 characters.' : null;
        };
        const validateLastName = (lastName) => {
            return lastName && lastName.length < 2 ? '* Last name must be longer than 2 characters.' : null;
        };
        const validateBio = (bio) => {
            return bio && bio.replace(/s+/g, ' ').trim().split(' ').length < 5 ? '* Bio should have more than 5 words.' : null;
        };
        return {
            firstName: validateFirstName(values.firstName),
            lastName: validateLastName(values.lastName),
            gender: null,
            bio: validateBio(values.bio),
            authorize: null,
            status: null
        };
    }

    successValidator = (values, errors) => {
        const validateFirstName = () => {
            return !errors.firstName ? '' : null;
        };
        const validateLastName = () => {
            return !errors.lastName ? '' : null;
        };
        const validateGender = () => {
            return !errors.gender ? 'Thanks for entering your gender.' : null;
        };
        const validateBio = () => {
            return !errors.bio ? 'Cool Bio!' : null;
        };
        const validateAuthorize = () => {
            return !errors.authorize ? 'You are now authorized.' : null;
        };
        const validateStatus = () => {
            return !errors.status ? 'Thanks for entering your status.' : null;
        };
        return {
            firstName: validateFirstName(values.firstName),
            lastName: validateLastName(values.lastName),
            gender: validateGender(values.gender),
            bio: validateBio(values.bio),
            authorize: validateAuthorize(values.authorize),
            status: validateStatus(values.status)
        };
    }
    render = () => {
        return (
            <Form
                validateError={this.errorValidator}
                validateWarning={this.warningValidator}
                validateSuccess={this.successValidator}
                onSubmit={submittedValues => this.setState({ submittedValues }, () => { console.log(this.state) })}>
                {formApi => (
                    <form onSubmit={formApi.submitForm} id="form2">
                        <label htmlFor="firstName">First name</label>
                        <StyledText field="firstName" id="firstName" />
                        <label htmlFor="lastName">Last name</label>
                        <StyledText field="lastName" id="lastName" />
                        <label>Choose Gender</label>
                        <StyledRadioGroup field="gender">
                            {group => (
                                <div>
                                    <StyledRadio group={group} value="male" id="male" label="Male" className="mr-3 d-inline-block" />
                                    <StyledRadio group={group} value="female" id="female" label="Female" className="d-inline-block" />
                                </div>
                            )}
                        </StyledRadioGroup>
                        <label htmlFor="bio">Bio</label>
                        <StyledTextArea field="bio" id="bio" />
                        <StyledCheckbox field="authorize" id="authorize" label="Authorize" className="d-inline-block" />
                        <label htmlFor="status" className="d-block">Relationship status</label>
                        <StyledSelect field="status" id="status" options={statusOptions} />
                        <button type="submit" className="mb-4 btn btn-primary">Submit</button>
                    </form>
                )}
            </Form>

        )
    }
}

export default StyledForm;